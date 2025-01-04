import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Express } from 'express';
import { Multer } from 'multer';
import { ProductosService } from "./productos.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";


@Controller('productos')
export class ProductosController {
    constructor(
        private readonly productosService: ProductosService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Get('/')
    getAllProductos() {
        const respuesta = this.productosService.getAllProductos();
        return respuesta;
    }
    @Get('/categorias')
    getAllCategories() {
        const respuesta = this.productosService.getAllCategories();
        return respuesta;
    }

    @Get(`/:id`)
    getProductos() {
        return "getProducto";
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
                ]
            })
        ) file: Express.Multer.File,
        @Body() body: { [key: string]: any }
    ) {

        const result = await this.cloudinaryService.uploadImage(file);

        const { name, description, price, category, desCategory, stock } = body;
          //se puede usar un class transformer para esta propiedad
          //lo mejor es usar un DTO
        const parsedPrice = parseFloat(price);
        const parsedStock = parseInt(stock, 10);

        const producto = await this.productosService.createProducto({
            name,
            description,
            price: parsedPrice,
            stock: parsedStock,
            imageUrl: result.secure_url,
            category,
            desCategory
        });
        return producto;
    }
}