import { Module } from '@nestjs/common';
import { UsuariosController } from './usuario.controller';
import { UsuariosService } from './usuarios.service';

@Module({
    controllers: [UsuariosController],
    providers: [UsuariosService]
})
export class UsuariosModule {}
