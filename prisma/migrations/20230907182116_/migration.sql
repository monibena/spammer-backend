/*
  Warnings:

  - You are about to drop the `children` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "children" DROP CONSTRAINT "children_parentId_fkey";

-- DropTable
DROP TABLE "children";

-- CreateTable
CREATE TABLE "Child" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" STRING NOT NULL,
    "likes" INT4 NOT NULL DEFAULT 0,
    "parentId" STRING,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
