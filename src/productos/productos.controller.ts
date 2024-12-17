import { Controller, Get } from "@nestjs/common";
import { ProductosService } from "./productos.service";


@Controller('productos')
export class ProductosController{
    constructor(
        private readonly productosService: ProductosService
    ){}

    @Get('/')
    getAllProductos(){
        const respuesta= this.productosService.getAllProductos();
        return respuesta;
    }

    @Get(`/:id`)
    getProductos(){
        return "getProducto";
    }
}