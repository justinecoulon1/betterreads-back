import { HistoryDto } from '../dto/history.dto';
import { History } from '../../database/model/history.entity';
import bookMapper from './book.mapper';

class HistoryMapper {
  async toDto(entity: History): Promise<HistoryDto> {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      newStatus: entity.newStatus,
      oldStatus: entity.oldStatus,
      book: await bookMapper.toBookDto(await entity.book),
    };
  }

  async toDtos(entities: History[]): Promise<HistoryDto[]> {
    return Promise.all(entities.map((entity) => this.toDto(entity)));
  }
}

export default new HistoryMapper();
