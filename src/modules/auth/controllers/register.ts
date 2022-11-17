import { Prisma } from "@prisma/client";
import { object, string, TypeOf } from "zod";
import { ShortUser } from "../../../types";
import { RouteHandler } from "../../../types/handler";
import { respondSuccess } from "../../../utils/route-helpers";

// Input
const registerUserSchema = object({
  body: object({
    firstName: string({
      required_error: "Name is required",
    }),
    lastName: string({
      required_error: "Name is required",
    }),
    email: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),
    password: string({
      required_error: "Password is required",
    })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: string({
      required_error: "Please confirm your password",
    }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  }),
});

type RegisterUserInput = TypeOf<typeof registerUserSchema>;

// Output
type RegisterUserOutput = {
  user: ShortUser;
  sessionId: string;
};

// Endpoint
export const registerUserHandler: RouteHandler<
  RegisterUserInput,
  RegisterUserOutput
> = async (req, res, next) => {
  const context = res.locals.context;
  const { Services } = res.locals.context;

  try {
    const user = await Services.User.createUser(context, req);

    const sessionId = Services.Session.createUserLoginSession(
      context,
      res,
      user
    );

    return respondSuccess(res, {
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
    return next(err);
  }
};
