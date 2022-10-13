import { AuthRouteHandler } from "../../../types/handler";
import { AppError } from "../../../utils/appError";

export const getMeHandler: AuthRouteHandler = async (req, res, next) => {
  try {
    const shortUser = res.locals.shortUser;

    if (!shortUser) {
      return next(new AppError("Developer", "/me should deserialize user"));
    }

    return res.status(201).json({
      status: "success",
      data: {
        user: shortUser,
      },
    });
  } catch (err: any) {
    return next(err);
  }
};
