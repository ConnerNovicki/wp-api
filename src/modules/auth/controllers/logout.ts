import { AuthRouteHandler } from "../../../types/handler";
import { AppError } from "../../../utils/appError";
import { respondSuccess } from "../../../utils/route-helpers";

export const logoutUserHandler: AuthRouteHandler = async (req, res, next) => {
  const context = res.locals.context;
  const { Services } = context;
  try {
    // @ts-ignore
    const sessionId = Services.Session.getAuthFromRequest(req);

    if (!sessionId) {
      throw new AppError("Authentication", "No session found");
    }

    if (sessionId) {
      await Services.Session.deleteSession(context, res, sessionId);
    }

    return respondSuccess(res);
  } catch (err: any) {
    next(err);
  }
};
