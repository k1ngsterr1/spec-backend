-- CreateTable
CREATE TABLE "fcm_token" (
    "id" SERIAL NOT NULL,
    "temporaryKey" TEXT NOT NULL,
    "fcmToken" TEXT NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fcm_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fcm_token_temporaryKey_key" ON "fcm_token"("temporaryKey");

-- CreateIndex
CREATE UNIQUE INDEX "fcm_token_fcmToken_key" ON "fcm_token"("fcmToken");

-- CreateIndex
CREATE UNIQUE INDEX "fcm_token_userId_key" ON "fcm_token"("userId");

-- AddForeignKey
ALTER TABLE "fcm_token" ADD CONSTRAINT "fcm_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
