"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserSchema = exports.registerUserSchema = exports.loginUserSchema = void 0;
const zod_1 = require("zod");
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
exports.registerUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        firstName: (0, zod_1.string)({
            required_error: "Name is required",
        }),
        lastName: (0, zod_1.string)({
            required_error: "Name is required",
        }),
        email: (0, zod_1.string)({
            required_error: "Email address is required",
        }).email("Invalid email address"),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        })
            .min(8, "Password must be more than 8 characters")
            .max(32, "Password must be less than 32 characters"),
        passwordConfirm: (0, zod_1.string)({
            required_error: "Please confirm your password",
        }),
    }).refine((data) => data.password === data.passwordConfirm, {
        path: ["passwordConfirm"],
        message: "Passwords do not match",
    }),
});
exports.verifyUserSchema = (0, zod_1.object)({
    query: (0, zod_1.object)({
        token: (0, zod_1.string)({
            required_error: "Token is required",
        }),
    }),
});
