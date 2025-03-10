import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PedidosModule } from 'src/pedidos/pedidos.module';
import { ProductosModule } from 'src/productos/productos.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
    controllers: [AdminController],
    providers: [AdminService],
    imports: [UsuariosModule, 
        ProductosModule, 
        PedidosModule],
})
export class AdminModule {}
