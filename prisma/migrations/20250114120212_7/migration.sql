-- CreateIndex
CREATE FULLTEXT INDEX `item_description_idx` ON `item`(`description`);

-- CreateIndex
CREATE FULLTEXT INDEX `item_description_title_idx` ON `item`(`description`, `title`);

-- CreateIndex
CREATE FULLTEXT INDEX `lodge_description_idx` ON `lodge`(`description`);

-- CreateIndex
CREATE FULLTEXT INDEX `lodge_description_propertyType_idx` ON `lodge`(`description`, `propertyType`);

-- CreateIndex
CREATE FULLTEXT INDEX `room_description_idx` ON `room`(`description`);

-- CreateIndex
CREATE FULLTEXT INDEX `room_description_propertyType_idx` ON `room`(`description`, `propertyType`);

-- CreateIndex
CREATE FULLTEXT INDEX `service_description_idx` ON `service`(`description`);

-- CreateIndex
CREATE FULLTEXT INDEX `service_description_title_idx` ON `service`(`description`, `title`);
