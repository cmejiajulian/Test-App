# Checkout App

Aplicación web que simula un flujo de compra de productos con selección, vista previa y paso hacia el formulario de pago.

---

## 🧠 Objetivo

Crear una interfaz clara y funcional que permita:

- Visualizar productos disponibles
- Seleccionar uno y avanzar al proceso de compra
- Ingresar datos de tarjeta y dirección de entrega
- Gestionar el estado global con Redux Toolkit
- Usar rutas amigables con React Router

---

## ⚙️ Tecnologías utilizadas

- [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)

---

## ✅ Funcionalidades implementadas

| Parte        | Descripción                                                                 |
|--------------|------------------------------------------------------------------------------|
| Parte 1      | Setup inicial del proyecto con Vite, React, Tailwind y estructura de rutas |
| Parte 2      | Configuración de Redux Toolkit para manejar el catálogo                    |
| Parte 3      | Vista de catálogo con productos simulados y lógica de selección            |
| Parte 4      | Formulario de pago y entrega: captura de tarjeta y dirección, validación y guardado en Redux |
| Parte 5      | Pantalla de resumen del pedido con recuperación desde `localStorage` |
| Parte 6      | Pantalla de resultado (`/result`) con mensaje de éxito o error y reinicio del flujo |

---

## 🧾 Parte 4 y Parte 5: Formulario de pago y pantalla de resumen

Estas dos partes conforman la segunda mitad del flujo de compra:  
el usuario primero ingresa su información de pago y entrega, y luego puede revisar un resumen completo del pedido antes de finalizar.

### Parte 4: Formulario de pago y entrega

- Captura datos sensibles como número de tarjeta, titular, dirección y nombre.
- Valida que todos los campos estén completos antes de continuar.
- Almacena la información en Redux (`checkoutSlice.js`) y en `localStorage` para mantener la persistencia en caso de recarga.

### Parte 5: Pantalla de resumen

- Recupera y muestra los datos del producto seleccionado y los datos de entrega ingresados.
- Permite al usuario verificar la información antes de confirmar la compra.
- El flujo se mantiene intacto incluso si el usuario recarga la página, gracias al uso de `localStorage`.

**Incluye:**
- Validación segura para evitar errores al renderizar
- Fallback visual si el estado no está disponible
- Botón para finalizar compra y continuar al resultado (`/result`)

---

## Parte 6: Pantalla de resultado

Después del resumen, se simula un resultado de pago usando lógica aleatoria:

- El usuario ve un estado "Procesando pago..." por unos segundos
- Luego se muestra un mensaje de éxito o error
- Incluye botón para volver al catálogo y reiniciar el flujo
- El resultado se simula en frontend usando `Math.random()`
- Se limpia el estado de Redux y localStorage al finalizar


## Estructura del proyecto

src/ 
├── features/ │ 
 ├── catalog/ │ 
 │ ├── CatalogView.jsx │ 
 │ ├── ProductCard.jsx │ 
 │ └── catalogSlice.js │ 
 ├── checkout/ │ 
 │ ├── CheckoutForm.jsx │
 │ └── checkoutSlice.js │ 
 └── summary/ │ 
 │ └── Summary.jsx 
 └── result/ │ 
    └── Result.jsx
 ├── routes/ │ 
  └── AppRoutes.jsx
 ├── store/ │ 
  └── index.js 
├── App.jsx 
└── main.jsx
---

## 🖥️ Cómo ejecutar el proyecto localmente

```bash
# Clonar el repositorio
git clone git@github.com:TU_USUARIO/checkout-app.git
cd checkout-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
