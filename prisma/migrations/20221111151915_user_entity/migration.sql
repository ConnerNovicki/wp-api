/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `salt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `verifyToken` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lastName]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[saltId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saltId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
DROP COLUMN "photo",
DROP COLUMN "salt",
DROP COLUMN "verified",
DROP COLUMN "verifyToken",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "firstName" VARCHAR(255) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(255) NOT NULL,
ADD COLUMN     "saltId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "salts" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "salts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personalAccounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "handle" VARCHAR(255) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personalAccounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalBankAccount" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "salts_userId_key" ON "salts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "personalAccounts_handle_key" ON "personalAccounts"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "personalAccounts_ownerId_key" ON "personalAccounts"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_lastName_key" ON "users"("lastName");

-- CreateIndex
CREATE UNIQUE INDEX "users_saltId_key" ON "users"("saltId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_saltId_fkey" FOREIGN KEY ("saltId") REFERENCES "salts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalAccounts" ADD CONSTRAINT "personalAccounts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalBankAccount" ADD CONSTRAINT "PersonalBankAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "personalAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
