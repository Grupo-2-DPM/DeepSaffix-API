// import {
//   Injectable,
//   NotFoundException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { CreateSimulacroDto } from './dto/create-simulacro.dto';
// import { UpdateSimulacroDto } from './dto/update-simulacro.dto';
//
// @Injectable()
// export class SimulacrosService {
//   constructor(private prisma: PrismaService) {}
//
//   // Crear simulacro con preguntas nuevas o desde pool
//   async create(createDto: CreateSimulacroDto) {
//     const pool: any = (createDto as any).pool;
//
//     // Opción 1: Crear desde pool de preguntas existentes
//     if (pool && (!createDto.preguntas || createDto.preguntas.length === 0)) {
//       const cantidad = Number(pool.cantidad) || 0;
//       if (cantidad <= 0) {
//         throw new InternalServerErrorException('Cantidad inválida en pool');
//       }
//
//       const whereClauses: string[] = [];
//       if (pool.nivel_dificultad) {
//         whereClauses.push(`nivel_dificultad = '${pool.nivel_dificultad}'`);
//       }
//       if (pool.tipo_pregunta) {
//         whereClauses.push(`tipo_pregunta = '${pool.tipo_pregunta}'`);
//       }
//       const whereSql = whereClauses.length
//         ? `WHERE ${whereClauses.join(' AND ')}`
//         : '';
//
//       const raw = (await this.prisma.$queryRawUnsafe(
//         `SELECT id_pregunta FROM "Pregunta" ${whereSql} ORDER BY random() LIMIT ${cantidad}`,
//       )) as Array<{ id_pregunta: number }>;
//
//       const ids: number[] = raw.map((r) => r.id_pregunta).filter(Boolean);
//
//       if (ids.length < cantidad) {
//         throw new NotFoundException('No hay suficientes preguntas en el pool');
//       }
//
//       // Crear simulacro y asociar preguntas existentes
//       const result = await this.prisma.$transaction(async (tx) => {
//         const simulacro = await tx.simulacro.create({
//           data: {
//             nombre: createDto.nombre,
//             descripcion: createDto.descripcion,
//             duracion_minutos: createDto.duracion_minutos,
//           },
//         });
//
//         // Crear relaciones en SimulacroPregunta
//         await tx.simulacroPregunta.createMany({
//           data: ids.map((id, index) => ({
//             id_simulacro: simulacro.id_simulacro,
//             id_pregunta: id,
//             orden: index + 1,
//           })),
//         });
//
//         return tx.simulacro.findUnique({
//           where: { id_simulacro: simulacro.id_simulacro },
//           include: {
//             simulacroPreguntas: {
//               include: {
//                 pregunta: {
//                   include: { opciones: true },
//                 },
//               },
//               orderBy: { orden: 'asc' },
//             },
//           },
//         });
//       });
//
//       return result;
//     }
//
//     // Opción 2: Crear preguntas nuevas con el simulacro
//     if (createDto.preguntas && createDto.preguntas.length > 0) {
//       const result = await this.prisma.$transaction(async (tx) => {
//         const simulacro = await tx.simulacro.create({
//           data: {
//             nombre: createDto.nombre,
//             descripcion: createDto.descripcion,
//             duracion_minutos: createDto.duracion_minutos,
//           },
//         });
//
//         // Crear cada pregunta y su relación
//         for (const [index, p] of createDto.preguntas.entries()) {
//           const pregunta = await tx.pregunta.create({
//             data: {
//               enunciado: p.enunciado,
//               tipo_pregunta: p.tipo_pregunta,
//               nivel_dificultad: p.nivel_dificultad,
//               opciones: {
//                 create: p.opciones,
//               },
//             },
//           });
//
//           await tx.simulacroPregunta.create({
//             data: {
//               id_simulacro: simulacro.id_simulacro,
//               id_pregunta: pregunta.id_pregunta,
//               orden: index + 1,
//             },
//           });
//         }
//
//         return tx.simulacro.findUnique({
//           where: { id_simulacro: simulacro.id_simulacro },
//           include: {
//             simulacroPreguntas: {
//               include: {
//                 pregunta: {
//                   include: { opciones: true },
//                 },
//               },
//               orderBy: { orden: 'asc' },
//             },
//           },
//         });
//       });
//
//       return result;
//     }
//
//     // Opción 3: Solo crear simulacro vacío
//     return this.prisma.simulacro.create({
//       data: {
//         nombre: createDto.nombre,
//         descripcion: createDto.descripcion,
//         duracion_minutos: createDto.duracion_minutos,
//       },
//     });
//   }
//
//   async findAll() {
//     return this.prisma.simulacro.findMany({
//       include: {
//         simulacroPreguntas: {
//           include: {
//             pregunta: {
//               include: { opciones: true },
//             },
//           },
//           orderBy: { orden: 'asc' },
//         },
//       },
//     });
//   }
//
//   async findOne(id: number) {
//     const simulacro = await this.prisma.simulacro.findUnique({
//       where: { id_simulacro: id },
//       include: {
//         simulacroPreguntas: {
//           include: {
//             pregunta: {
//               include: { opciones: true },
//             },
//           },
//           orderBy: { orden: 'asc' },
//         },
//       },
//     });
//
//     if (!simulacro) {
//       throw new NotFoundException(`Simulacro ${id} no encontrado`);
//     }
//
//     return simulacro;
//   }
//
//   async update(id: number, updateDto: UpdateSimulacroDto) {
//     await this.findOne(id);
//
//     return this.prisma.simulacro.update({
//       where: { id_simulacro: id },
//       data: {
//         nombre: updateDto.nombre,
//         descripcion: updateDto.descripcion,
//         duracion_minutos: updateDto.duracion_minutos,
//       },
//       include: {
//         simulacroPreguntas: {
//           include: {
//             pregunta: {
//               include: { opciones: true },
//             },
//           },
//           orderBy: { orden: 'asc' },
//         },
//       },
//     });
//   }
//
//   async remove(id: number) {
//     await this.findOne(id);
//     await this.prisma.simulacro.delete({ where: { id_simulacro: id } });
//   }
// }
