import { AuthRouteHandler } from "../../../types/handler";
import { AppError } from "../../../utils/appError";
import { respondSuccess } from "../../../utils/route-helpers";

export const getMeHandler: AuthRouteHandler = async (req, res, next) => {
  try {
    const shortUser = res.locals.shortUser;

    if (!shortUser) {
      return next(new AppError("Developer", "/me should deserialize user"));
    }

    return respondSuccess(res, {
      user: shortUser,
    });
  } catch (err: any) {
    return next(err);
  }
};
