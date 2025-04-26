# Backend - Test-App

Este backend ha sido creado utilizando **NestJS** como framework principal, con conexión a una base de datos **PostgreSQL** mediante **TypeORM**.  
Esta rama `feature/setup-backend` contiene únicamente la **configuración inicial** del proyecto.

---

## 🚀 Tecnologías utilizadas

- NestJS 10+
- TypeORM
- PostgreSQL
- @nestjs/config
- Node.js
- TypeScript

---

## 🛠 Configuración inicial realizada

- Creación del proyecto `backend/` utilizando NestJS CLI.
- Instalación de dependencias:
  - `@nestjs/typeorm`
  - `typeorm`
  - `pg`
  - `@nestjs/config`
- Configuración de la conexión a PostgreSQL usando `TypeOrmModule`.
- Gestión de variables de entorno mediante `.env`.
- Ajuste de `AppModule` para cargar entidades automáticamente y conectar a la base de datos.

---

## 📂 Estructura actual del proyecto

backend/ 
├── src/ │ 
├── app.module.ts 
│ 
├── main.ts 
├── .env 
├── package.json 
├── tsconfig.json 
└── README.md
