import { Controller, Get } from "@nestjs/common";

@Controller('pedidos')
export class PedidosController {
    constructor(){}
    
        @Get(`/all`)
        getPedidos(){
            return "getPedidos";
        }

}