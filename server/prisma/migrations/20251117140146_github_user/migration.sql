-- CreateTable
CREATE TABLE "GithubUser" (
    "id" SERIAL NOT NULL,
    "githubId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GithubUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GithubUser_githubId_key" ON "GithubUser"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "GithubUser_email_key" ON "GithubUser"("email");
