import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsuariosService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');


  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
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
    /* crea un nuevo usuario en la base de datos */

    return "createUsuario";
  }
  async updateUsuario() {
    /* actualiza un usuario en la base de datos */  

    return "updateUsuario";
  }

  async deleteUsuario() {
    /* elimina un usuario de la base de datos */  

    return "deleteUsuario";
  }

  

}