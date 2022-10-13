import { User } from "@prisma/client";
import { Response } from "express";

export type ShortUser = Pick<User, "email" | "name" | "id" | "verified">;

export interface AuthResponse extends Response {
  locals: { shortUser: ShortUser };
}
