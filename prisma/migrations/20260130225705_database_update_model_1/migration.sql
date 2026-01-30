-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado_cuenta" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "PerfilAcademico" (
    "id_perfil" SERIAL NOT NULL,
    "programa_academico" TEXT NOT NULL,
    "semestre" INTEGER NOT NULL,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER,

    CONSTRAINT "PerfilAcademico_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateTable
CREATE TABLE "Simulacro" (
    "id_simulacro" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "duracion_minutos" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Simulacro_pkey" PRIMARY KEY ("id_simulacro")
);

-- CreateTable
CREATE TABLE "IntentoSimulacro" (
    "id_intento" SERIAL NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3),
    "puntaje_total" DOUBLE PRECISION,
    "tiempo_utilizado" INTEGER,
    "id_usuario" INTEGER NOT NULL,
    "id_simulacro" INTEGER NOT NULL,

    CONSTRAINT "IntentoSimulacro_pkey" PRIMARY KEY ("id_intento")
);

-- CreateTable
CREATE TABLE "Respuesta" (
    "id_respuesta" SERIAL NOT NULL,
    "respuesta_usuario" TEXT NOT NULL,
    "es_correcta" BOOLEAN NOT NULL,
    "id_intento" INTEGER NOT NULL,
    "id_pregunta" INTEGER NOT NULL,

    CONSTRAINT "Respuesta_pkey" PRIMARY KEY ("id_respuesta")
);

-- CreateTable
CREATE TABLE "Pregunta" (
    "id_pregunta" SERIAL NOT NULL,
    "enunciado" TEXT NOT NULL,
    "tipo_pregunta" TEXT NOT NULL,
    "nivel_dificultad" TEXT NOT NULL,
    "id_simulacro" INTEGER NOT NULL,

    CONSTRAINT "Pregunta_pkey" PRIMARY KEY ("id_pregunta")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilAcademico_id_usuario_key" ON "PerfilAcademico"("id_usuario");

-- AddForeignKey
ALTER TABLE "PerfilAcademico" ADD CONSTRAINT "PerfilAcademico_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntentoSimulacro" ADD CONSTRAINT "IntentoSimulacro_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntentoSimulacro" ADD CONSTRAINT "IntentoSimulacro_id_simulacro_fkey" FOREIGN KEY ("id_simulacro") REFERENCES "Simulacro"("id_simulacro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_id_intento_fkey" FOREIGN KEY ("id_intento") REFERENCES "IntentoSimulacro"("id_intento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_id_pregunta_fkey" FOREIGN KEY ("id_pregunta") REFERENCES "Pregunta"("id_pregunta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pregunta" ADD CONSTRAINT "Pregunta_id_simulacro_fkey" FOREIGN KEY ("id_simulacro") REFERENCES "Simulacro"("id_simulacro") ON DELETE RESTRICT ON UPDATE CASCADE;
