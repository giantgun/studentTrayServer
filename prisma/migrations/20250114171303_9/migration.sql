/*
  Warnings:

  - Added the required column `numberOfLodges` to the `lodge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lodge` ADD COLUMN `numberOfLodges` INTEGER NOT NULL;
