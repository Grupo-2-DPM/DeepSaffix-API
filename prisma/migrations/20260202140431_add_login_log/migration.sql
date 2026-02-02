-- CreateEnum
CREATE TYPE "ResultadoLogin" AS ENUM ('SUCCESS', 'FAIL');

-- CreateTable
CREATE TABLE "LoginLog" (
    "id_log" SERIAL NOT NULL,
    "correo" VARCHAR(255) NOT NULL,
    "resultado" "ResultadoLogin" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" VARCHAR(45),
    "motivo_error" TEXT,
    "id_usuario" INTEGER,

    CONSTRAINT "LoginLog_pkey" PRIMARY KEY ("id_log")
);

-- AddForeignKey
ALTER TABLE "LoginLog" ADD CONSTRAINT "LoginLog_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
