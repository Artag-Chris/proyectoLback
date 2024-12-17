import { Controller, Delete, Get, Logger, Post, Put } from "@nestjs/common";
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

    getUsuario() {

        const respuesta = this.usuariosService.getUsuario();
        return respuesta;
    }
    @Post('/cliente')

    createUsuario() {
        const respuesta = this.usuariosService.createUsuario();
        return respuesta;
    }
    @Put('/cliente/:id')

    updateUsuario() {
        const respuesta = this.usuariosService.updateUsuario();
        return respuesta;
    }
    @Delete('/cliente/:id')

    deleteUsuario() {
        const respuesta = this.usuariosService.deleteUsuario();
        return respuesta;
    }

}