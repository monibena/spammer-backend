/*
  Warnings:

  - You are about to drop the column `messageId` on the `children` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "children" DROP CONSTRAINT "children_messageId_fkey";

-- AlterTable
ALTER TABLE "children" DROP COLUMN "messageId";
ALTER TABLE "children" ADD COLUMN     "parentId" STRING;

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
