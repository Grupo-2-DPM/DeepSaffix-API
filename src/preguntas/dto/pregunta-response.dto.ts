import { TipoPregunta, NivelDificultad } from '@prisma/client';

export class PreguntaResponseDto {
  id_pregunta: number;
  enunciado: string;
  tipo_pregunta: TipoPregunta;
  nivel_dificultad: NivelDificultad;
  opciones: Array<{
    id_opcion: number;
    texto_opcion: string;
    es_correcta: boolean;
  }>;
}
