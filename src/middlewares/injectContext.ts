import { Request, Response, NextFunction } from "express";
import { IContext } from "../types";
import MailService from "../services/mail";
import winston from "winston";
import { Environment } from "../utils/validateEnv";
import RedisService from "../services/redis";

export const injectContext =
  (env: Environment) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logger = winston.createLogger({
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
        logger.add(
          new winston.transports.Console({
            format: winston.format.simple(),
          })
        );
      }

      const mail = new MailService({
        apiKey:
          "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",
        logger,
      });
      const redis = new RedisService("redis://localhost:6379");

      const context: IContext = {
        services: {
          mail,
          logger,
          redis,
        },
        env,
      };

      res.locals.context = context;

      next();
    } catch (err: any) {
      next(err);
    }
  };
