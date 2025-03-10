import { Injectable, Logger, OnModuleInit, Param } from "@nestjs/common";
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsuariosService extends PrismaClient implements OnModuleInit {

  /*
  metodo referente a el usuario y sus acciones, tambien con tendencias sociales o productos vistos
  */
//TODO crearemos un nuevo metodo para devolver los ultimos usuarios registrados con su tiempo
//TODO crearemos alguna forma de poder ver los datos  que el usuario ha visto o comprado
//que categorias ha visto y cuales son las que mas tiempo ha estado viendo
  private readonly logger = new Logger('ProductsService');


  onModuleInit() {
    this.$connect();
    this.logger.log('conectado a la base de datos de Usuarios');
  }


  async getUsuarios() {
    try {
      const usuarios = await this.user.findMany();
      return usuarios;
    } catch (error) {
      this.logger.error(`Error getting users: ${error.message}`);
      throw new Error('Error getting users');
    }
  }

  async getUsuario(
    email: string
  ) {
    try {
      const usuario = await this.user.findUnique({ where: { email } });
      return usuario;
    } catch (error) {
      this.logger.error(`Error getting user: ${error.message}`);
      throw new Error('Error getting user');
    }
  }

  async createUsuario(data: any) {
    try {
      const existeEmail: any = await this.user.findUnique(
        { where: { email: data.email } });
      if (!existeEmail) {      
        const nuevoUsuario = await this.user.create({
          data: {    
            phoneNumber: data.phoneNumber,
            email: data.email,
            passwordHash: data.passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
          }
        });        
        return nuevoUsuario;
      } else {
        return "ski";
      }
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw new Error('Error creating user');
    }
  };

  async updateUsuario(email: string, data: any) {
    try {
      const usuario = await this.user.findUnique({ where: { email } });
      if (usuario) {
        const updatedUsuario = await this.user.update({
          where: { id: usuario.id },
          data: {
            phoneNumber: data.phone,
            address  :data.address,
            firstName: data.firstName ,
            lastName: data.lastName ,
            isAvailable: data.isAvailable || true,
          }
        });
        return updatedUsuario;
      } else {
        return "El Usuario no existe";
      }
    } catch (error) {
      console.error(`Error updating user: ${error.message}`);
      throw new Error('Error updating user');
    }
      
  }

  async deleteUsuario(phoneNumber: string) {
    try {
      const usuario = await this.user.findUnique({ where: { phoneNumber } });
      if (usuario) {
        const deletedUsuario = await this.user.update({
          where: { id: usuario.id },
          data: {
            isAvailable: false, // Soft delete
          }
        });
        return deletedUsuario;
      } else {
        return "El Usuario no existe";
      }
    } catch (error) {
      console.error(`Error deleting user: ${error.message}`);
      throw new Error('Error deleting user');
    }
  }
  async socialLogin(userData: any) {
    const { email, name } = userData;
    try {
      const existingUser = await this.user.findUnique({
        where: { email },
      });
      if (existingUser) { 
        return existingUser;
      }
      const newUser = await this.createUsuario({
        username: name,
        email,
        passwordHash: null,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
      });
      return { message: 'User created successfully', user: newUser };
    } catch (error) {
      return { message: "usuario ya existe" };
    }
  }
   // Obtener últimos usuarios registrados
   //aqui pediremos los ultimos usuarios registrados mandando el parametro desde el admin
   async getUltimosUsuarios(limit: number = 10) {
    try {
      return await this.user.findMany({
        where: { isAvailable: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          profileImage: true
        }
      });
    } catch (error) {
      this.logger.error(`Error obteniendo últimos usuarios: ${error.message}`);
      throw new Error('Error obteniendo últimos usuarios');
    }
  }

  // Comparar registros por mes
  async compararRegistrosPorMes(year: number, month1: number, month2: number) {
    try {
      const startMonth1 = new Date(year, month1 - 1, 1);
      const endMonth1 = new Date(year, month1, 1);
      
      const startMonth2 = new Date(year, month2 - 1, 1);
      const endMonth2 = new Date(year, month2, 1);

      const [month1Count, month2Count] = await Promise.all([
        this.user.count({
          where: {
            createdAt: { gte: startMonth1, lt: endMonth1 },
            isAvailable: true
          }
        }),
        this.user.count({
          where: {
            createdAt: { gte: startMonth2, lt: endMonth2 },
            isAvailable: true
          }
        })
      ]);

      return {
        [month1]: month1Count,
        [month2]: month2Count,
        diferencia: month1Count - month2Count,
        porcentajeCambio: ((month1Count - month2Count) / month2Count) * 100
      };
    } catch (error) {
      this.logger.error(`Error comparando registros: ${error.message}`);
      throw new Error('Error comparando registros mensuales');
    }
  }

  // Método adicional: Estadísticas de registros mensuales
  async getEstadisticasRegistros(year: number) {
    try {
      const result = await this.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: new Date(year, 0, 1) },
          isAvailable: true
        },
        _count: { id: true },
        orderBy: { createdAt: 'asc' }
      });

      return result.map(entry => ({
        mes: entry.createdAt.getMonth() + 1,
        cantidad: entry._count.id
      }));
    } catch (error) {
      this.logger.error(`Error obteniendo estadísticas: ${error.message}`);
      throw new Error('Error obteniendo estadísticas de registros');
    }
  }

}