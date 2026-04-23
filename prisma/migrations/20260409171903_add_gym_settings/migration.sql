-- CreateTable
CREATE TABLE "GymSettings" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "multiplierSparring" DOUBLE PRECISION NOT NULL DEFAULT 1.5,
    "multiplierDrilling" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "multiplierConditioning" DOUBLE PRECISION NOT NULL DEFAULT 1.2,
    "multiplierWeights" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "sleepWeight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "sorenessWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "stressWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "injuryPenalty" DOUBLE PRECISION NOT NULL DEFAULT 30.0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GymSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GymSettings_gymId_key" ON "GymSettings"("gymId");

-- AddForeignKey
ALTER TABLE "GymSettings" ADD CONSTRAINT "GymSettings_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;
