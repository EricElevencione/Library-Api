import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Loans (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('returns 409 when trying to borrow an already-borrowed copy', async () => {
    const member = await prisma.member.create({
      data: {
        name: 'Test Member',
        email: `test-${Date.now()}@example.com`,
      },
    });

    const book = await prisma.book.create({
      data: {
        title: 'Test Book',
      },
    });

    const copy = await prisma.copy.create({
      data: {
        bookId: book.id,
      },
    });

    await request(app.getHttpServer())
      .post('/loans')
      .send({
        memberId: member.id,
        copyId: copy.id,
        dueAt: new Date().toISOString(),
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/loans')
      .send({
        memberId: member.id,
        copyId: copy.id,
        dueAt: new Date().toISOString(),
      })
      .expect(409);
  });
});
