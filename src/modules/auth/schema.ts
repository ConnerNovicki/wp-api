import { object, string, TypeOf, z } from "zod";

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

export type LoginUserSchema = TypeOf<typeof loginUserSchema>;

export const registerUserSchema = object({
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

export type RegisterUserSchema = TypeOf<typeof registerUserSchema>;

export const verifyUserSchema = object({
  query: object({
    token: string({
      required_error: "Token is required",
    }),
  }),
});

export type VerifyUserSchema = TypeOf<typeof verifyUserSchema>;
