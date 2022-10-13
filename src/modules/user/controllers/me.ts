import { AuthRouteHandler } from "../../../types/handler";
import { AppError } from "../../../utils/appError";

export const getMeHandler: AuthRouteHandler = async (req, res, next) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return next(new AppError("Developer", "/me should deserialize user"));
    }

    return res.send(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    return next(err);
  }
};
