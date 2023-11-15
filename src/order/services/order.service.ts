import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order, PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class OrderService {
  async findById(orderId: string): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    return order;
  }

  create(data: Order) {
    return prisma.order.create({
      data,
    });
  }

  async update(orderId: string, data: Order): Promise<void> {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data,
    });
  }
}
