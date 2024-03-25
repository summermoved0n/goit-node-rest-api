import bcrypt from "bcrypt";

import User from "../models/Users.js";

export const findUser = (filter) => User.findOne(filter);

export const register = async (data, avatar) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, avatarURL: avatar, password: hashPassword });
};

export const validatePassword = async (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const updateSubscription = (id, data) =>
  User.findOneAndUpdate(id, data, { select: "email subscription" });
