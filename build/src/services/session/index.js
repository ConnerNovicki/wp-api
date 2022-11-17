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
        const { Services } = context;
        const sessionId = (0, uuid_1.v4)();
        res.cookie("session_id", sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            expires: new Date(Date.now() + sessionIdExpiration),
        });
        const redisUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            emailVerified: user.emailVerified,
        };
        Services.Redis.client.set(userSessionKey(sessionId), JSON.stringify(redisUser));
        return sessionId;
    }
    getAuthFromRequest(req) {
        let sessionId = null;
        if (req.cookies.session_id) {
            sessionId = req.cookies.session_id;
        }
        else if (req.headers.authorization) {
            const splitAuth = req.headers.authorization.split(" ");
            if (splitAuth[0] === "Bearer") {
                sessionId = splitAuth[1];
            }
        }
        return sessionId;
    }
    deleteSession(context, res, sessionId) {
        const { Services } = context;
        Services.Redis.client.del(userSessionKey(sessionId));
        res.cookie("session_id", "", { maxAge: -1 });
    }
}
exports.default = SessionService;
