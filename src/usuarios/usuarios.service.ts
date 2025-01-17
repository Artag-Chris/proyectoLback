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
      //console.log(usuarios);
      return usuarios;
    } catch (error) {
      this.logger.error(`Error getting users: ${error.message}`);
      throw new Error('Error getting users');
    }

  }

  async getUsuario(
    email: string
  ) {
    //usa un try catch
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
        //aqui podriamos usar un dto
        const nuevoUsuario = await this.user.create({
          data: {
           
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
      // Check if user already exists
      const existingUser = await this.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        
        return existingUser;
      }

      // Create new user
      const newUser = await this.createUsuario({
        username: name,
        email,
        passwordHash: null, // No password for social login
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
      });

      return { message: 'User created successfully', user: newUser };
    } catch (error) {
      return { message: "usuario ya existe" };
    }
  }

}