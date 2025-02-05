import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductosService extends PrismaClient implements OnModuleInit {
  /*******************************************************************
    Clase de productos que maneja tambien categorias 
    devolvera productos y categorias tambien tendra metodos 
    que pediran datos de forma especifica como productos vendidos por meses
    o los nuevos productos agregados los 6 ultimos productos
    *******************************************************************/
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger('ProductosService');

  onModuleInit() {
    this.$connect();
    this.logger.log('conectado a la base de datos de productos');
  }

  async createCategory(category: any) {
    try {
      const existe = await this.category.findFirst({
        where: {
          name: category.name,
        },
      });
      if (existe) {
        return {
          message: 'La categoria ya existe',
        };
      } else {
        const nuevaCategoria = await this.category.create({
          data: {
            name: category.name,
            description: category.description,
          },
        });

        return nuevaCategoria;
      }
    } catch (error) {
      this.logger.error(`Error creating category: ${error.message}`);
      throw new Error('Error creating category');
    }

    return category;
  }

  async getAllCategories() {
    try {
      const categorias = await this.category.findMany();

      return { categories: [...categorias] };
    } catch (error) {
      this.logger.error(`Error fetching categories: ${error.message}`);
      throw new Error('Error fetching categories');
    }
  }
  /*
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
*/
  /*
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
*/
  async createProducto(data: any) {
    const categoria = await this.findCategoryByName(data.category);
    if (!categoria) {
      let categoria = await this.findOrCreateCategoryByName(
        data.category,
        'Default description',
      );
      let producto = await this.prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          categoryId: categoria.id,
          imageUrl: data.imageUrl,
        },
      });
      return producto;
    }

    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: categoria.id,
        imageUrl: data.imageUrl,
      },
    });
  }
  async getAllProductos() {
    //este metodo por ahora devuelve los productos y los soldProducts pero planeo que
    //filtre los productos por ultimos vendidos y  por los que se quieran mostrar de  primeros  por ahora se dejaran asi
    try {
      const productos = await this.product.findMany();
      return { product: [...productos], soldProducts: [...productos] };
    } catch (error) {
      this.logger.error(`Error fetching products: ${error.message}`);
      throw new Error('Error fetching products');
    }
  }
  async getLastSixProductos() {
    try {
      const productos = await this.product.findMany({
        orderBy: {
          createdAt: 'desc',
        },  
        take: 6,
      });
      return productos;
    } catch (error) {
      this.logger.error(`Error fetching last six products: ${error.message}`);
      throw new Error('Error fetching last six products');
    }
  }  
  async findCategoryByName(name: string) {
    return this.prisma.category.findFirst({
      where: { name },
    });
  }
  async findOrCreateCategoryByName(name: string, description: string) {
    let categoria = await this.prisma.category.findFirst({
      where: { name },
    });

    if (!categoria) {
      categoria = await this.prisma.category.create({
        data: {
          name,
          description,
        },
      });
      this.logger.log(`Created new category: ${name}`);
    }

    return categoria;
  }
  async createProductoWithCategory(data: any) {
    let categoria = await this.findCategoryByName(data.category);

    if (!categoria) {
      categoria = await this.prisma.category.create({
        data: {
          name: data.category,
          description: 'Default description', // Puedes cambiar esto según tus necesidades
        },
      });
      this.logger.log(`Created new category: ${data.category}`);
    }

    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: categoria.id,
        imageUrl: data.imageUrl,
      },
    });
  }
  async findProductById(id: any) {
    try {
      const producto = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!producto) {
        throw new Error('Product not found');
      }

      return producto;
    } catch (error) {
      this.logger.error(`Error fetching product by id: ${error.message}`);
      throw new Error('Error fetching product by id');
    }
  }
  async getProductosByCategory(categoryId: number) {
    console.log(`Received categoryId: ${categoryId}`);
    try {
        // Asegúrate de que categoryId sea un número entero
        const parsedCategoryId = parseInt(categoryId.toString(), 10);
        if (isNaN(parsedCategoryId)) {
            throw new Error('Invalid categoryId');
        }

     //   console.log(`Parsed categoryId: ${parsedCategoryId}`);

        const productos = await this.product.findMany({
            where: { categoryId: parsedCategoryId },
        });

       // console.log(`Found products: ${JSON.stringify(productos)}`);

        return productos;
    } catch (error) {
        this.logger.error(
            `Error fetching products by category: ${error.message}`,
        );
        throw new Error('Error fetching products by category');
    }
}
}
