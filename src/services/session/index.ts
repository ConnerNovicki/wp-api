import { User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { IContext, IResponse } from "../../types";
import { RedisUser } from "./types";
import { Request, Response } from "express";

// 60 minutes
const sessionIdExpiration = 1000 * 60 * 60;

const userSessionKey = (sessionId: string) => `user_session.${sessionId}`;

/**
 * Service to manage redis sessions
 */
export default class SessionService {
  createUserLoginSession(
    context: IContext,
    res: IResponse,
    user: User
  ): string {
    const { Services } = context;

    const sessionId = uuidv4();
    res.cookie("session_id", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: new Date(Date.now() + sessionIdExpiration),
    });

    const redisUser: RedisUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    Services.Redis.client.set(
      userSessionKey(sessionId),
      JSON.stringify(redisUser)
    );

    return sessionId;
  }

  getAuthFromRequest(req: Request): string | null {
    let sessionId: string | null = null;
    if (req.cookies.session_id) {
      sessionId = req.cookies.session_id;
    } else if (req.headers.authorization) {
      const splitAuth = req.headers.authorization.split(" ");
      if (splitAuth[0] === "Bearer") {
        sessionId = splitAuth[1];
      }
    }

    return sessionId;
  }

  deleteSession(context: IContext, res: Response, sessionId: string) {
    const { Services } = context;
    Services.Redis.client.del(userSessionKey(sessionId));

    res.cookie("session_id", "", { maxAge: -1 });
  }
}
