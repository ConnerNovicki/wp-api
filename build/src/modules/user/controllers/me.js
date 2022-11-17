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
exports.getMeHandler = void 0;
const appError_1 = require("../../../utils/appError");
const route_helpers_1 = require("../../../utils/route-helpers");
const getMeHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortUser = res.locals.shortUser;
        if (!shortUser) {
            return next(new appError_1.AppError("Developer", "/me should deserialize user"));
        }
        return (0, route_helpers_1.respondSuccess)(res, {
            user: shortUser,
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.getMeHandler = getMeHandler;
