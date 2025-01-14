/*
  Warnings:

  - A unique constraint covering the columns `[schoolName]` on the table `School` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `School_schoolName_key` ON `School`(`schoolName`);
