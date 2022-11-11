import { LoginUserSchema } from "../schema";
import { RouteHandler } from "../../../types/handler";
import { respondSuccess } from "../../../utils/route-helpers";

export const loginUserHandler: RouteHandler<LoginUserSchema> = async (
  req,
  res,
  next
) => {
  const context = res.locals.context;
  const { Services } = context;

  try {
    const { email, password } = req.body;
    const user = await Services.User.findUser(context, email, password);

    const sessionId = Services.Session.createUserLoginSession(
      context,
      res,
      user
    );

    return respondSuccess(res, { sessionId });
  } catch (err) {
    return next(err);
  }
};
