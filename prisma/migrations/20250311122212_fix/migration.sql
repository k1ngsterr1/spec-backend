/*
  Warnings:

  - You are about to drop the column `isPaid` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "isPaid",
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL;
