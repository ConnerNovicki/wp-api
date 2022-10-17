import crypto from "crypto";
import bcrypt from "bcryptjs";
import { RegisterUserSchema } from "../schema";
import { Prisma, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../../../utils/connectRedis";
import { RouteHandler } from "../../../types/handler";

// 60 minutes
const sessionIdExpiration = 1000 * 60 * 60;

const prisma = new PrismaClient();

export const registerUserHandler: RouteHandler<RegisterUserSchema> = async (
  req,
  res,
  next
) => {
  const context = res.locals.context;

  try {
    const userSalt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, userSalt);

    const verifyCode = crypto.randomBytes(32).toString("hex");
    const verifyToken = crypto
      .createHash("sha256")
      .update(verifyCode)
      .digest("hex");

    const name = req.body.name;
    const email = req.body.email.toLowerCase();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        salt: userSalt,
        verifyToken,
      },
    });

    context.services.mail.sendGenericEmail({
      to: "connernovicki@gmail.com", // email,
      text: "It's time to verify your email address.",
      html: `
          <div>
            <p>Please verify your email address</p>
            <a href="${context.env.BASE_URL}/auth/verify?token=${verifyToken}">Verify</a>
          </div>
        `,
      subject: "Verify your email",
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
        sessionId,
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
