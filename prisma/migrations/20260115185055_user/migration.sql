/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('active', 'inactive', 'blocked');

-- CreateEnum
CREATE TYPE "accountType" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('active', 'inactive');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(500) NOT NULL,
    "status" "userStatus" NOT NULL DEFAULT 'inactive',
    "accountType" "accountType" NOT NULL DEFAULT 'user',
    "firstLogin" BOOLEAN NOT NULL DEFAULT true,
    "phoneIsVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailIsVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailOtp" VARCHAR(6),
    "phoneOtp" VARCHAR(6),
    "emailOtpExpiry" TIMESTAMP(3),
    "phoneOtpExpiry" TIMESTAMP(3),
    "profilePicture" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "jwtToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "createdByIp" VARCHAR(100),
    "status" "TokenStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_phoneNumber_key" ON "user"("phoneNumber");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "token_userId_idx" ON "token"("userId");

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
