import { CartItem } from '@prisma/client';
import { CartWithCartItem } from '../models';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient();

const getCartItemCommand = (productId: string) =>
  new QueryCommand({
    TableName: 'products',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': { S: productId },
    },
  });

/**
 * @param {Cart} cart
 * @returns {number}
 */
export async function calculateCartTotal(
  cart: CartWithCartItem,
): Promise<number> {
  return cart
    ? cart.cart_item.reduce(
        async (acc: Promise<number>, { product_id, count }: CartItem) => {
          const getCartItem = getCartItemCommand(product_id);
          const response = await client.send(getCartItem);
          const product = response.Items[0];
          const total = (await acc) + +product.price.S * count;
          return Promise.resolve(total);
        },
        Promise.resolve(0),
      )
    : 0;
}
