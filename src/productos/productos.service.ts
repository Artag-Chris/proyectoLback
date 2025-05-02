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

    //TODO metodo que al pedirlo devuelva los productos vendidos por mes 
    //TODO metodo que al pedirlo devuelva los productos nuevos agregados los ultimos 6 productos
    //TODO metodo de lo mas vendido  
    //TODO metodo de productos relacionados entre si 
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

  async createProducto(data: any) {
    const categoria = await this.findCategoryByName(data.category);
    if (!categoria) {
      const categoria = await this.findOrCreateCategoryByName(
        data.category,
        'Default description',
      );
      const producto = await this.prisma.product.create({
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
  async getLastSixProductosCategory(categoryId: number) {
    try {
        const product = await this.prisma.product.findMany({
            where: {
                categoryId,
                isAvailable: true 
            },
            take: 10,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
              //  category: true
            }
        });
        //console.log(`Fetched last six products for categoryId ${categoryId}:`, products);
        return product;
    } catch (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
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
 // Productos más vendidos por mes
 async getMasVendidosPorMes(year: number, month: number) {
  try {
    return await this.$queryRaw`
      SELECT 
        p.id,
        p.name,
        p.imageUrl,
        SUM(oi.quantity) as total_vendido,
        SUM(oi.quantity * oi.price) as ingresos
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      JOIN "Order" o ON oi."orderId" = o.id
      WHERE EXTRACT(YEAR FROM o."createdAt") = ${year}
        AND EXTRACT(MONTH FROM o."createdAt") = ${month}
        AND o."isAvailable" = true
        AND oi."isAvailable" = true
      GROUP BY p.id
      ORDER BY total_vendido DESC
      LIMIT 10
    `;
  } catch (error) {
    this.logger.error(`Error obteniendo más vendidos por mes: ${error.message}`);
    throw new Error('Error obteniendo productos más vendidos');
  }
}

// Ventas anuales por producto
async getVentasAnuales(year: number) {
  try {
    return await this.$queryRaw`
      SELECT 
        p.id,
        p.name,
        EXTRACT(MONTH FROM o."createdAt") as mes,
        SUM(oi.quantity) as total_vendido,
        SUM(oi.quantity * oi.price) as ingresos
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      JOIN "Order" o ON oi."orderId" = o.id
      WHERE EXTRACT(YEAR FROM o."createdAt") = ${year}
        AND o."isAvailable" = true
        AND oi."isAvailable" = true
      GROUP BY p.id, mes
      ORDER BY mes, total_vendido DESC
    `;
  } catch (error) {
    this.logger.error(`Error obteniendo ventas anuales: ${error.message}`);
    throw new Error('Error obteniendo reporte anual');
  }
}

// Producto más vendido histórico
async getProductoMasVendido() {
  try {
    const [topProduct] = await this.$queryRaw<Array<{
      id: number;
      name: string;
      imageUrl: string;
      total_vendido: number;
    }>>`
      SELECT 
        p.id,
        p.name,
        p.imageUrl,
        SUM(oi.quantity) as total_vendido
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      WHERE oi."isAvailable" = true
      GROUP BY p.id
      ORDER BY total_vendido DESC
      LIMIT 1
    `;
    return topProduct;
  } catch (error) {
    this.logger.error(`Error obteniendo producto más vendido: ${error.message}`);
    throw new Error('Error obteniendo producto estrella');
  }
}

// Últimas ventas (transacciones recientes)
async getUltimasVentas(limit: number = 10) {
  try {
    return await this.order.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        orderItems: {
          include: { product: true }
        },
        user: {
          select: { email: true, firstName: true, lastName: true }
        }
      }
    });
  } catch (error) {
    this.logger.error(`Error obteniendo últimas ventas: ${error.message}`);
    throw new Error('Error obteniendo transacciones recientes');
  }
}

// Tendencia de ventas últimos 6 meses
async getTendenciaVentas() {
  try {
    return await this.$queryRaw`
      SELECT 
        DATE_TRUNC('month', o."createdAt") as mes,
        SUM(oi.quantity * oi.price) as ingresos,
        SUM(oi.quantity) as unidades
      FROM "OrderItem" oi
      JOIN "Order" o ON oi."orderId" = o.id
      WHERE o."createdAt" >= NOW() - INTERVAL '6 months'
        AND o."isAvailable" = true
        AND oi."isAvailable" = true
      GROUP BY mes
      ORDER BY mes ASC
    `;
  } catch (error) {
    this.logger.error(`Error obteniendo tendencia ventas: ${error.message}`);
    throw new Error('Error obteniendo tendencia de ventas');
  }
}

// Productos con stock crítico (personalizable por umbral)
async getStockCritico(umbral: number = 10) {
  try {
    return await this.product.findMany({
      where: {
        stock: { lt: umbral },
        isAvailable: true
      },
      orderBy: { stock: 'asc' },
      include: { category: true }
    });
  } catch (error) {
    this.logger.error(`Error obteniendo stock crítico: ${error.message}`);
    throw new Error('Error obteniendo productos con bajo stock');
  }
}

// Comparativa de ventas entre categorías
async getVentasPorCategoria(year: number) {
  try {
    return await this.$queryRaw`
      SELECT 
        c.name as categoria,
        SUM(oi.quantity) as unidades,
        SUM(oi.quantity * oi.price) as ingresos
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      JOIN "Category" c ON p."categoryId" = c.id
      JOIN "Order" o ON oi."orderId" = o.id
      WHERE EXTRACT(YEAR FROM o."createdAt") = ${year}
        AND o."isAvailable" = true
        AND oi."isAvailable" = true
      GROUP BY categoria
      ORDER BY ingresos DESC
    `;
  } catch (error) {
    this.logger.error(`Error obteniendo ventas por categoría: ${error.message}`);
    throw new Error('Error obteniendo comparativa de categorías');
  }
}
}

