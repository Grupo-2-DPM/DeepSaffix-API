/*
  Warnings:

  - You are about to alter the column `programa_academico` on the `PerfilAcademico` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `nombre` on the `Simulacro` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `nombre` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `apellido` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `correo` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `contraseña` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "PerfilAcademico" ALTER COLUMN "programa_academico" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "Simulacro" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "apellido" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "correo" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "contraseña" SET DATA TYPE VARCHAR(255);
