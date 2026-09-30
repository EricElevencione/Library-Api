import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  getAllBooks() {
    return this.booksService.getAllBooks();
  }
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    // Handles POST requests to /books
    return this.booksService.createBook(createBookDto);
  }
  @Post(':bookId/copies')
  createCopy(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.booksService.createCopy(bookId);
  }
}
