import { Inject, Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Author } from '../model/author.entity';

@Injectable()
export class AuthorRepository {
  private repository: Repository<Author>;

  constructor(
    @Inject('DATA_SOURCE')
    dataSource: DataSource,
  ) {
    this.repository = dataSource.getRepository(Author);
  }

  findAll(): Promise<Author[]> {
    return this.repository.find();
  }

  findById(id: number): Promise<Author | null> {
    return this.repository.findOneBy({
      id,
    });
  }

  findByName(name: string): Promise<Author | null> {
    return this.repository.findOneBy({
      name,
    });
  }

  findBySlug(slug: string): Promise<Author | null> {
    return this.repository.findOneBy({
      slug,
    });
  }

  save(author: Author): Promise<Author> {
    return this.repository.save(author);
  }

  saveAll(authors: Author[]): Promise<Author[]> {
    return this.repository.save(authors);
  }

  findBySlugs(slugs: string[]): Promise<Author[]> {
    return this.repository.findBy({ slug: In(slugs) });
  }
}
