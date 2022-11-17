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
exports.loginUserHandler = exports.loginUserSchema = void 0;
const route_helpers_1 = require("../../../utils/route-helpers");
const zod_1 = require("zod");
// Input
exports.loginUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email address is required",
        }).email("Invalid email address"),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }).min(8, "Invalid email or password"),
    }),
});
// Endpoint
const loginUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const context = res.locals.context;
    const { Services } = context;
    try {
        const { email, password } = req.body;
        const user = yield Services.User.findUser(context, email, password);
        const sessionId = Services.Session.createUserLoginSession(context, res, user);
        return (0, route_helpers_1.respondSuccess)(res, {
            sessionId,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                emailVerified: user.emailVerified,
            },
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.loginUserHandler = loginUserHandler;
