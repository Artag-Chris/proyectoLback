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
        return "getUsuarios";
    }
    @Get('/cliente/:id')

    getUsuario(
        @Param('phone') phoneNumber: string,
    ) {

        const respuesta = this.usuariosService.getUsuario(phoneNumber);
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
    @Put('/cliente/:phone')
    updateUsuario(
        @Param('phone')
        phoneNumber: string, data: any) {
        const respuesta = this.usuariosService.updateUsuario(phoneNumber, data);
        return respuesta;
    }
    @Put('/clienteborrar/:phone')
    deleteUsuario(
        @Param('phone') phoneNumber: string
    ) {
        const respuesta = this.usuariosService.deleteUsuario(phoneNumber);
        return respuesta;
    }

}


