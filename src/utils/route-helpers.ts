import { Response } from "express";

export function respondSuccess(
  res: Response,
  data?: Record<string, any>
): Response {
  return res.status(200).json({
    status: "success",
    ...(data && data),
  });
}
