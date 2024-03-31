import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import "dotenv/config.js";
import * as usersServices from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import sendEmail from "../helpers/sendEmail.js";

const avatarsPath = path.resolve("public", "avatars");

const { JWT_SECRET, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email } = req.body;
  const user = await usersServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = nanoid();

  const avatar = gravatar.url(email);
  const newUser = await usersServices.register({
    ...req.body,
    avatar,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Click to verify</a>`,
  };

  await sendEmail(verifyEmail);

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
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const newAvatar = path.join("public", "avatars", filename);

  Jimp.read(newAvatar)
    .then((avatar) => {
      return avatar.resize(250, 250).write(newAvatar);
    })
    .catch((err) => {
      console.error(err);
    });

  const result = await usersServices.updateAvatars(id, {
    avatarURL: newAvatar,
  });

  res.json(result);
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await usersServices.findUser({ verificationToken });
  const { _id: id } = user;

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await usersServices.updateUser(
    { _id: id },
    { verify: true, verificationToken: null }
  );

  res.json({
    message: "Verification successful",
  });
};

const resendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await usersServices.findUser({ email });
  const { verificationToken } = user;

  if (!user) {
    throw HttpError(404);
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Click to verify</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resendEmail: ctrlWrapper(resendEmail),
};
