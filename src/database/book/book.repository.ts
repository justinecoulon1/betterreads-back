import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Book } from '../model/book.entity';

@Injectable()
export class BookRepository {
  private repository: Repository<Book>;

  constructor(
    @Inject('DATA_SOURCE')
    dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(Book);
  }

  findAll(): Promise<Book[]> {
    return this.repository.find();
  }

  findLatest(): Promise<Book[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: { authors: true },
    });
  }

  findById(id: number): Promise<Book | null> {
    return this.repository.findOneBy({
      id,
    });
  }

  findByIsbn10(isbn10: string): Promise<Book | null> {
    return this.repository.findOneBy({
      isbn10,
    });
  }

  findByIsbn13(isbn13: string): Promise<Book | null> {
    return this.repository.findOneBy({
      isbn13,
    });
  }

  save(book: Book): Promise<Book> {
    return this.repository.save(book);
  }
}
