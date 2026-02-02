import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const url = process.env.DATABASE_URL
        if (!url) {
            throw new Error('DATABASE_URL no está cargada (revisa .env en la raíz).')
        }
        super({
            adapter: new PrismaPg({ connectionString: url }),
            log: [
                { level: 'query', emit: 'stdout' },
                { level: 'error', emit: 'stdout' },
                { level: 'warn', emit: 'stdout' },
            ]
        })
    }
    async onModuleInit() {
        await this.$connect()
    }
    async onModuleDestroy() {
        await this.$disconnect()
    }
}