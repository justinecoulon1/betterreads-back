import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Book } from '../model/book.entity';
import { Shelf } from '../model/shelf.entity';

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
    return this.repository.find({ relations: { authors: true } });
  }

  findLatest(): Promise<Book[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
      take: 20,
      relations: { authors: true },
    });
  }

  findLastBooksOfShelf(shelf: Shelf): Promise<Book[]> {
    return this.repository
      .createQueryBuilder('book')
      .innerJoin('book.shelves', 'shelf')
      .where('shelf.id = :shelfId', { shelfId: shelf.id })
      .leftJoinAndSelect('book.authors', 'book_authors')
      .orderBy('book.id', 'DESC')
      .limit(3)
      .getMany();
  }

  findById(id: number): Promise<Book | null> {
    return this.repository.findOne({
      where: { id },
      relations: { authors: true },
    });
  }

  findByIsbn10(isbn10: string): Promise<Book | null> {
    return this.repository.findOne({
      where: { isbn10 },
      relations: { authors: true },
    });
  }

  findByIsbn13(isbn13: string): Promise<Book | null> {
    return this.repository.findOne({
      where: { isbn13 },
      relations: { authors: true },
    });
  }

  save(book: Book): Promise<Book> {
    return this.repository.save(book);
  }
}
