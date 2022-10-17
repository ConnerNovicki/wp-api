import { RedisClientType } from "@redis/client";
import { createClient } from "redis";

export default class RedisService {
  private redisClient: RedisClientType;

  constructor(url: string) {
    this.redisClient = createClient({
      url,
    });

    this.connect();
  }

  async connect() {
    try {
      await this.redisClient.connect();
      console.log("Redis client connect successfully");
      this.redisClient.set(
        "try",
        "Welcome to Express and TypeScript with Prisma"
      );
    } catch (error) {
      console.log(error);
      setTimeout(this.connect, 5000);
    }
  }

  get client(): RedisClientType {
    return this.redisClient;
  }
}
