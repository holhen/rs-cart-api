import { PrismaClient, Status } from '@prisma/client';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();
async function seed() {
  await prisma.cart.create({
    data: {
      status: Status.OPEN,
      cart_item: {
        createMany: {
          data: [
            {
              count: 3,
            },
            {
              count: 5,
            },
          ],
        },
      },
      user: {
        create: {
          username: 'holhen',
          password: 'password',
        },
      },
    },
  });

  await prisma.cart.create({
    data: {
      status: Status.ORDERED,
      cart_item: {
        createMany: {
          data: [
            {
              count: 1,
            },
            {
              count: 2,
            },
          ],
        },
      },
      user: {
        create: {
          username: 'admin',
          password: 'admin',
        },
      },
    },
  });
}

seed();
