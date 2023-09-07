/*
  Warnings:

  - You are about to drop the column `parentid` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "parentid";
ALTER TABLE "Message" ADD COLUMN     "parentId" STRING;
