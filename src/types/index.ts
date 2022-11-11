import { PrismaClient, User } from "@prisma/client";
import { Response } from "express";
import winston from "winston";
import I18nService from "../services/locale";
import MailService from "../services/mail";
import RedisService from "../services/redis";
import SessionService from "../services/session";
import UserService from "../services/user";
import { Environment } from "../utils/validateEnv";

export type ShortUser = Pick<
  User,
  "id" | "firstName" | "lastName" | "email" | "emailVerified"
>;

export interface IResponse extends Response {
  locals: { context: IContext };
}

export interface IAuthResponse extends IResponse {
  locals: { shortUser: ShortUser; context: IContext };
}

export interface IContext {
  Services: {
    Logger: winston.Logger;
    I18n: I18nService;
    User: UserService;
    Session: SessionService;
    Mail: MailService;
    Redis: RedisService;
    Db: PrismaClient;
  };
  env: Readonly<Environment>;
}
