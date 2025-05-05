import { Body, Controller, Get, Logger, Param, Post, Put } from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";


@Controller('usuarios')
export class UsuariosController {
    /***************************************************** 
    Controlador de usuarios todo lo referente a manejo de usuarios
    
    ******************************************************/
    constructor(
        private readonly usuariosService: UsuariosService
    ) {
        const logger = new Logger('UsuariosController');

    }

    @Get('/clientes')

    getUsuarios() {

        const respuesta = this.usuariosService.getUsuarios();
        return respuesta;
    }
    @Get('/cliente/:email')

    getUsuario(
        @Param('email') email: string,
    ) {

        const respuesta = this.usuariosService.getUsuario(email);
        return respuesta;
    }
    @Post('/cliente')

    createUsuario(
        @Body()
        data: any,  // Este es un objeto con los datos del cliente a crear, podría ser un DTO (Data Transfer Object)
    ) {
        const respuesta = this.usuariosService.createUsuario(data);
        return respuesta;
    }
    @Put('/cliente/:email')
    updateUsuario(
        @Param('email') email: string,
        @Body() data: any) {
            console.log(data)
        const respuesta = this.usuariosService.updateUsuario(email, data);
        return respuesta;
    }
    @Put('/clienteborrar/:phone')
    deleteUsuario(
        @Param('phone') phoneNumber: string
    ) {
        const respuesta = this.usuariosService.deleteUsuario(phoneNumber);
        return respuesta;
    }
    @Post('/sociallogin')
    socialLogin(
        @Body()
        userData: any,  // Este es un objeto con los datos del cliente a crear, podría ser un DTO (Data Transfer Object)
    ) {
        console.log(userData);
        const respuesta = this.usuariosService.socialLogin(userData);
        return respuesta;
    }
    @Get('/admin/user/:id')
    getUserById(
      @Param('id') id: string,
    ) {
      const numericId = parseInt(id, 10);
      
    
      return this.usuariosService.getUsuarioInAdmin(numericId);
    }
}


