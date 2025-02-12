-- AlterTable
ALTER TABLE `lodge` MODIFY `electricityDescription` LONGTEXT NULL,
    MODIFY `waterDescription` LONGTEXT NULL,
    MODIFY `networkDescription` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `room` MODIFY `electricityDescription` LONGTEXT NULL,
    MODIFY `waterDescription` LONGTEXT NULL,
    MODIFY `networkDescription` LONGTEXT NULL,
    MODIFY `dateOfBirth` VARCHAR(191) NULL;
