/*
  Warnings:

  - You are about to drop the column `title` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';
