import { RegisterUserSchema } from "../schema";
import { Prisma } from "@prisma/client";
import { RouteHandler } from "../../../types/handler";
import { respondSuccess } from "../../../utils/route-helpers";

export const registerUserHandler: RouteHandler<RegisterUserSchema> = async (
  req,
  res,
  next
) => {
  const context = res.locals.context;
  const { Services } = res.locals.context;

  try {
    const user = await Services.User.createUser(context, req);

    const sessionId = Services.Session.createUserLoginSession(
      context,
      res,
      user
    );

    respondSuccess(res, {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      sessionId,
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
