import { Injectable } from '@nestjs/common';

import { CartItem, PrismaClient, Status } from '@prisma/client';
import { CartWithCartItem } from '../models';

const prisma = new PrismaClient();

@Injectable()
export class CartService {
  async findByUserId(userId: string): Promise<CartWithCartItem> {
    const cart = await prisma.cart.findFirst({
      where: {
        user_id: userId,
        status: Status.OPEN,
      },
      include: {
        cart_item: true,
      },
    });

    return cart;
  }

  async createByUserId(userId: string): Promise<CartWithCartItem> {
    const userCart = await prisma.cart.create({
      data: {
        user_id: userId,
        status: Status.OPEN,
      },
      include: {
        cart_item: true,
      },
    });
    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<CartWithCartItem> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    items: CartItem[],
  ): Promise<CartWithCartItem> {
    const cart = await this.findByUserId(userId);

    const updatedCart = await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        cart_item: {
          createMany: {
            data: items,
          },
        },
      },
      include: {
        cart_item: true,
      },
    });

    return { ...updatedCart };
  }

  checkoutForUserId(userId: string) {
    return prisma.cart.updateMany({
      where: {
        user_id: userId,
        status: Status.OPEN,
      },
      data: {
        status: Status.ORDERED,
      },
    });
  }

  async removeByUserId(userId: string): Promise<void> {
    await prisma.cart.deleteMany({
      where: {
        user_id: userId,
        status: Status.OPEN,
      },
    });
  }
}
