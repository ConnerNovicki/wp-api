import { VerifyUserSchema } from "../schema";
import { RouteHandler } from "./../../../types/handler";

export const verifyUserHandler: RouteHandler<VerifyUserSchema> = async (
  req,
  res,
  next
) => {
  req.query.token;
};
