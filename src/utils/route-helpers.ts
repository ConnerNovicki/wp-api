import { Response } from "express";

export function respondSuccess<T>(res: Response, data?: T): Response<T> {
  return res.status(200).json({
    status: "success",
    ...(data && data),
  });
}
