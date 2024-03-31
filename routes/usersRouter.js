import express from "express";
import usersControllers from "../controllers/usersControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  userRegisterSchema,
  userLoginSchema,
  userSubscriptionSchema,
  userChangeAvatar,
  usersResendEmail,
} from "../schemas/usersSchemas.js";
import userValidator from "../middlewares/usersValidator.js";
import upload from "../middlewares/upload.js";

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

usersRouter.patch(
  "/avatars",
  userValidator,
  validateBody(userChangeAvatar),
  upload.single("avatarURL"),
  usersControllers.updateAvatar
);

usersRouter.post(
  "/verify",
  validateBody(usersResendEmail),
  usersControllers.resendEmail
);

usersRouter.get("/verify/:verificationToken", usersControllers.verify);

export default usersRouter;
