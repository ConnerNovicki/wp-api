"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const errorCodes = {
    Developer: 409,
    Service: 412,
    Unknown: 408,
    Authentication: 402,
    Validation: 405,
};
class AppError {
    constructor(errorType, status, message) {
        this.status = status;
        this.message = message;
        this.statusCode = errorCodes[errorType];
    }
}
exports.AppError = AppError;
