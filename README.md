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
# Patrones de diseño implementados

Durante el desarrollo del frontend se aplicaron distintos patrones de diseño para asegurar mantenibilidad, reutilización y escalabilidad.

---

## 1. Service Pattern

Implementado en:

```bash
src/services/
```

Archivos:

- authService.js
- usuarioService.js

### Objetivo

Separar la lógica de consumo de APIs de la lógica visual de los componentes React.

### Beneficios

- Código más mantenible.
- Reutilización de llamadas HTTP.
- Componentes más limpios.
- Facilita cambios futuros en endpoints.

### Ejemplo

```javascript
export async function obtenerUsuarios() {
    const response = await fetch(url);
    return response.json();
}
```

---

## 2. Component-Based Architecture

Implementado mediante componentes reutilizables React.

### Objetivo

Separar funcionalidades en componentes independientes.

### Beneficios

- Reutilización.
- Escalabilidad.
- Mantenimiento más sencillo.
- Separación clara de responsabilidades.

### Ejemplo

```bash
components/RutaProtegida.jsx
```

---

## 3. Protected Route Pattern

Implementado en:

```bash
RutaProtegida.jsx
```

### Objetivo

Restringir acceso a vistas privadas si el usuario no está autenticado.

### Beneficios

- Seguridad.
- Control de acceso.
- Protección de navegación.

---

# Buenas prácticas implementadas

## Separación de responsabilidades

- Pages → Vistas.
- Services → Lógica HTTP.
- Components → Componentes reutilizables.
- Styles → Estilos separados.

---

## Código modular

Cada funcionalidad fue organizada en carpetas específicas para facilitar el mantenimiento y escalabilidad.

---

## Uso de ESLint

Se incorporó ESLint para mantener un estándar de código consistente.

---

## Autenticación desacoplada

La lógica JWT fue separada del frontend visual utilizando servicios independientes.

---

# Funcionalidades implementadas

## Login de usuarios

Permite autenticación mediante JWT consumiendo el microservicio Auth.

### Funciones

- Inicio de sesión.
- Validación de credenciales.
- Obtención de token.
- Persistencia de sesión.

---

## Gestión de usuarios

Vista encargada de consumir el microservicio Usuario.

### Operaciones

- Obtener usuarios.
- Crear usuarios.
- Actualizar usuarios.
- Eliminar usuarios.

---

## Protección de rutas

Implementada mediante:

```bash
RutaProtegida.jsx
```

Permite bloquear acceso a páginas privadas si no existe autenticación válida.

---

# Comunicación con backend

Este frontend consume una arquitectura backend basada en microservicios desarrollados con Spring Boot.

## Backend conectado

- API Gateway
- Eureka Server
- Config Server
- Auth Service
- Usuario Service
- Académico Service
- Estudiantes Service
- Evaluaciones Service
- Reporte Service (BFF)

---

# Patrón arquitectónico utilizado

## Arquitectura de Microservicios

El frontend consume servicios desacoplados e independientes.

### Beneficios

- Escalabilidad.
- Despliegue independiente.
- Mejor mantenibilidad.
- Separación de dominios.

---

## Patrón BFF (Backend For Frontend)

El sistema utiliza un Backend For Frontend para consolidar información proveniente de múltiples microservicios.

### Beneficios

- Reduce llamadas desde frontend.
- Optimiza rendimiento.
- Centraliza agregación de datos.

---

# Estrategia de branching utilizada

El equipo utilizó GitHub Flow para el control de versiones.

## Flujo utilizado

- main → Rama principal estable.
- feature/* → Desarrollo de nuevas funcionalidades.
- Pull Requests → Integración de cambios.
- Merge → Integración validada.

---

## Ejemplos de ramas

```bash
feature/login-react
feature/rutas-protegidas
feature/usuarios-crud
feature/auth-service
```

---

## Beneficios obtenidos

- Trabajo colaborativo simultáneo.
- Prevención de conflictos.
- Mayor estabilidad.
- Mejor trazabilidad del código.

---

# Instalación del proyecto

## 1. Clonar repositorio

```bash
git clone https://github.com/Mayckol2005/FullStack-III-Frontend.git
```

---

## 2. Entrar al proyecto

```bash
cd frontend-colegio-react
```

---

## 3. Instalar dependencias

```bash
npm install
```

---

## 4. Ejecutar entorno de desarrollo

```bash
npm run dev
```

---

# URL local

```bash
http://localhost:5173
```

---

# Scripts disponibles

## Desarrollo

```bash
npm run dev
```

Inicia servidor de desarrollo Vite.

---

## Build de producción

```bash
npm run build
```

Genera versión optimizada de producción.

---

## Preview producción

```bash
npm run preview
```

Permite visualizar la build final localmente.

---

# Dependencias principales

## React

```bash
npm install react react-dom
```

---

## React Router DOM

```bash
npm install react-router-dom
```

---

# Requisitos

- Node.js v18 o superior
- npm v9 o superior
- Backend ejecutándose
- API Gateway activo

---

# Repositorios

## Frontend

https://github.com/Mayckol2005/FullStack-III-Frontend

---

## Backend

https://github.com/Mayckol2005/FullStack-III

---

# Integrantes

- Martín Baza
- Mayckol Mardones
- Francisco Vera

---

# Asignatura

Desarrollo Fullstack III

---

# Profesor

Marcelo Crisostomo

---
