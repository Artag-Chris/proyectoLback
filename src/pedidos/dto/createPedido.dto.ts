import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class OrderItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

class TransactionDto {
  @IsNumber()
  amount: number;

  @IsString()
  paymentMethod: string;
}

export class CreatePedidoDto {
  @IsNumber()
  totalAmount: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  orderStatusId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionDto)
  transactions: TransactionDto[];
}