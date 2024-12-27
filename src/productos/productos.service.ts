import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class ProductosService extends PrismaClient implements OnModuleInit {
    /*******************************************************************
    Clase de productos que maneja tambien categorias para el microservice 
    *******************************************************************/
    private readonly logger = new Logger('ProductosService');
    onModuleInit() {
        this.$connect();
        this.logger.log('conectado a la base de datos de productos');
    }
    getAllProductos() {
        const productos = this.product.findMany();
        return productos;
    }

    async createCategory() {
        try {
            const nuevaCategoria = await this.category.create({
                data: {
                    name: 'Nueva Categoria',
                    description: 'Nueva Categoria'
                }
            });
            //aqui podria ir mas codigo si necesitamos antes del return
            return nuevaCategoria;
        } catch (error) {
            this.logger.error(`Error creating category: ${error.message}`);
            throw new Error('Error creating category');
        }
    }
    async updateCategory() {
        try {
            const categoria = await this.category.findUnique({ where: { name: 'Nueva Categoria' } });
            if (categoria) {
                const updatedCategoria =
                    await this.category.update({
                        where: { id: categoria.id },
                        data: {
                            name: 'Nueva Categoria Updated',
                            description: 'Nueva Categoria Updated',
                        }
                    });
                return updatedCategoria;
            } else {
                return "La Categoria no existe";
            }
        } catch (error) {
            this.logger.error(`Error updating category: ${error.message}`);
            throw new Error('Error updating category');
        }
    }

    async deleteCategory() {
        //softdelete category
        try {
            const categoria = await this.category.findUnique({ where: { name: 'Nueva Categoria' } });
            if (categoria) {
                const deletedCategoria = await this.category.delete({ where: { id: categoria.id } });
                return deletedCategoria;
            } else {
                return "La Categoria no existe";
            }
        } catch (error) {
            this.logger.error(`Error deleting category: ${error.message}`);
            throw new Error('Error deleting category');
        }
    }

    async createProducto(data: {
         name: string, description: string, price: number, imageUrl: string,
          category: string, desCategory: string }) {
    console.log(`aquiiiiiiii`);
    console.log(data);
    return data
    }

}