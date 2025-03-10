import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
    imports : [CloudinaryModule],
    controllers: [ProductosController],    
    providers: [ProductosService],
    exports: [ProductosService]
})
export class ProductosModule {
    
}
