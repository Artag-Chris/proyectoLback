FROM node:22

WORKDIR /usr/src/app

# Copiar los archivos de paquete
COPY package.json ./
COPY package-lock.json ./

# Instalar dependencias y Prisma CLI
RUN npm install
RUN npm install -g typescript
RUN npm install -g prisma

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Generar Prisma Client
RUN prisma generate

# Exponer el puerto de la aplicación
EXPOSE 15037

# Ejecutar migraciones de Prisma y levantar la aplicación en modo producción
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
