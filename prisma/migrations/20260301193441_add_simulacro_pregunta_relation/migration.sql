/*
  Warnings:

  - You are about to drop the column `id_simulacro` on the `Pregunta` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_intento,id_simulacro_pregunta]` on the table `Respuesta` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_simulacro_pregunta` to the `Respuesta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pregunta" DROP CONSTRAINT "Pregunta_id_simulacro_fkey";

-- DropIndex
DROP INDEX "Respuesta_id_intento_id_opcion_key";

-- AlterTable
ALTER TABLE "Pregunta" DROP COLUMN "id_simulacro";

-- AlterTable
ALTER TABLE "Respuesta" ADD COLUMN     "id_simulacro_pregunta" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SimulacroPregunta" (
    "id_simulacro_pregunta" SERIAL NOT NULL,
    "orden" INTEGER,
    "id_simulacro" INTEGER NOT NULL,
    "id_pregunta" INTEGER NOT NULL,

    CONSTRAINT "SimulacroPregunta_pkey" PRIMARY KEY ("id_simulacro_pregunta")
);

-- CreateIndex
CREATE INDEX "SimulacroPregunta_id_simulacro_idx" ON "SimulacroPregunta"("id_simulacro");

-- CreateIndex
CREATE INDEX "SimulacroPregunta_id_pregunta_idx" ON "SimulacroPregunta"("id_pregunta");

-- CreateIndex
CREATE UNIQUE INDEX "SimulacroPregunta_id_simulacro_id_pregunta_key" ON "SimulacroPregunta"("id_simulacro", "id_pregunta");

-- CreateIndex
CREATE UNIQUE INDEX "Respuesta_id_intento_id_simulacro_pregunta_key" ON "Respuesta"("id_intento", "id_simulacro_pregunta");

-- AddForeignKey
ALTER TABLE "SimulacroPregunta" ADD CONSTRAINT "SimulacroPregunta_id_simulacro_fkey" FOREIGN KEY ("id_simulacro") REFERENCES "Simulacro"("id_simulacro") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulacroPregunta" ADD CONSTRAINT "SimulacroPregunta_id_pregunta_fkey" FOREIGN KEY ("id_pregunta") REFERENCES "Pregunta"("id_pregunta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_id_simulacro_pregunta_fkey" FOREIGN KEY ("id_simulacro_pregunta") REFERENCES "SimulacroPregunta"("id_simulacro_pregunta") ON DELETE CASCADE ON UPDATE CASCADE;
