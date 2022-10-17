import { object, string, TypeOf, z } from "zod";
// import { RoleEnumType } from "../entities/user.entity";

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
    name: string({
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
    // role: z.optional(z.nativeEnum(RoleEnumType)),
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
