import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { LoginUserSchema } from "../schema";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../../../utils/connectRedis";
import { RouteHandler } from "../../../types/handler";
import { AppError } from "../../../utils/appError";

const prisma = new PrismaClient();
const sessionIdExpiration = 1000 * 60 * 60;

export const loginUserHandler: RouteHandler<LoginUserSchema> = async (
  req,
  res,
  next
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      select: {
        email: true,
        id: true,
        verified: true,
        password: true,
        name: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user?.password))) {
      return next(
        new AppError(
          "Authentication",
          "Email does not exist or Passwords do not match"
        )
      );
    }

    const sessionId = uuidv4();
    res.cookie("session_id", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: new Date(Date.now() + sessionIdExpiration),
    });

    const redisUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    redisClient.set(`user_session.${sessionId}`, JSON.stringify(redisUser));

    return res.status(201).json({
      status: "success",
      data: {
        sessionId,
      },
    });
  } catch (err) {
    return next(err);
  }
};
