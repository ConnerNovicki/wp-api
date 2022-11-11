"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectContext = void 0;
const mail_1 = __importDefault(require("../services/mail"));
const winston_1 = __importDefault(require("winston"));
const redis_1 = __importDefault(require("../services/redis"));
const locale_1 = __importDefault(require("../services/locale"));
const session_1 = __importDefault(require("../services/session"));
const user_1 = __importDefault(require("../services/user"));
const injectContext = (env, prisma) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Logger = winston_1.default.createLogger({
            level: "info",
            format: winston_1.default.format.json(),
            defaultMeta: { service: "user-service" },
            transports: [
                //
                // - Write all logs with importance level of `error` or less to `error.log`
                // - Write all logs with importance level of `info` or less to `combined.log`
                //
                new winston_1.default.transports.File({
                    filename: "error.log",
                    level: "error",
                }),
                new winston_1.default.transports.File({ filename: "combined.log" }),
            ],
        });
        if (process.env.NODE_ENV !== "production") {
            Logger.add(new winston_1.default.transports.Console({
                format: winston_1.default.format.simple(),
            }));
        }
        const Mail = new mail_1.default({
            apiKey: "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",
            Logger,
        });
        const Redis = new redis_1.default("redis://localhost:6379");
        const I18n = new locale_1.default();
        const Session = new session_1.default();
        const User = new user_1.default();
        const context = {
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
    }
    catch (err) {
        next(err);
    }
});
exports.injectContext = injectContext;
