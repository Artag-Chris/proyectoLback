import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}