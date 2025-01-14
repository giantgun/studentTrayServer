/*
  Warnings:

  - You are about to drop the column `dataOfBirth` on the `user` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `dataOfBirth`,
    ADD COLUMN `dateOfBirth` DATETIME(3) NOT NULL;
