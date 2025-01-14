-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_businessId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_userId_fkey`;

-- AlterTable
ALTER TABLE `review` MODIFY `userId` INTEGER NULL,
    MODIFY `businessId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `Review_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `business`(`businessId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;
