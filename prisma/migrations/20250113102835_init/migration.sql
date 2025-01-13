-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `photoUrl` VARCHAR(255) NULL,
    `phoneNumber` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `schoolId` INTEGER NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `School` (
    `schoolId` INTEGER NOT NULL AUTO_INCREMENT,
    `schoolName` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`schoolId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service_School` (
    `serviceId` INTEGER NOT NULL,
    `schoolId` INTEGER NOT NULL,

    PRIMARY KEY (`serviceId`, `schoolId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `serviceId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `imagesUrlArrayString` TEXT NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `price` INTEGER NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `online` VARCHAR(191) NOT NULL DEFAULT '',
    `inPerson` VARCHAR(191) NOT NULL DEFAULT '',
    `jsonStingifiedAvailabilty` VARCHAR(191) NOT NULL,
    `priceType` VARCHAR(191) NOT NULL,
    `videoUrl` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `roomId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `schoolId` INTEGER NOT NULL,
    `imagesUrlArrayString` TEXT NOT NULL,
    `propertyType` VARCHAR(191) NOT NULL,
    `numberOfBedrooms` INTEGER NOT NULL,
    `numberOfBathrooms` INTEGER NOT NULL,
    `paymentFrequency` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `priceType` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `nearestSchool` VARCHAR(191) NOT NULL,
    `walkingTime` INTEGER NOT NULL,
    `kekeTime` INTEGER NOT NULL,
    `description` LONGTEXT NOT NULL,
    `WiFi` BOOLEAN NOT NULL DEFAULT false,
    `parking` BOOLEAN NOT NULL DEFAULT false,
    `electricity` BOOLEAN NOT NULL DEFAULT false,
    `water` BOOLEAN NOT NULL DEFAULT false,
    `electricityDescription` LONGTEXT NOT NULL,
    `waterDescription` LONGTEXT NOT NULL,
    `networkQuality` VARCHAR(191) NOT NULL,
    `networkDescription` LONGTEXT NOT NULL,
    `ownerName` VARCHAR(191) NOT NULL,
    `ownerPhone` VARCHAR(191) NOT NULL,
    `ownerProgramme` VARCHAR(191) NOT NULL,
    `yearOfStudy` VARCHAR(191) NOT NULL,
    `dateOfBirth` VARCHAR(191) NOT NULL,
    `additionalInfo` LONGTEXT NULL,
    `videoUrl` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lodge` (
    `lodgeId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `schoolId` INTEGER NOT NULL,
    `imagesUrlArrayString` TEXT NOT NULL,
    `propertyType` VARCHAR(191) NOT NULL,
    `numberOfBedrooms` INTEGER NOT NULL,
    `numberOfBathrooms` INTEGER NOT NULL,
    `paymentFrequency` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `priceType` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `nearestSchool` VARCHAR(191) NOT NULL,
    `walkingTime` INTEGER NOT NULL,
    `kekeTime` INTEGER NOT NULL,
    `description` LONGTEXT NOT NULL,
    `WiFi` BOOLEAN NOT NULL DEFAULT false,
    `parking` BOOLEAN NOT NULL DEFAULT false,
    `electricity` BOOLEAN NOT NULL DEFAULT false,
    `water` BOOLEAN NOT NULL DEFAULT false,
    `electricityDescription` LONGTEXT NOT NULL,
    `waterDescription` LONGTEXT NOT NULL,
    `networkQuality` VARCHAR(191) NOT NULL,
    `networkDescription` LONGTEXT NOT NULL,
    `videoUrl` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`lodgeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item_School` (
    `itemId` INTEGER NOT NULL,
    `schoolId` INTEGER NOT NULL,

    PRIMARY KEY (`itemId`, `schoolId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `itemId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `imagesUrlArrayString` TEXT NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `price` INTEGER NOT NULL,
    `condition` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `numberInStock` INTEGER NOT NULL,
    `videoUrl` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Business` (
    `businessId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `businessName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `nearestSchoolId` INTEGER NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `businessEmail` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `photoUrl` VARCHAR(255) NULL,
    `coverPhotoUrl` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Business_userId_key`(`userId`),
    PRIMARY KEY (`businessId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `reviewId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `businessId` INTEGER NOT NULL,
    `numberOfStars` INTEGER NOT NULL,
    `description` LONGTEXT NOT NULL,
    `ownerUserId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`reviewId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`schoolId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service_School` ADD CONSTRAINT `Service_School_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`serviceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service_School` ADD CONSTRAINT `Service_School_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`schoolId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`schoolId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lodge` ADD CONSTRAINT `Lodge_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lodge` ADD CONSTRAINT `Lodge_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`schoolId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item_School` ADD CONSTRAINT `Item_School_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`itemId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item_School` ADD CONSTRAINT `Item_School_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`schoolId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Business` ADD CONSTRAINT `Business_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Business` ADD CONSTRAINT `Business_nearestSchoolId_fkey` FOREIGN KEY (`nearestSchoolId`) REFERENCES `School`(`schoolId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `Business`(`businessId`) ON DELETE RESTRICT ON UPDATE CASCADE;
