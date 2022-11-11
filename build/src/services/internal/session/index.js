"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
// 60 minutes
const sessionIdExpiration = 1000 * 60 * 60;
const userSessionKey = (sessionId) => `user_session.${sessionId}`;
/**
 * Service to manage redis sessions
 */
class SessionService {
    createUserLoginSession(context, res, user) {
        const { ApiServices } = context;
        const sessionId = (0, uuid_1.v4)();
        res.cookie("session_id", sessionId, {
            httpOnly: false,
            secure: false,
            sameSite: "lax",
            expires: new Date(Date.now() + sessionIdExpiration),
        });
        const redisUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
        ApiServices.Redis.client.set(userSessionKey(sessionId), JSON.stringify(redisUser));
        return sessionId;
    }
}
exports.default = SessionService;
