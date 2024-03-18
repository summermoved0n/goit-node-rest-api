import express from "express";
import usersControllers from "../controllers/usersControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  userRegisterSchema,
  userLoginSchema,
  userSubscriptionSchema,
} from "../schemas/usersSchemas.js";
import userValidator from "../middlewares/usersValidator.js";

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

usersRouter.get("/current", userValidator, usersControllers.getCurrent);

usersRouter.post("/logout", userValidator, usersControllers.logout);

usersRouter.patch(
  "/",
  userValidator,
  validateBody(userSubscriptionSchema),
  usersControllers.updateSubscription
);

export default usersRouter;
