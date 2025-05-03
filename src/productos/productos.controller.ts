import { BadRequestException, Body, Controller, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Express } from 'express';
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



    @Get('/latest')
    getLatestProductos() {
        const respuesta = this.productosService.getLastSixProductos();
        return respuesta;
    }

    @Get('/latest/:id')
    async getLastSixProductosCategory(@Param('id') id: string) {
        try {
            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId)) {
                throw new BadRequestException('Invalid category ID');
            }

            const product = await this.productosService.getLastSixProductosCategory(parsedId);

            return {
                product,
                soldProducts: [] // You can implement this later if needed
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('/categorias')
    getAllCategories() {
        const respuesta = this.productosService.getAllCategories();
        return respuesta;
    }

    @Post('/createcategory')
    createCategory(@Body() category: any) {
        const respuesta = this.productosService.createCategory(category);
        return respuesta;
    }

    @Get('/:id')
    getProductos(@Param('id') id: string) {
        const parsedId = parseInt(id, 10);
        const respuesta = this.productosService.findProductById(parsedId);
        return respuesta;
    }

    @Get('/categoria/:categoryId')
    getProductosByCategory(@Param('categoryId') categoryId: string) {
        console.log(`Received categoryId: ${categoryId}`);
        const parsedCategoryId = parseInt(categoryId, 10);
        if (isNaN(parsedCategoryId)) {
            throw new Error('Invalid categoryId');
        }
        const respuesta = this.productosService.getProductosByCategory(parsedCategoryId);
        return respuesta;
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

    @Put('/update/:id')
    async updateProduct(
        @Param('id') id: string,
        @Body() body: {
            name?: string;
            description?: string;
            price?: number;
            stock?: number;
            categoryId?: number;
            imageUrl?: string;
        }
    ) {
        try {

            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId)) {
                throw new BadRequestException('Invalid product ID');
            }

            // Parse numeric values
            if (body.price) body.price = parseFloat(body.price.toString());
            if (body.stock) body.stock = parseInt(body.stock.toString(), 10);
            if (body.categoryId) body.categoryId = parseInt(body.categoryId.toString(), 10);

            const updatedProduct = await this.productosService.updateProduct(parsedId, body);
            return updatedProduct;
        } catch (error) {
            throw new HttpException(
                error.message || 'Error updating product',
                HttpStatus.BAD_REQUEST
            );
        }
    }
    @Put('/category/update/:id')
    async updateCategory(
        @Param('id') id: string,
        @Body() body: {
            name?: string;
            description?: string;
            isAvailable?: boolean;
        }
    ) {
        try {

            const parsedId = parseInt(id, 10);
            if (isNaN(parsedId)) {
                throw new BadRequestException('Invalid category ID');
            }

            const updatedCategory = await this.productosService.updateCategory(parsedId, body);
            return updatedCategory;
        } catch (error) {
            throw new HttpException(
                error.message || 'Error updating category',
                HttpStatus.BAD_REQUEST
            );
        }
    }
}