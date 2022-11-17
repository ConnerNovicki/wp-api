import { AppError } from "../../utils/appError";
import { IContext } from "../../types";
import { CreateUserParams } from "./types";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import config from "config";

/**
 * Service for business logic associated to user accounts
 */
export default class UserService {
  constructor() {}

  async createUser(context: IContext, params: CreateUserParams): Promise<User> {
    const { Services } = context;
    const {
      body: { firstName, lastName, email, password, passwordConfirm },
    } = params;

    if (password !== passwordConfirm) {
      throw new AppError(
        "Validation",
        "password and passwordConfirm do not match"
      );
    }
    const userSalt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, userSalt);

    const emailLower = email.toLowerCase();

    const user = await Services.Db.user.create({
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
      to: "connernovicki@gmail.com", // email,
      text: Services.I18n.t("register.time_to_verify"),
      html: `
          <div>
            <p>Please verify your email address</p>
            <a href="${config.get<string>(
              "origin"
            )}/auth/verify?token=${TEMP_VERIFY_TOKEN}">Verify</a>
          </div>
        `,
      subject: Services.I18n.t("register.verify_your_email"),
    });

    return user;
  }

  async findUser(context: IContext, email: string, password: string) {
    const { Services } = context;
    const user = await Services.Db.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user || !(await bcrypt.compare(password, user?.password))) {
      throw new AppError(
        "Authentication",
        "Email does not exist or Passwords do not match"
      );
    }

    return user;
  }
}
