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
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const client_1 = require("@prisma/client");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./modules/auth/routes"));
const routes_2 = __importDefault(require("./modules/user/routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const injectContext_1 = require("./middlewares/injectContext");
const env = (0, validateEnv_1.default)();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        // parse application/x-www-form-urlencoded
        app.use(body_parser_1.default.urlencoded({ extended: false }));
        // parse application/json
        app.use(body_parser_1.default.json());
        // 2. Cookie Parser
        app.use((0, cookie_parser_1.default)());
        // 3. Cors
        app.use((0, cors_1.default)({
            origin: [config_1.default.get("origin")],
            credentials: true,
        }));
        app.use((0, injectContext_1.injectContext)(env, prisma));
        // ROUTES
        app.use("/api/auth", routes_1.default);
        app.use("/api/users", routes_2.default);
        // Testing
        app.get("/api/healthchecker", (_, res) => __awaiter(this, void 0, void 0, function* () {
            const message = yield res.locals.context.Services.Redis.client.get("try");
            res.status(200).json({
                status: "success",
                message,
            });
        }));
        // UNHANDLED ROUTES
        app.all("*", (req, res, next) => {
            next(new Error(`Route ${req.originalUrl} not found`));
        });
        // GLOBAL ERROR HANDLER
        app.use((err, req, res, next) => {
            err.status = err.status || "error";
            err.statusCode = err.statusCode || 500;
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        });
        const port = config_1.default.get("port");
        app.listen(port, () => {
            console.log(`Server on port: ${port}`);
        });
    });
}
bootstrap()
    .catch((err) => {
    throw err;
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
