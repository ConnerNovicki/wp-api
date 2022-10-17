import { NextFunction, Response, Request } from "express";
import { IAuthResponse, IResponse } from ".";

interface ISchema {
  query?: {};
  params?: {};
  body?: {};
}

export type RouteHandler<
  TSchema extends ISchema,
  TResponse extends IResponse = IResponse
> = (
  req: Request<TSchema["params"], TSchema["query"], TSchema["body"]>,
  res: TResponse,
  next: NextFunction
) => Promise<NextFunction | Response | void>;

export type AuthRouteHandler<TSchema extends ISchema = {}> = RouteHandler<
  TSchema,
  IAuthResponse
>;
