import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService], // Register the service
  exports: [PrismaService], // Make it available to other modules
})
export class PrismaModule {}
