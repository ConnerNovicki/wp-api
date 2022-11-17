import { NextFunction, Response, Request } from "express";
import { IAuthResponse, IResponse } from ".";

interface Input {
  query?: {};
  params?: {};
  body?: {};
}

type Output = {};

export type RouteHandler<
  TInput extends Input,
  TOutput extends Output = Output,
  TResponse extends IResponse = IResponse
> = (
  req: Request<TInput["params"], TInput["query"], TInput["body"]>,
  res: TResponse,
  next: NextFunction
) => Promise<NextFunction | Response<TOutput> | void>;

export type AuthRouteHandler<
  TSchema extends Input = {},
  TOutput extends Output = {}
> = RouteHandler<TSchema, TOutput, IAuthResponse>;
