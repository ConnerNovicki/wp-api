import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ShortUser } from "../types";
// import { omit } from "lodash";
// import { excludedFields, findUniqueUser } from "../services/user.service";
// import AppError from "../utils/appError";
import redisClient from "../utils/connectRedis";
// import { verifyJwt } from "../utils/jwt";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.cookies.session_id;

    if (!sessionId) {
      return next(new Error("No session id - not logged in"));
    }

    const userStr = await redisClient.get(`user_session.${sessionId}`);

    if (!userStr) {
      return next(new Error("No user in short term storage for session id"));
    }

    const user = JSON.parse(userStr) as ShortUser;

    res.locals.user = user;

    next();
  } catch (err: any) {
    next(err);
  }
};
