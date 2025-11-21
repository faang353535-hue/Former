-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "formId" INTEGER NOT NULL,
    "response_data" JSONB NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
