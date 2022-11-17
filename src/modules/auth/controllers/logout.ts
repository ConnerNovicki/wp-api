import { object, string, TypeOf } from "zod";
import { AuthRouteHandler } from "../../../types/handler";
import { AppError } from "../../../utils/appError";
import { respondSuccess } from "../../../utils/route-helpers";

// Input
export const verifyUserSchema = object({
  query: object({
    token: string({
      required_error: "Token is required",
    }),
  }),
});

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>;

// Output

// Endpoint
export const logoutUserHandler: AuthRouteHandler<VerifyUserInput> = async (
  req,
  res,
  next
) => {
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
