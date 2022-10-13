import { Response } from "express";
import { AuthRouteHandler } from "../../../types/handler";
import redisClient from "../../../utils/connectRedis";

function logout(res: Response) {
  res.cookie("session_id", "", { maxAge: -1 });
}

export const logoutUserHandler: AuthRouteHandler = async (req, res, next) => {
  try {
    const sessionId = req.cookies.session_id;
    if (sessionId) {
      await redisClient.del(sessionId);
    }

    logout(res);

    res.status(200).json({
      status: "success",
    });
  } catch (err: any) {
    next(err);
  }
};
