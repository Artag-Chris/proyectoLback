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
  async getVentasStats() {
    try {
      // Get total sales (excluding cancelled orders)
      const totalVentas = await this.order.aggregate({
        where: {
          isAvailable: true,  // Only count active orders
        },
        _count: {
          id: true,  // Count number of orders
        },
        _sum: {
          totalAmount: true,  // Sum total amount
        },
      });
  
      // Get current month's data
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      const currentMonthVentas = await this.order.aggregate({
        where: {
          isAvailable: true,
          createdAt: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
        },
        _count: {
          id: true,
        },
        _sum: {
          totalAmount: true,
        },
      });
  
      // Get previous month's data
      const previousMonthVentas = await this.order.aggregate({
        where: {
          isAvailable: true,
          createdAt: {
            gte: new Date(currentYear, currentMonth - 2, 1),
            lt: new Date(currentYear, currentMonth - 1, 1),
          },
        },
        _count: {
          id: true,
        },
        _sum: {
          totalAmount: true,
        },
      });
  
      // Calculate percentage changes
      const currentMonthTotal = currentMonthVentas._sum.totalAmount || 0;
      const previousMonthTotal = previousMonthVentas._sum.totalAmount || 0;
      const currentMonthCount = currentMonthVentas._count.id || 0;
      const previousMonthCount = previousMonthVentas._count.id || 0;
  
      // Calculate percentage changes
      let incomePercentageChange = 0;
      let countPercentageChange = 0;
  
      if (previousMonthTotal > 0) {
        incomePercentageChange = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
      }
  
      if (previousMonthCount > 0) {
        countPercentageChange = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
      }
  
      return {
        totalVentas: {
          count: totalVentas._count.id || 0,
          amount: totalVentas._sum.totalAmount || 0,
        },
        currentMonth: {
          month: currentMonth,
          count: currentMonthCount,
          amount: currentMonthTotal,
        },
        previousMonth: {
          month: currentMonth - 1,
          count: previousMonthCount,
          amount: previousMonthTotal,
        },
        changes: {
          incomePercentage: parseFloat(incomePercentageChange.toFixed(2)),
          countPercentage: parseFloat(countPercentageChange.toFixed(2)),
        }
      };
  
    } catch (error) {
      this.logger.error(`Error fetching sales stats: ${error.message}`, error.stack);
      throw new Error('Error fetching sales stats');
    }
  }
  async getTendenciaVentas() {
    try {
      // Obtener fecha actual y fecha hace 12 meses
      const currentDate = new Date();
      const startDate = new Date(currentDate);
      startDate.setMonth(startDate.getMonth() - 11); // Retroceder 11 meses para obtener 12 meses completos
  
      const ventasPorMes = await this.order.groupBy({
        by: ['createdAt'],
        where: {
          isAvailable: true,
          createdAt: {
            gte: startDate,
            lte: currentDate,
          },
        },
        _sum: {
          totalAmount: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
  
      // Formatear los resultados para que incluyan todos los meses
      const resultados = [];
      const currentMonth = currentDate.getMonth();
      
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + i);
        
        const ventas = ventasPorMes.find(v => 
          new Date(v.createdAt).getMonth() === monthDate.getMonth() &&
          new Date(v.createdAt).getFullYear() === monthDate.getFullYear()
        );
  
        resultados.push({
          mes: monthDate,
          ingresos: ventas?._sum.totalAmount || 0,
        });
      }
  
      return resultados;
    } catch (error) {
      this.logger.error(`Error obteniendo tendencia de ventas: ${error.message}`, error.stack);
      throw new Error('Error obteniendo tendencia de ventas');
    }
  }
}