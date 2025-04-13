import { User } from '../../../database/model/user.entity';
import { Request } from 'express';

export interface BetterreadsRequest extends Request {
  user?: User;
}
