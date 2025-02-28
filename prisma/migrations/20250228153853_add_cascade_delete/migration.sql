-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventCategory" DROP CONSTRAINT "EventCategory_userId_fkey";

-- DropForeignKey
ALTER TABLE "Quota" DROP CONSTRAINT "Quota_userId_fkey";

-- AddForeignKey
ALTER TABLE "EventCategory" ADD CONSTRAINT "EventCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quota" ADD CONSTRAINT "Quota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
