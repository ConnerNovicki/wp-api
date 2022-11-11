"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUser = void 0;
const requireUser = (req, res, next) => {
    try {
        const user = res.locals.shortUser;
        if (!user) {
            return next(new Error(`Session has expired or user doesn't exist`));
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.requireUser = requireUser;
