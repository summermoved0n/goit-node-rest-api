import bcrypt from "bcrypt";

import User from "../models/Users.js";

export const findUser = (filter) => User.findOne(filter);

export const register = async (data) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password: hashPassword });
};

export const validatePassword = async (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);
