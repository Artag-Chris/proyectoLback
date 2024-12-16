import { Controller,Get, Logger } from "@nestjs/common";

@Controller('usuarios')
export class UsuariosController {
constructor(){
    const logger = new Logger('UsuariosController');
}


    @Get('/clientes')
    getUsuarios(){
        
        return "getUsuarios";
    }  

}