import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePedidoDto } from './dto/createPedido.dto';

@Injectable()
export class PedidosService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('PedidosService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Conectado a la base de datos de pedidos');
  }

  async createPedido(data: CreatePedidoDto) {
    try {
      const pedido = await this.order.create({
        data: {
          totalAmount: data.totalAmount,
          userId: data.userId,
          orderStatusId: data.orderStatusId,
          orderItems: {
            create: data.orderItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          transactions: {
            create: data.transactions.map(transaction => ({
              amount: transaction.amount,
              paymentMethod: transaction.paymentMethod,
            })),
          },
        },
      });
      return pedido;
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`, error.stack);
      this.logger.error(`Data: ${JSON.stringify(data)}`);
      throw new Error('Error creating order');
    }
  }

  async getAllPedidos() {
    try {
      const pedidos = await this.order.findMany({
        include: {
          orderItems: true,
          transactions: true,
        },
      });
      return pedidos;
    } catch (error) {
      this.logger.error(`Error fetching orders: ${error.message}`, error.stack);
      throw new Error('Error fetching orders');
    }
  }
  
  // Método para obtener una orden por ID
  async getPedidoById(id: number) {
    try {
      const pedido = await this.order.findUnique({
        where: { id },
        include: {
          orderItems: true,
          transactions: true,
        },
      });
      if (!pedido) {
        throw new Error('Order not found');
      }
      return pedido;
    } catch (error) {
      this.logger.error(`Error fetching order by ID: ${error.message}`, error.stack);
      throw new Error('Error fetching order by ID');
    }
  }
}