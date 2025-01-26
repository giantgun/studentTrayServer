-- AlterTable
ALTER TABLE `item` ADD COLUMN `planStatus` VARCHAR(191) NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `lodge` ADD COLUMN `planStatus` VARCHAR(191) NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `room` ADD COLUMN `planStatus` VARCHAR(191) NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `service` ADD COLUMN `planStatus` VARCHAR(191) NOT NULL DEFAULT 'active';
