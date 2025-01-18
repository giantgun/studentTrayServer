-- AlterTable
ALTER TABLE `item` ADD COLUMN `tier` VARCHAR(191) NOT NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `lodge` ADD COLUMN `tier` VARCHAR(191) NOT NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `room` ADD COLUMN `tier` VARCHAR(191) NOT NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE `service` ADD COLUMN `tier` VARCHAR(191) NOT NULL DEFAULT 'free';
