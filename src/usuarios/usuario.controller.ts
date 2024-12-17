import { Controller,Get, Logger } from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";

@Controller('usuarios')
export class UsuariosController {
constructor(
private readonly usuariosService: UsuariosService
){
    const logger = new Logger('UsuariosController');
    
}


    @Get('/clientes')

    getUsuarios(){
        
       const respuesta = this.usuariosService.getUsuarios();
        return "getUsuarios";
    }  

}