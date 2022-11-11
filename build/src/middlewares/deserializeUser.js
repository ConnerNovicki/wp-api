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
exports.deserializeUser = void 0;
const deserializeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { Services } = res.locals.context;
    try {
        const sessionId = Services.Session.getAuthFromRequest(req);
        if (!sessionId) {
            return next(new Error("No session id - not logged in"));
        }
        const userStr = yield res.locals.context.Services.Redis.client.get(`user_session.${sessionId}`);
        console.log("whatt2");
        if (!userStr) {
            return next(new Error("No user in short term storage for session id"));
        }
        const user = JSON.parse(userStr);
        // @ts-ignore -- the whole point of this middleware is to define this.
        res.locals.shortUser = user;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.deserializeUser = deserializeUser;
