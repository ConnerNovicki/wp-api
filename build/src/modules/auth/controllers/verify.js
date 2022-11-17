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
exports.verifyUserHandler = exports.verifyUserSchema = void 0;
const zod_1 = require("zod");
// Input
exports.verifyUserSchema = (0, zod_1.object)({
    query: (0, zod_1.object)({
        token: (0, zod_1.string)({
            required_error: "Token is required",
        }),
    }),
});
// Output
// Endpoint
const verifyUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.query;
        // LOGIC...
    }
    catch (e) { }
});
exports.verifyUserHandler = verifyUserHandler;
