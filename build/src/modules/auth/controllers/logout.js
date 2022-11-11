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
exports.logoutUserHandler = void 0;
const appError_1 = require("../../../utils/appError");
const route_helpers_1 = require("../../../utils/route-helpers");
const logoutUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const context = res.locals.context;
    const { Services } = context;
    try {
        // @ts-ignore
        const sessionId = Services.Session.getAuthFromRequest(req);
        if (!sessionId) {
            throw new appError_1.AppError("Authentication", "No session found");
        }
        if (sessionId) {
            yield Services.Session.deleteSession(context, res, sessionId);
        }
        (0, route_helpers_1.respondSuccess)(res);
    }
    catch (err) {
        next(err);
    }
});
exports.logoutUserHandler = logoutUserHandler;
