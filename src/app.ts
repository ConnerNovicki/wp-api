require("dotenv").config();
import express, { NextFunction, Response, Request } from "express";
import config from "config";
import validateEnv from "./utils/validateEnv";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import cors from "cors";
import winston from "winston";
import authRouter from "./modules/auth/routes";
import userRouter from "./modules/user/routes";
import { AppError } from "./utils/appError";
import bodyParser from "body-parser";
import { injectContext } from "./middlewares/injectContext";
import { IResponse } from "./types";

const env = validateEnv();

const prisma = new PrismaClient();
const app = express();

async function bootstrap() {
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  // 2. Cookie Parser
  app.use(cookieParser());

  // 3. Cors
  app.use(
    cors({
      origin: [config.get<string>("origin")],
      credentials: true,
    })
  );

  // 4. Logging
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: "error.log", level: "error" }),
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

  app.use(injectContext(env));

  // ROUTES
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);

  // Testing
  app.get("/api/healthchecker", async (_, res: IResponse) => {
    const message = await res.locals.context.services.redis.client.get("try");
    res.status(200).json({
      status: "success",
      message,
    });
  });

  // UNHANDLED ROUTES
  app.all("*", (req, res, next) => {
    next(new Error(`Route ${req.originalUrl} not found`));
  });

  // GLOBAL ERROR HANDLER
  app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    err.status = err.status || "error";
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });

  const port = config.get<number>("port");
  app.listen(port, () => {
    console.log(`Server on port: ${port}`);
  });
}

bootstrap()
  .catch((err) => {
    throw err;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
