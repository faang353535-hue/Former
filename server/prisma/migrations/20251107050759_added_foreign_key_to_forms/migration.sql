-- CreateTable
CREATE TABLE "Forms" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "form_data" JSONB NOT NULL,

    CONSTRAINT "Forms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
