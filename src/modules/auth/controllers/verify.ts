import { TypeOf, object, string } from "zod";
import { RouteHandler } from "./../../../types/handler";

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
export const verifyUserHandler: RouteHandler<VerifyUserInput> = async (
  req,
  res,
  next
) => {
  try {
    const { token } = req.query;

    // LOGIC...
  } catch (e) {}
};
