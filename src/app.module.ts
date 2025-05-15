import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AdminModule } from './admin/admin.module';
import { ProductosModule } from './productos/productos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';


@Module({
  imports: [UsuariosModule, AdminModule,ProductosModule, PedidosModule, CloudinaryModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
 