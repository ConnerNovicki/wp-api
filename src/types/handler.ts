import { NextFunction, Response, Request } from "express";
import { AuthResponse } from ".";

export type RouteHandler<TRequestSchema = {}, TResponse = Response> = (
  req: Request<{}, {}, TRequestSchema>,
  res: TResponse,
  next: NextFunction
) => Promise<NextFunction | Response | void>;

export type AuthRouteHandler<TRequestSchema = {}> = RouteHandler<
  TRequestSchema,
  AuthResponse
>;
