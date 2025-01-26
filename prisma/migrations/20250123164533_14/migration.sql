/*
  Warnings:

  - You are about to drop the column `itemsPaidFor` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lodgesPaidFor` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `roomsPaidFor` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `servicesPaidFor` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `item` ADD COLUMN `plan` VARCHAR(191) NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `lodge` ADD COLUMN `plan` VARCHAR(191) NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `room` ADD COLUMN `plan` VARCHAR(191) NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `service` ADD COLUMN `plan` VARCHAR(191) NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `itemsPaidFor`,
    DROP COLUMN `lodgesPaidFor`,
    DROP COLUMN `roomsPaidFor`,
    DROP COLUMN `servicesPaidFor`,
    ADD COLUMN `itemsSubPlans` VARCHAR(191) NULL DEFAULT '[]',
    ADD COLUMN `lodgesSubPlans` VARCHAR(191) NULL DEFAULT '[]',
    ADD COLUMN `roomsSubPlans` VARCHAR(191) NULL DEFAULT '[]',
    ADD COLUMN `servicesSubPlans` VARCHAR(191) NULL DEFAULT '[]';
