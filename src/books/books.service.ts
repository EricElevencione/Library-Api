import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './create-book.dto';

@Injectable()
export class BooksService {
  // Get PrismaService from NestJS so this service can use the database
  constructor(private prisma: PrismaService) {}

  // Get all books from the database
  async getAllBooks() {
    return this.prisma.book.findMany();
  }

  async createBook(createBookDto: CreateBookDto) {
    const book = await this.prisma.book.create({
      data: {
        title: createBookDto.title,
      },
    });
    return book;
  }

  async createCopy(bookId: number) {
    const book = await this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (book === null) {
      throw new NotFoundException('Book not found');
    } else {
      const copy = await this.prisma.copy.create({
        data: {
          bookId: book.id,
        },
      });
      return copy;
    }
  }
}
