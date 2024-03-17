import express from "express";
import usersControllers from "../controllers/usersControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../schemas/usersSchemas.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(userRegisterSchema),
  usersControllers.register
);

usersRouter.post(
  "/login",
  validateBody(userLoginSchema),
  usersControllers.login
);

export default usersRouter;
