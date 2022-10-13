import express from "express";
import { loginUserHandler } from "./controllers/login";
import { logoutUserHandler } from "./controllers/logout";
import { registerUserHandler } from "./controllers/register";
import { deserializeUser } from "../../middlewares/deserializeUser";
import { requireUser } from "../../middlewares/requireUser";
import { validate } from "../../middlewares/validate";
import { loginUserSchema, registerUserSchema } from "./schema";

const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUserHandler);

router.post("/login", validate(loginUserSchema), loginUserHandler);

// router.get("/refresh", refreshAccessTokenHandler);

router.get("/logout", deserializeUser, requireUser, logoutUserHandler);

export default router;
