import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/createPedido.dto';


@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get('/all')
  async getPedidos() {
    const pedidos = await this.pedidosService.getAllPedidos();
    return pedidos;
  }
  @Get('/totalIncome')
  async getTotalIncome() {
    const incomeData = await this.pedidosService.getTotalIncome();
    return {
      message: `Mes actual (${incomeData.currentMonth.month}): $${incomeData.currentMonth.income}\n` +
               `Mes anterior (${incomeData.previousMonth.month}): $${incomeData.previousMonth.income}\n` +
               `Porcentaje de cambio: ${incomeData.percentageChange}%\n` +
               `Ingreso total: $${incomeData.totalIncome}`,
      data: incomeData
    };
  }
  @Get('/stats')
async getVentasStats() {
  const statsData = await this.pedidosService.getVentasStats();
  return {
    message: {
      total: `Ventas totales: ${statsData.totalVentas.count} pedidos por $${statsData.totalVentas.amount}`,
      currentMonth: `Mes actual (${statsData.currentMonth.month}): ${statsData.currentMonth.count} pedidos por $${statsData.currentMonth.amount}`,
      previousMonth: `Mes anterior (${statsData.previousMonth.month}): ${statsData.previousMonth.count} pedidos por $${statsData.previousMonth.amount}`,
      changes: `Cambio en ingresos: ${statsData.changes.incomePercentage}% | Cambio en número de ventas: ${statsData.changes.countPercentage}%`
    },
    data: statsData
  };
}

  @Get('/:id')
  async getPedidoById(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    const pedido = await this.pedidosService.getPedidoById(parsedId);
    return pedido;
  }


  @Post('/create')
  async createPedido(@Body() createPedidoDto: CreatePedidoDto) {
    const pedido = await this.pedidosService.createPedido(createPedidoDto);
    return pedido;
  }
  @Put('/update/:id')
  async updatePedido(@Param('id') id: string, @Body() createPedidoDto: CreatePedidoDto) {
    const parsedId = parseInt(id, 10);
    const pedido = await this.pedidosService.updatePedido(parsedId, createPedidoDto);
    return pedido;
  }
 
}