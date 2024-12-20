import { Injectable, Logger, OnModuleInit, Param } from "@nestjs/common";
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsuariosService extends PrismaClient implements OnModuleInit {

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
    phoneNumber: string
  ) {
    //usa un try catch
    try {
      const usuario = await this.user.findUnique({ where: { phoneNumber } });
      return usuario;
    } catch (error) {
      this.logger.error(`Error getting user: ${error.message}`);
      throw new Error('Error getting user');
    }

  }

  async createUsuario(data: any) {
    try {

      const existeTelefono: any = await this.user.findUnique(
        { where: { phoneNumber: data.phoneNumber } });

      if (!existeTelefono) {
        //aqui podriamos usar un dto
        const nuevoUsuario = await this.user.create({
          data: {
            username: data.username,
            phoneNumber: data.phoneNumber,
            email: data.email,
            passwordHash: data.passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
          }
        });
        //aqui podria ir mas codigo si necesitamos antes del return
        return nuevoUsuario;
      } else {
        return "El Usuario ya existe";
      }
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw new Error('Error creating user');
    }


  };




  async updateUsuario(phoneNumber: string, data: any) {
    try {
      const usuario = await this.user.findUnique({ where: { phoneNumber } });
      if (usuario) {
        const updatedUsuario = await this.user.update({
          where: { id: usuario.id },
          data: {
            username: data.username || "jhon",
            phoneNumber: data.phoneNumber || "123456789",
            email: data.email || "johndoe@example.com",
            passwordHash: data.passwordHash || "1234567890",
            firstName: data.firstName || "John",
            lastName: data.lastName || "Doe",
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


}