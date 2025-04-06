import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {}

  async wrapInTransaction<T>(toCall: () => T): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await toCall();
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(err);
    } finally {
      await queryRunner.release();
    }
  }
}
