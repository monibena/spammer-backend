/*
  Warnings:

  - You are about to drop the column `parentId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_parentId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "parentId";

-- CreateTable
CREATE TABLE "Child" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" STRING NOT NULL,
    "likes" INT4 NOT NULL DEFAULT 0,
    "parentId" STRING NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
