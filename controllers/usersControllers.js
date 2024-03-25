import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import "dotenv/config.js";
import * as usersServices from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const avatarsPath = path.resolve("public", "avatars");

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { email } = req.body;
  const user = await usersServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatar = gravatar.url(email);
  const newUser = await usersServices.register(req.body, avatar);
  console.log(newUser);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await usersServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const comparedPassword = await usersServices.validatePassword(
    password,
    user.password
  );
  if (!comparedPassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await usersServices.updateUser({ _id: id }, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await usersServices.updateUser({ _id }, { token: "" });

  res.status(204).json();
};

const updateSubscription = async (req, res) => {
  const { _id: id } = req.user;
  const result = await usersServices.updateSubscription(id, req.body);

  res.json(result);
};

const updateAvatar = async (req, res) => {
  const { _id: id } = req.user;
  const { path: oldPath, filename } = req.file;

  console.log(filename);

  Jimp.read(filename)
    .then((avatar) => {
      return avatar.resize(250, 250).quality(60).greyscale().write(filename);
    })
    .catch((err) => {
      console.error(err);
    });

  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const newAvatar = path.join("public", "avatars", filename);
  const result = await usersServices.updateAvatars(id, {
    avatarURL: newAvatar,
  });

  res.json(result);
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
