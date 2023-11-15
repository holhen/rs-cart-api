import { Request } from 'express';

import { User } from '@prisma/client';

export interface AppRequest extends Request {
  user?: User;
}
