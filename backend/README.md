# Backend – Test-App

Este proyecto backend está construido con **NestJS** y **TypeORM**, conectado a PostgreSQL, y expone un CRUD completo para la entidad **Product**.

---

## Tecnologías y paquetes

- **NestJS** 10+  
- **TypeORM**  
- **PostgreSQL**  
- **@nestjs/config** (gestión de `.env`)  
- **class-validator**, **class-transformer** (validación de DTOs)  
- **@nestjs/mapped-types** (DTOs parciales)  
- **Node.js**, **TypeScript**

---

## Configuración inicial

1. Clona este repositorio y entra en la carpeta `backend/`.  
2. Crea un archivo `.env` con tus credenciales y puerto:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=BackendTest123
   DB_DATABASE=w_test
   PORT=3001
   
3. Instala dependencias:

npm install

4. Levanta el servidor en modo desarrollo:

npm run start:dev
Arranca en http://localhost:3001

## Estructura de carpetas

backend/
├─ src/
│  ├─ app.module.ts
│  ├─ main.ts
│  └─ products/
│     ├─ dto/
│     │  ├ create-product.dto.ts
│     │  └ update-product.dto.ts
│     ├─ entities/
│     │  └ product.entity.ts
│     ├─ products.controller.ts
│     ├─ products.service.ts
│     └─ products.module.ts
├─ .env
├─ package.json
├─ tsconfig.json
└─ README.md

## 📋 Endpoints de prueba


Método	Ruta	Descripción
POST	/products	Crea un nuevo producto
GET	/products	Lista todos los productos
GET	/products/:id	Obtiene un producto por su ID
PATCH	/products/:id	Actualiza un producto
DELETE	/products/:id	Elimina un producto

## Prueba con Postman o Insomnia:

201 Created al crear

Array de productos al listar

Objeto al obtener por ID

{ affected: 1 } en actualización y eliminación

400 Bad Request si envías datos inválidos