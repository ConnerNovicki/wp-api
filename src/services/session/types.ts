import { User } from "@prisma/client";

export type RedisUser = Pick<
  User,
  "firstName" | "lastName" | "email" | "id" | "emailVerified"
>;
