import User from "../models/Users.js";

export const findUser = (filter) => User.findOne(filter);

export const signup = (data) => User.create(data);
