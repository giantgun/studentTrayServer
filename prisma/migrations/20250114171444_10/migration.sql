/*
  Warnings:

  - Added the required column `agentFee` to the `lodge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lodge` ADD COLUMN `agentFee` INTEGER NOT NULL;
