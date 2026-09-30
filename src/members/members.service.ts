import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './create-member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async getAllMembers() {
    return this.prisma.member.findMany();
  }

  async getMember(memberId: number) {
    const member = await this.prisma.member.findUnique({
      where: {
        id: memberId,
      },
    });

    if (member === null) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  async createMember(createMemberDto: CreateMemberDto) {
    const existingMember = await this.prisma.member.findUnique({
      where: {
        email: createMemberDto.email,
      },
    });

    if (existingMember !== null) {
      throw new ConflictException('Email already exists');
    }

    const member = await this.prisma.member.create({
      data: {
        name: createMemberDto.name,
        email: createMemberDto.email,
      },
    });
    return member;
  }
}
