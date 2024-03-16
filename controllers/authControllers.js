import * as authServices from "../services/authServices.js";

import HttpError from "../helpers/HttpError.js";

import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const signUp = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "This email already used");
  }

  const newUser = await authServices.signup(req.body);

  res.status(201).json({
    email: newUser.email,
    password: newUser.password,
  });
};

export default {
  signUp: ctrlWrapper(signUp),
};
