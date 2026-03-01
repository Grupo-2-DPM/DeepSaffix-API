import { PrismaClient } from '@prisma/client';

export async function findWithFilters<T = any>(
  prismaModel: any,
  options: {
    filters?: Record<string, any>;
    skip?: number;
    take?: number;
    orderBy?: { field: string; direction: 'asc' | 'desc' };
    include?: any;
    allowedFields?: string[];
    searchFields?: string[];
  } = {},
): Promise<{
  data: T[];
  pagination: {
    total: number;
    skip: number;
    take: number;
    pages: number;
  };
}> {
  const {
    filters = {},
    skip = 0,
    take = 20,
    orderBy,
    include,
    allowedFields = [],
    searchFields = [],
  } = options;

  try {
    // Construir el where dinámico
    const where: Record<string, any> = {};

    for (const [key, value] of Object.entries(filters)) {
      // Validar que el campo esté permitido
      if (allowedFields.length > 0 && !allowedFields.includes(key)) {
        continue;
      }

      // Si el valor es undefined o null, lo omitimos
      if (value === undefined || value === null) {
        continue;
      }

      // Manejar diferentes tipos de filtros
      if (typeof value === 'string' && value.trim() !== '') {
        if (searchFields.includes(key)) {
          // Búsqueda tipo LIKE solo para campos especificados
          where[key] = { contains: value, mode: 'insensitive' };
        } else {
          // Coincidencia exacta para strings
          where[key] = value;
        }
      } else if (Array.isArray(value)) {
        // Filtro IN para arrays
        where[key] = { in: value };
      } else if (value instanceof Date) {
        // Filtro para fechas
        where[key] = value;
      } else if (typeof value === 'object' && value !== null) {
        // Si ya es un objeto (gte, lte, etc.), lo usamos directamente
        where[key] = value;
      } else {
        // Valores primitivos
        where[key] = value;
      }
    }

    // Construir el orderBy
    const orderByClause: Record<string, 'asc' | 'desc'> = orderBy?.field
      ? { [orderBy.field]: orderBy.direction || 'asc' }
      : { id_pregunta: 'desc' };

    // Ejecutar la consulta
    const [data, total] = await Promise.all([
      prismaModel.findMany({
        where: Object.keys(where).length > 0 ? where : undefined,
        skip: Number(skip) || 0,
        take: Number(take) || 20,
        orderBy: orderByClause,
        include: include || undefined,
      }),
      prismaModel.count({
        where: Object.keys(where).length > 0 ? where : undefined,
      }),
    ]);

    return {
      data,
      pagination: {
        total,
        skip: Number(skip),
        take: Number(take),
        pages: Math.ceil(total / (Number(take) || 20)),
      },
    };
  } catch (error) {
    console.error('Error en findWithFilters:', error);
    throw new Error(`Error al ejecutar la consulta: ${error.message}`);
  }
}
