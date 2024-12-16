import { Controller, Get } from "@nestjs/common";


@Controller('productos')
export class ProductosController{
    constructor(){}

    @Get(`/:id`)
    getProductos(){
        return "getProducto";
    }
}