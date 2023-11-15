import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async findOne(userId: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async createOne(username: string, password: string): Promise<User> {
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
      },
    });
    return newUser;
  }
}
