-- CreateTable
CREATE TABLE `imagesfordelete` (
    `transactionId` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imagesUrlArrayString` TEXT NOT NULL,
    `referenceText` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `imagesfordelete_referenceText_key`(`referenceText`),
    PRIMARY KEY (`transactionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
