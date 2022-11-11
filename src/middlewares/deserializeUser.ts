import { NextFunction, Request } from "express";
import { IResponse, ShortUser } from "../types";

export const deserializeUser = async (
  req: Request,
  res: IResponse,
  next: NextFunction
) => {
  const { Services } = res.locals.context;
  try {
    const sessionId = Services.Session.getAuthFromRequest(req);

    if (!sessionId) {
      return next(new Error("No session id - not logged in"));
    }

    const userStr = await res.locals.context.Services.Redis.client.get(
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
