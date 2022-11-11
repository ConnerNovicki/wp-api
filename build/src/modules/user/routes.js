"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deserializeUser_1 = require("../../middlewares/deserializeUser");
const requireUser_1 = require("../../middlewares/requireUser");
const me_1 = require("./controllers/me");
const router = express_1.default.Router();
router.use(deserializeUser_1.deserializeUser, requireUser_1.requireUser);
router.get("/me", me_1.getMeHandler);
exports.default = router;
