# Backend – Test-App

Este proyecto backend está construido con **NestJS** y **TypeORM**, conectado a PostgreSQL, y expone:

1. Un CRUD completo para la entidad **Product**  
2. Un módulo de **Transactions** para crear y consultar pagos en estado PENDING

---
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
   PORT=3002
   
3. Instala dependencias:

npm install

4. Levanta el servidor en modo desarrollo:

npm run start:dev
Arranca en http://localhost:3002

## Estructura de carpetas

backend/
├─ src/
│  ├─ app.module.ts
│  ├─ main.ts
│  ├─ products/
│  │  ├─ dto/
│  │  │  ├ create-product.dto.ts
│  │  │  └ update-product.dto.ts
│  │  ├─ entities/
│  │  │  └ product.entity.ts
│  │  ├─ products.controller.ts
│  │  ├─ products.service.ts
│  │  └ products.module.ts
│  └─ transactions/
│     ├─ dto/
│     │  └ create-transaction.dto.ts
│     ├─ entities/
│     │  └ transaction.entity.ts
│     ├─ transactions.controller.ts
│     ├─ transactions.service.ts
│     └─ transactions.module.ts
├─ .env
├─ package.json
├─ tsconfig.json
└─ README.md

## Paso 4: CRUD de Products
Endpoints:

POST /products

GET /products

GET /products/:id

PATCH /products/:id

DELETE /products/:id

Validación con class-validator

Pruebas en Postman:

201 Created al crear

200 OK al listar/leer

{ "affected": 1 } en PATCH/DELETE

400 Bad Request si el payload no cumple el DTO

# Paso 5: Módulo Transactions
Endpoints:

POST /transactions → crea en estado PENDING

GET /transactions → lista todas

GET /transactions/:id → busca por ID

DTO: convierte/valida amount (número), customerInfo y deliveryInfo (JSON)


## Prueba con Postman

URL: {{baseUrl}}/transactions

Headers: Content-Type: application/json

Body (raw JSON):

{
  "amount": 10000,
  "customerInfo": {
    "name": "Julián Cañas",
    "cardNumber": "4242424242424242",
    "expMonth": "12",
    "expYear": "2027",
    "cvc": "123"
  },
  "deliveryInfo": {
    "address": "Cra 123 #45-67",
    "city": "Bogotá",
    "postal": "110111",
    "phone": "+573001234567"
  }
}

Respuesta esperada: 201 Created + objeto de la transacción

## GET /transactions

URL: {{baseUrl}}/transactions

Respuesta: 200 OK + array de transacciones

## GET /transactions/:id

URL: {{baseUrl}}/transactions/1

Respuesta: 200 OK + objeto de la transacción con id=1

## Validaciones

Omite amount o envía un string mal formateado → 400 Bad Request

ID inexistente en GET → 404 Not Found