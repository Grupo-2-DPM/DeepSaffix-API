/*
  Warnings:

  - You are about to drop the column `es_correcta` on the `Respuesta` table. All the data in the column will be lost.
  - You are about to drop the column `id_pregunta` on the `Respuesta` table. All the data in the column will be lost.
  - You are about to drop the column `respuesta_usuario` on the `Respuesta` table. All the data in the column will be lost.
  - The `estado_cuenta` column on the `Usuario` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id_intento,id_opcion]` on the table `Respuesta` will be added. If there are existing duplicate values, this will fail.
  - Made the column `id_usuario` on table `PerfilAcademico` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `tipo_pregunta` on the `Pregunta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `nivel_dificultad` on the `Pregunta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `id_opcion` to the `Respuesta` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoCuenta" AS ENUM ('ACTIVO', 'INACTIVO', 'ELIMINADO');

-- CreateEnum
CREATE TYPE "TipoPregunta" AS ENUM ('UNICA', 'MULTIPLE', 'ABIERTA');

-- CreateEnum
CREATE TYPE "NivelDificultad" AS ENUM ('BAJO', 'MEDIO', 'ALTO');

-- DropForeignKey
ALTER TABLE "IntentoSimulacro" DROP CONSTRAINT "IntentoSimulacro_id_simulacro_fkey";

-- DropForeignKey
ALTER TABLE "IntentoSimulacro" DROP CONSTRAINT "IntentoSimulacro_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "PerfilAcademico" DROP CONSTRAINT "PerfilAcademico_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Pregunta" DROP CONSTRAINT "Pregunta_id_simulacro_fkey";

-- DropForeignKey
ALTER TABLE "Respuesta" DROP CONSTRAINT "Respuesta_id_intento_fkey";

-- DropForeignKey
ALTER TABLE "Respuesta" DROP CONSTRAINT "Respuesta_id_pregunta_fkey";

-- AlterTable
ALTER TABLE "IntentoSimulacro" ALTER COLUMN "fecha_inicio" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PerfilAcademico" ALTER COLUMN "id_usuario" SET NOT NULL;

-- AlterTable
ALTER TABLE "Pregunta" DROP COLUMN "tipo_pregunta",
ADD COLUMN     "tipo_pregunta" "TipoPregunta" NOT NULL,
DROP COLUMN "nivel_dificultad",
ADD COLUMN     "nivel_dificultad" "NivelDificultad" NOT NULL;

-- AlterTable
ALTER TABLE "Respuesta" DROP COLUMN "es_correcta",
DROP COLUMN "id_pregunta",
DROP COLUMN "respuesta_usuario",
ADD COLUMN     "id_opcion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "estado_cuenta",
ADD COLUMN     "estado_cuenta" "EstadoCuenta" NOT NULL DEFAULT 'ACTIVO';

-- CreateTable
CREATE TABLE "OpcionPregunta" (
    "id_opcion" SERIAL NOT NULL,
    "texto_opcion" TEXT NOT NULL,
    "es_correcta" BOOLEAN NOT NULL DEFAULT false,
    "id_pregunta" INTEGER NOT NULL,

    CONSTRAINT "OpcionPregunta_pkey" PRIMARY KEY ("id_opcion")
);

-- CreateIndex
CREATE UNIQUE INDEX "Respuesta_id_intento_id_opcion_key" ON "Respuesta"("id_intento", "id_opcion");

-- AddForeignKey
ALTER TABLE "PerfilAcademico" ADD CONSTRAINT "PerfilAcademico_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pregunta" ADD CONSTRAINT "Pregunta_id_simulacro_fkey" FOREIGN KEY ("id_simulacro") REFERENCES "Simulacro"("id_simulacro") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpcionPregunta" ADD CONSTRAINT "OpcionPregunta_id_pregunta_fkey" FOREIGN KEY ("id_pregunta") REFERENCES "Pregunta"("id_pregunta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntentoSimulacro" ADD CONSTRAINT "IntentoSimulacro_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntentoSimulacro" ADD CONSTRAINT "IntentoSimulacro_id_simulacro_fkey" FOREIGN KEY ("id_simulacro") REFERENCES "Simulacro"("id_simulacro") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_id_intento_fkey" FOREIGN KEY ("id_intento") REFERENCES "IntentoSimulacro"("id_intento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_id_opcion_fkey" FOREIGN KEY ("id_opcion") REFERENCES "OpcionPregunta"("id_opcion") ON DELETE CASCADE ON UPDATE CASCADE;
