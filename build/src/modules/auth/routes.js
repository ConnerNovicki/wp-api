"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_1 = require("./controllers/login");
const logout_1 = require("./controllers/logout");
const register_1 = require("./controllers/register");
const deserializeUser_1 = require("../../middlewares/deserializeUser");
const requireUser_1 = require("../../middlewares/requireUser");
const validate_1 = require("../../middlewares/validate");
const schema_1 = require("./schema");
const router = express_1.default.Router();
router.post("/register", (0, validate_1.validate)(schema_1.registerUserSchema), register_1.registerUserHandler);
router.post("/login", (0, validate_1.validate)(schema_1.loginUserSchema), login_1.loginUserHandler);
router.post("/logout", deserializeUser_1.deserializeUser, requireUser_1.requireUser, logout_1.logoutUserHandler);
exports.default = router;
