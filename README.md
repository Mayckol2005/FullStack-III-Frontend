# Frontend - Plataforma Colegio Bernardo O’Higgins

Frontend desarrollado en React para la plataforma de gestión escolar del Colegio Bernardo O’Higgins.  
Este proyecto forma parte de una arquitectura distribuida basada en microservicios desarrollados con Spring Boot y autenticación JWT.

---

# Descripción del proyecto

La aplicación frontend permite interactuar con los distintos microservicios del ecosistema académico mediante una interfaz web moderna y modular.

El sistema fue desarrollado utilizando React + Vite, consumiendo APIs REST protegidas mediante tokens JWT.

Actualmente el frontend incorpora funcionalidades de:

- Inicio de sesión de usuarios.
- Protección de rutas privadas.
- Gestión de usuarios.
- Consumo de APIs REST.
- Manejo de autenticación JWT.
- Navegación mediante componentes reutilizables.

---
# Objetivo del frontend

Desarrollar una interfaz web moderna que permita consumir los microservicios del sistema académico del Colegio Bernardo O’Higgins, facilitando la gestión institucional mediante una experiencia rápida, organizada y segura.

---

# Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| React | Construcción de interfaz de usuario |
| Vite | Entorno de desarrollo y build |
| JavaScript ES6+ | Desarrollo frontend |
| CSS3 | Estilos personalizados |
| React Router DOM | Navegación entre vistas |
| Fetch API | Consumo de APIs REST |
| ESLint | Estandarización de código |
| JWT | Autenticación y autorización |

---

# Arquitectura del frontend

El proyecto sigue una arquitectura modular basada en separación de responsabilidades.

## Estructura general

```bash
frontend-colegio-react/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   └── RutaProtegida.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Usuarios.jsx
│   │
│   ├── services/
│   │   ├── authService.js
│   │   └── usuarioService.js
│   │
│   ├── styles/
│   │   └── estilos.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

---
