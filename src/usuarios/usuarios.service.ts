import { Injectable, Logger, OnModuleInit, Param } from "@nestjs/common";
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsuariosService extends PrismaClient implements OnModuleInit {

  /*
  creemos nuevos metodos como por ejemplo traer las ultimas personas registradas,
  */

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

}