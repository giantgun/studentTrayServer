-- AlterTable
ALTER TABLE `item` ADD COLUMN `planCode` VARCHAR(191) NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `lodge` ADD COLUMN `planCode` VARCHAR(191) NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `room` ADD COLUMN `planCode` VARCHAR(191) NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `service` ADD COLUMN `planCode` VARCHAR(191) NULL DEFAULT 'free';
