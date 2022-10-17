import { Response } from "express";
import { AuthRouteHandler } from "../../../types/handler";
import redisClient from "../../../utils/connectRedis";

function logout(res: Response) {
  res.cookie("session_id", "", { maxAge: -1 });
}

export const logoutUserHandler: AuthRouteHandler = async (req, res, next) => {
  try {
    let sessionId;
    if (req.cookies.session_id) {
      sessionId = req.cookies.session_id;
    } else if (req.headers.authorization) {
      const splitAuth = req.headers.authorization.split(" ");
      if (splitAuth[0] === "Bearer") {
        sessionId = splitAuth[1];
      }
    }
    if (sessionId) {
      await redisClient.del(`user_session.${sessionId}`);
    }

    logout(res);

    res.status(200).json({
      status: "success",
    });
  } catch (err: any) {
    next(err);
  }
};
