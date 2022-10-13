import bcrypt from "bcryptjs";
import { CreateUserInput } from "../schema";
import { Prisma, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../../../utils/connectRedis";
import { RouteHandler } from "../../../types/handler";

// 60 minutes
const sessionIdExpiration = 1000 * 60 * 60;

const prisma = new PrismaClient();

export const registerUserHandler: RouteHandler<CreateUserInput> = async (
  req,
  res,
  next
) => {
  try {
    const userSalt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, userSalt);

    // const verifyCode = crypto.randomBytes(32).toString("hex");
    // const verificationCode = crypto
    //   .createHash("sha256")
    //   .update(verifyCode)
    //   .digest("hex");

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password: hashedPassword,
        salt: userSalt,
      },
    });

    // Generate a session on login and register
    const sessionId = uuidv4();
    res.cookie("session_id", sessionId, {
      httpOnly: false, // true,
      secure: false, // true,
      sameSite: "lax",
      expires: new Date(Date.now() + sessionIdExpiration),
    });

    const redisUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    redisClient.set(`user_session.${sessionId}`, JSON.stringify(redisUser));

    res.status(201).json({
      status: "success",
      data: {
        user: {
          name: user.name,
          email: user.email,
          id: user.id,
        },
      },
    });
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          status: "fail",
          message: "Email already exist, please use another email address",
        });
      }
    }
    next(err);
  }
};
