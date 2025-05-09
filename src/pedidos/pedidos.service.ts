import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePedidoDto } from './dto/createPedido.dto';

@Injectable()
export class PedidosService extends PrismaClient implements OnModuleInit {
  /*
  clase referente a los pedidos  y recordatorios de los pedidos
  */

  //TODO crearemos un metodo para recordar a los admin que pedidos estan pendientes para ser enviados
  //no tengo ni idea de como hacerlo pero suena buena la idea 
  //entonces este servicio se encargaria de notificar a los admin a sus necesidades 
  private readonly logger = new Logger('PedidosService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Conectado a la base de datos de pedidos');
  }

  async createPedido(data: CreatePedidoDto) {
    console.log('Data:', data);
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
  async updatePedido(id: number, data: CreatePedidoDto) {
    try {
      const pedido = await this.order.update({
        where: { id },
        data: {
          totalAmount: data.totalAmount,
          userId: data.userId,
          orderStatusId: data.orderStatusId,
          orderItems: {
            deleteMany: {}, // Elimina los items existentes
            create: data.orderItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          transactions: {
            deleteMany: {}, // Elimina las transacciones existentes
            create: data.transactions.map(transaction => ({
              amount: transaction.amount,
              paymentMethod: transaction.paymentMethod,
            })),
          },
        },
      });
      return pedido;
    } catch (error) {
      this.logger.error(`Error updating order: ${error.message}`, error.stack);
      throw new Error('Error updating order');
    }
  }

  // En tu OrderStatusService
  async createOrderStatus(createOrderStatusDto: { status: string }) {
    try {
      return await this.orderStatus.create({
        data: {
          status: createOrderStatusDto.status,
          // isAvailable tiene valor por defecto (true) según tu schema
        }
      });
    } catch (error) {
      this.logger.error(`Error creating order status: ${error.message}`);
      throw new Error('Error creating order status');
    }
  }
  async getTotalIncome() {
    try {
      // Get total income
      const totalIncome = await this.order.aggregate({
        _sum: {
          totalAmount: true,
        },
      });
  
      // Get current month's data
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      const currentMonthIncome = await this.order.aggregate({
        where: {
          createdAt: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
        },
        _sum: {
          totalAmount: true,
        },
      });
  
      // Get previous month's data
      const previousMonthIncome = await this.order.aggregate({
        where: {
          createdAt: {
            gte: new Date(currentYear, currentMonth - 2, 1),
            lt: new Date(currentYear, currentMonth - 1, 1),
          },
        },
        _sum: {
          totalAmount: true,
        },
      });
  
      // Calculate percentage change
      const currentMonthTotal = currentMonthIncome._sum.totalAmount || 0;
      const previousMonthTotal = previousMonthIncome._sum.totalAmount || 0;
      let percentageChange = 0;
  
      if (previousMonthTotal > 0) {
        percentageChange = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
      }
  
      return {
        totalIncome: totalIncome._sum.totalAmount || 0,
        currentMonth: {
          month: currentMonth,
          income: currentMonthTotal
        },
        previousMonth: {
          month: currentMonth - 1,
          income: previousMonthTotal
        },
        percentageChange: parseFloat(percentageChange.toFixed(2))
      };
  
    } catch (error) {
      this.logger.error(`Error fetching income data: ${error.message}`, error.stack);
      throw new Error('Error fetching income data');
    }
  }
}