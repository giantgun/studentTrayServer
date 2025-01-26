/*
  Warnings:

  - Made the column `plan` on table `item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plan` on table `lodge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plan` on table `room` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plan` on table `service` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `item` MODIFY `plan` VARCHAR(191) NOT NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `lodge` MODIFY `plan` VARCHAR(191) NOT NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `room` MODIFY `plan` VARCHAR(191) NOT NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `service` MODIFY `plan` VARCHAR(191) NOT NULL DEFAULT 'free';
