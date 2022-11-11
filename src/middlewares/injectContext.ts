import { Request, Response, NextFunction } from "express";
import { IContext } from "../types";
import MailService from "../services/mail";
import winston from "winston";
import { Environment } from "../utils/validateEnv";
import RedisService from "../services/redis";
import I18nService from "../services/locale";
import { PrismaClient } from "@prisma/client";
import SessionService from "../services/session";
import UserService from "../services/user";

export const injectContext =
  (env: Environment, prisma: PrismaClient) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const Logger = winston.createLogger({
        level: "info",
        format: winston.format.json(),
        defaultMeta: { service: "user-service" },
        transports: [
          //
          // - Write all logs with importance level of `error` or less to `error.log`
          // - Write all logs with importance level of `info` or less to `combined.log`
          //
          new winston.transports.File({
            filename: "error.log",
            level: "error",
          }),
          new winston.transports.File({ filename: "combined.log" }),
        ],
      });

      if (process.env.NODE_ENV !== "production") {
        Logger.add(
          new winston.transports.Console({
            format: winston.format.simple(),
          })
        );
      }

      const Mail = new MailService({
        apiKey:
          "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",
        Logger,
      });
      const Redis = new RedisService("redis://localhost:6379");
      const I18n = new I18nService();
      const Session = new SessionService();
      const User = new UserService();

      const context: IContext = {
        Services: {
          Logger,
          Session,
          I18n,
          User,
          Mail,
          Db: prisma,
          Redis,
        },
        env,
      };

      res.locals.context = context;

      next();
    } catch (err: any) {
      next(err);
    }
  };
