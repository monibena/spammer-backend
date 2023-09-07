-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "parentid" STRING;

-- CreateTable
CREATE TABLE "children" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" STRING NOT NULL,
    "likes" INT4 NOT NULL DEFAULT 0,
    "messageId" STRING,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
