import express from "express";
import { loginUserHandler, loginUserSchema } from "./controllers/login";
import { logoutUserHandler } from "./controllers/logout";
import {
  registerUserHandler,
  registerUserSchema,
} from "./controllers/register";
import { deserializeUser } from "../../middlewares/deserializeUser";
import { requireUser } from "../../middlewares/requireUser";
import { validate } from "../../middlewares/validate";

const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUserHandler);

router.post("/login", validate(loginUserSchema), loginUserHandler);

router.post("/logout", deserializeUser, requireUser, logoutUserHandler);

export default router;
