import { NextFunction, Request } from "express";
import { IResponse, ShortUser } from "../types";
// import { omit } from "lodash";
// import { excludedFields, findUniqueUser } from "../services/user.service";
// import AppError from "../utils/appError";
// import redisClient from "../utils/connectRedis";
// import { verifyJwt } from "../utils/jwt";

export const deserializeUser = async (
  req: Request,
  res: IResponse,
  next: NextFunction
) => {
  try {
    let sessionId;
    if (req.cookies.session_id) {
      console.log("here?", req.cookies.session_id);
      sessionId = req.cookies.session_id;
    } else if (req.headers.authorization) {
      const splitAuth = req.headers.authorization.split(" ");
      if (splitAuth[0] === "Bearer") {
        sessionId = splitAuth[1];
      }
    }

    if (!sessionId) {
      return next(new Error("No session id - not logged in"));
    }

    console.log("whatt");

    const userStr = await res.locals.context.services.redis.client.get(
      `user_session.${sessionId}`
    );
    console.log("whatt2");

    if (!userStr) {
      return next(new Error("No user in short term storage for session id"));
    }

    const user = JSON.parse(userStr) as ShortUser;

    // @ts-ignore -- the whole point of this middleware is to define this.
    res.locals.shortUser = user;

    next();
  } catch (err: any) {
    next(err);
  }
};
