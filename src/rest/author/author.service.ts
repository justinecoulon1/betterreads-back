import { ConflictException, Injectable } from '@nestjs/common';
import { AuthorRepository } from '../../database/author/author.repository';
import { Author } from '../../database/model/author.entity';
import { kebabCase } from 'lodash';
import { AuthorNotFoundException } from './author.exceptions';

@Injectable()
export class AuthorService {
  constructor(private readonly authorRepository: AuthorRepository) {}

  async getAuthorById(id: number): Promise<Author> {
    const author = await this.authorRepository.findById(id);
    if (!author) {
      throw new AuthorNotFoundException();
    }
    return author;
  }

  async getAuthorBySlug(slug: string): Promise<Author> {
    const author = await this.authorRepository.findBySlug(slug);
    if (!author) {
      throw new AuthorNotFoundException();
    }
    return author;
  }

  async createAuthor(name: string): Promise<Author> {
    const author = await this.authorRepository.findByName(name.toLowerCase());
    if (author) {
      throw new ConflictException('author-exists');
    }
    const slug = this.getAuthorSlug(name);

    const newAuthor = new Author(name.toLowerCase(), slug, new Date(), new Date());
    return this.authorRepository.save(newAuthor);
  }

  getAuthorSlug(name: string): string {
    return kebabCase(name);
  }
}
