// filepath: /home/finova/back-end/proyectoL/lproyectbackend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderStatus.create({
    data: {
      status: 'Pending',
    },
  });

  await prisma.user.create({
    data: {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    },
  });

  await prisma.product.create({
    data: {
      name: 'Test Product',
      price: 50.0,
      stock: 10,
      categoryId: 1, // Asegúrate de que este ID exista en la tabla Category
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });