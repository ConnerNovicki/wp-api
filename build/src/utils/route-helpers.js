"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondSuccess = void 0;
function respondSuccess(res, data) {
    return res.status(200).json(Object.assign({ status: "success" }, (data && data)));
}
exports.respondSuccess = respondSuccess;
