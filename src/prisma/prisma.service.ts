import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({
      adapter,
    });
  }

  // When module starts, connect to database
  async onModuleInit() {
    await this.$connect(); // Open database connection
    console.log('✅ Database connected'); // Confirmation
  }

  // When module stops, disconnect from database
  async onModuleDestroy() {
    await this.$disconnect(); // Close database connection
    console.log('❌ Database disconnected');
  }
}
