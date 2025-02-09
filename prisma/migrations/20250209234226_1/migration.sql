-- CreateTable
CREATE TABLE `business` (
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
    INDEX `Business_nearestSchoolId_fkey`(`nearestSchoolId`),
    PRIMARY KEY (`businessId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item` (
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
    `tier` VARCHAR(191) NOT NULL DEFAULT 'free',
    `plan` VARCHAR(191) NOT NULL DEFAULT 'free',
    `planStatus` VARCHAR(191) NOT NULL DEFAULT 'active',
    `planCode` VARCHAR(191) NULL DEFAULT 'free',

    INDEX `Item_userId_fkey`(`userId`),
    FULLTEXT INDEX `item_description_idx`(`description`),
    FULLTEXT INDEX `item_description_title_idx`(`description`, `title`),
    PRIMARY KEY (`itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_school` (
    `itemId` INTEGER NOT NULL,
    `schoolId` INTEGER NOT NULL,

    INDEX `Item_School_schoolId_fkey`(`schoolId`),
    PRIMARY KEY (`itemId`, `schoolId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lodge` (
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
    `numberOfLodges` INTEGER NOT NULL,
    `agentFee` INTEGER NOT NULL,
    `tier` VARCHAR(191) NOT NULL DEFAULT 'free',
    `plan` VARCHAR(191) NOT NULL DEFAULT 'free',
    `planStatus` VARCHAR(191) NOT NULL DEFAULT 'active',
    `planCode` VARCHAR(191) NULL DEFAULT 'free',

    INDEX `Lodge_schoolId_fkey`(`schoolId`),
    INDEX `Lodge_userId_fkey`(`userId`),
    FULLTEXT INDEX `lodge_description_idx`(`description`),
    FULLTEXT INDEX `lodge_description_propertyType_idx`(`description`, `propertyType`),
    PRIMARY KEY (`lodgeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `reviewId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `businessId` INTEGER NULL,
    `numberOfStars` INTEGER NOT NULL,
    `description` LONGTEXT NOT NULL,
    `ownerUserId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Review_businessId_fkey`(`businessId`),
    INDEX `Review_userId_fkey`(`userId`),
    PRIMARY KEY (`reviewId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room` (
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
    `tier` VARCHAR(191) NOT NULL DEFAULT 'free',
    `plan` VARCHAR(191) NOT NULL DEFAULT 'free',
    `planStatus` VARCHAR(191) NOT NULL DEFAULT 'active',
    `planCode` VARCHAR(191) NULL DEFAULT 'free',

    INDEX `Room_schoolId_fkey`(`schoolId`),
    INDEX `Room_userId_fkey`(`userId`),
    FULLTEXT INDEX `room_description_idx`(`description`),
    FULLTEXT INDEX `room_description_propertyType_idx`(`description`, `propertyType`),
    PRIMARY KEY (`roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school` (
    `schoolId` INTEGER NOT NULL AUTO_INCREMENT,
    `schoolName` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `School_schoolName_key`(`schoolName`),
    PRIMARY KEY (`schoolId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service` (
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
    `videoUrl` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tier` VARCHAR(191) NOT NULL DEFAULT 'free',
    `plan` VARCHAR(191) NOT NULL DEFAULT 'free',
    `planStatus` VARCHAR(191) NOT NULL DEFAULT 'active',
    `planCode` VARCHAR(191) NULL DEFAULT 'free',

    INDEX `Service_userId_fkey`(`userId`),
    FULLTEXT INDEX `service_description_idx`(`description`),
    FULLTEXT INDEX `service_description_title_idx`(`description`, `title`),
    PRIMARY KEY (`serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_school` (
    `serviceId` INTEGER NOT NULL,
    `schoolId` INTEGER NOT NULL,

    INDEX `Service_School_schoolId_fkey`(`schoolId`),
    PRIMARY KEY (`serviceId`, `schoolId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `photoUrl` VARCHAR(255) NULL,
    `phoneNumber` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `schoolId` INTEGER NOT NULL,
    `itemsSubPlans` LONGTEXT NULL,
    `lodgesSubPlans` LONGTEXT NULL,
    `roomsSubPlans` LONGTEXT NULL,
    `servicesSubPlans` LONGTEXT NULL,
    `paystackCustomerCode` VARCHAR(191) NULL,
    `verified` BOOLEAN NULL DEFAULT false,
    `emailVtoken` LONGTEXT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_schoolId_fkey`(`schoolId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imagesfordelete` (
    `transactionId` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imagesUrlArrayString` TEXT NOT NULL,
    `referenceText` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `imagesfordelete_referenceText_key`(`referenceText`),
    PRIMARY KEY (`transactionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `business` ADD CONSTRAINT `Business_nearestSchoolId_fkey` FOREIGN KEY (`nearestSchoolId`) REFERENCES `school`(`schoolId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `business` ADD CONSTRAINT `Business_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item` ADD CONSTRAINT `Item_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_school` ADD CONSTRAINT `Item_School_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `item`(`itemId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_school` ADD CONSTRAINT `Item_School_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school`(`schoolId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lodge` ADD CONSTRAINT `Lodge_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school`(`schoolId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lodge` ADD CONSTRAINT `Lodge_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `Review_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `business`(`businessId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room` ADD CONSTRAINT `Room_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school`(`schoolId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room` ADD CONSTRAINT `Room_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `Service_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_school` ADD CONSTRAINT `Service_School_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school`(`schoolId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_school` ADD CONSTRAINT `Service_School_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `service`(`serviceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `User_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school`(`schoolId`) ON DELETE RESTRICT ON UPDATE CASCADE;
