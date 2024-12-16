import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AdminModule } from './admin/admin.module';
import { ProductosModule } from './productos/productos.module';
import { PedidosModule } from './pedidos/pedidos.module';


@Module({
  imports: [UsuariosModule, AdminModule,ProductosModule, PedidosModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
