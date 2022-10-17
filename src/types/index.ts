import { User } from "@prisma/client";
import { Response } from "express";
import winston from "winston";
import MailService from "../services/mail";
import RedisService from "../services/redis";
import { Environment } from "../utils/validateEnv";

export type ShortUser = Pick<User, "email" | "name" | "id" | "verified">;

export interface IResponse extends Response {
  locals: { context: IContext };
}

export interface IAuthResponse extends IResponse {
  locals: { shortUser: ShortUser; context: IContext };
}

export interface IContext {
  services: {
    logger: winston.Logger;
    mail: MailService;
    redis: RedisService;
  };
  env: Readonly<Environment>;
}
