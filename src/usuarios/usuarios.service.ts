import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsuariosService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');


  onModuleInit() {
    this.$connect();
    this.logger.log('conectado a la base de datos');
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

  async getUsuario() {
    //usa un try catch
    try {
      const usuario = await this.user.findUnique({ where: { id: 1 } });
      return usuario;
    } catch (error) {
      this.logger.error(`Error getting user: ${error.message}`);
      throw new Error('Error getting user');
    }

  }

  async createUsuario() {
    try {

    } catch (error) { }

    const existeTelefono: any = await this.user.findUnique(
      { where: { phoneNumber: '123456789' } });

    if (!existeTelefono) {
      //aqui podriamos usar un dto
      const nuevoUsuario = await this.user.create({
        data: {
          username: 'John Doe',
          phoneNumber: '123456789',
          email: 'johndoe@example.com',
          passwordHash: '1234567890',
          firstName: 'John',
          lastName: 'Doe',
        }
      });
      //aqui podria ir mas codigo si necesitamos antes del return
      return nuevoUsuario;
    } else {
      return "El Usuario ya existe";
    }
  };


  async updateUsuario() {
    try {
      const usuario = await this.user.findUnique({ where: { phoneNumber: '123456789' } });
      if (usuario) {
        const updatedUsuario = 
        await this.user.update({
          where: { id: usuario.id },
          data: {
            username: 'John Doe updated',
            phoneNumber: '987654321',
            email: 'johndoeupdated@example.com',
            passwordHash: '0987654321',
            firstName: 'John Updated',
            lastName: 'Doe Updated',
          }
        });
        return updatedUsuario;
      } else {
        return "El Usuario no existe";
      }
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`);
      throw new Error('Error updating user');
     }
 
  }

  async deleteUsuario() {
    //eliminar un usuario
    try {
      const usuario = await this.user.findUnique({ where: { phoneNumber: '123456789' } });
      if (usuario) {
        const deletedUsuario = await this.user.delete({ where: { id: usuario.id } });
        return deletedUsuario;
      } else {
        return "El Usuario no existe";
      }
    } catch (error) {
      this.logger.error(`Error deleting user: ${error.message}`);
      throw new Error('Error deleting user');
     }

  }

}