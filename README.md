# Checkout App

Aplicación web que simula un flujo de compra de productos con selección, vista previa y paso hacia el formulario de pago.

## 🧠 Objetivo

Crear una interfaz clara y funcional que permita:

- Visualizar productos disponibles
- Seleccionar uno y avanzar al proceso de compra
- Gestionar el estado global con Redux Toolkit
- Usar rutas amigables con React Router

---

## ⚙️ Tecnologías utilizadas

- [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)

---

## Funcionalidades implementadas (hasta Parte 3)

| Parte        | Descripción                                                                 |
|--------------|------------------------------------------------------------------------------|
|  Parte 1    | Setup inicial del proyecto con Vite, React, Tailwind y estructura de rutas |
|  Parte 2    | Configuración de Redux Toolkit para manejar el catálogo                    |
| Parte 3    | Vista de catálogo con productos simulados y lógica de selección            |

---

## Estructura del proyecto

src/ 
├── features/ │ 
├── catalog/ │ 
│ ├── CatalogView.jsx │ 
│ ├── ProductCard.jsx │ 
│ └── catalogSlice.js ├── store/ 
│ └── index.js 
├── routes/ 
│ └── AppRoutes.jsx 
├── App.jsx 
└── main.jsx

---

## 🧪 Próximas funcionalidades (en progreso)

- Formulario de pago y datos de entrega
- Pantalla de resumen de pedido
- Simulación de resultado de pago

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
