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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserHandler = void 0;
const client_1 = require("@prisma/client");
const route_helpers_1 = require("../../../utils/route-helpers");
const registerUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const context = res.locals.context;
    const { Services } = res.locals.context;
    try {
        const user = yield Services.User.createUser(context, req);
        const sessionId = Services.Session.createUserLoginSession(context, res, user);
        (0, route_helpers_1.respondSuccess)(res, {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            sessionId,
        });
    }
    catch (err) {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                return res.status(409).json({
                    status: "fail",
                    message: "Email already exist, please use another email address",
                });
            }
        }
        next(err);
    }
});
exports.registerUserHandler = registerUserHandler;
