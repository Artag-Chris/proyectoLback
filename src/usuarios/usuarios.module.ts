import { Module } from '@nestjs/common';
import { UsuariosController } from './usuario.controller';

@Module({})
export class UsuariosModule {
    controllers: [UsuariosController]
    providers: []
}
