import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { userSignUpSchema, userSignInSchema } from "../schemas/userSchema.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validateBody(userSignUpSchema),
  authControllers.signUp
);

export default authRouter;
