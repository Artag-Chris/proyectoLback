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
        //aqui antes de solo subir la imagen debere esperar la respuesta
        //de la subida de la imagen a cloudinary
        //y luego guardar la url de la imagen en la base de datos
        //con los demas datos del producto
        const result = await this.cloudinaryService.uploadImage(file);
        // Aquí puedes acceder a otros parámetros recibidos en el cuerpo de la solicitud
        const { name, description, price, category, desCategory, stock } = body;
        // Parsear price y stock a número
        const parsedPrice = parseFloat(price);
        const parsedStock = parseInt(stock, 10);
        // Guardar la URL de la imagen y otros datos en la base de datos
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