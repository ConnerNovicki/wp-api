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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("../../utils/appError");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("config"));
/**
 * Service for business logic associated to user accounts
 */
class UserService {
    constructor() { }
    createUser(context, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Services } = context;
            const { body: { firstName, lastName, email, password, passwordConfirm }, } = params;
            if (password !== passwordConfirm) {
                throw new appError_1.AppError("Validation", "password and passwordConfirm do not match");
            }
            const userSalt = yield bcryptjs_1.default.genSalt(12);
            const hashedPassword = yield bcryptjs_1.default.hash(password, userSalt);
            // const verifyCode = crypto.randomBytes(32).toString("hex");
            // const verifyToken = crypto
            //   .createHash("sha256")
            //   .update(verifyCode)
            //   .digest("hex");
            const emailLower = email.toLowerCase();
            const user = yield Services.Db.user.create({
                data: {
                    firstName,
                    lastName,
                    email: emailLower,
                    password: hashedPassword,
                    salt: {
                        create: {
                            value: userSalt,
                        },
                    },
                },
            });
            const TEMP_VERIFY_TOKEN = "123";
            Services.Mail.sendGenericEmail({
                to: "connernovicki@gmail.com",
                text: Services.I18n.t("register.time_to_verify"),
                html: `
          <div>
            <p>Please verify your email address</p>
            <a href="${config_1.default.get("origin")}/auth/verify?token=${TEMP_VERIFY_TOKEN}">Verify</a>
          </div>
        `,
                subject: Services.I18n.t("register.verify_your_email"),
            });
            return user;
        });
    }
    findUser(context, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Services } = context;
            const user = yield Services.Db.user.findUnique({
                where: {
                    email: email.toLowerCase(),
                },
            });
            if (!user || !(yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password))) {
                throw new appError_1.AppError("Authentication", "Email does not exist or Passwords do not match");
            }
            return user;
        });
    }
}
exports.default = UserService;
