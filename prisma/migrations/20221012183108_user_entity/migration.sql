/*
  Warnings:

  - You are about to drop the column `verificationCode` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `salt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_verificationCode_idx";

-- DropIndex
DROP INDEX "users_email_verificationCode_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "verificationCode",
ADD COLUMN     "salt" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
