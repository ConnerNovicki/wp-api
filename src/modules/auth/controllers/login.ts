import { RouteHandler } from "../../../types/handler";
import { respondSuccess } from "../../../utils/route-helpers";
import { object, string, TypeOf } from "zod";
import { ShortUser } from "../../../types";

// Input
export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),
    password: string({
      required_error: "Password is required",
    }).min(8, "Invalid email or password"),
  }),
});

type LoginUserInput = TypeOf<typeof loginUserSchema>;

// Output
type LoginUserOutput = {
  sessionId: string;
  user: ShortUser;
};

// Endpoint
export const loginUserHandler: RouteHandler<
  LoginUserInput,
  LoginUserOutput
> = async (req, res, next) => {
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

    return respondSuccess(res, {
      sessionId,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    return next(err);
  }
};
