# Frontend - Plataforma Colegio Bernardo O’Higgins

Frontend desarrollado en React para la plataforma de gestión escolar del Colegio Bernardo O’Higgins.  
Este proyecto forma parte de una arquitectura basada en microservicios desarrollados con Spring Boot y autenticación mediante JWT.

---

# Descripción del proyecto

La aplicación frontend permite interactuar con los distintos microservicios del ecosistema académico mediante una interfaz web moderna y modular.

El sistema fue desarrollado utilizando React + Vite y consume APIs REST protegidas mediante tokens JWT.

Actualmente el frontend incorpora funcionalidades de:

- Inicio de sesión de usuarios.
- Protección de rutas privadas.
- Gestión de usuarios.
- Consumo de APIs REST.
- Manejo de autenticación JWT.
- Control de acceso basado en roles.
- Navegación mediante React Router DOM.

---

# Objetivo del frontend

Desarrollar una interfaz web moderna y segura que permita consumir los microservicios del sistema académico del Colegio Bernardo O’Higgins, facilitando la administración institucional mediante una experiencia rápida, organizada y escalable.

---

# Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| React 19 | Construcción de interfaz de usuario |
| Vite | Entorno de desarrollo y build |
| JavaScript ES6+ | Desarrollo frontend |
| CSS3 | Estilos personalizados |
| React Router DOM | Navegación entre vistas |
| Fetch API | Consumo de APIs REST |
| ESLint | Estandarización de código |
| JWT | Autenticación y autorización |
| LocalStorage | Persistencia de sesión |

---

# Dependencias principales

## Producción

```json
"dependencies": {
  "react": "^19.2.5",
  "react-dom": "^19.2.5",
  "react-router-dom": "^7.15.0"
}
```

---

## Desarrollo

```json
"devDependencies": {
  "@eslint/js": "^10.0.1",
  "@types/react": "^19.2.14",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^6.0.1",
  "eslint": "^10.2.1",
  "eslint-plugin-react-hooks": "^7.1.1",
  "eslint-plugin-react-refresh": "^0.5.2",
  "globals": "^17.5.0",
  "vite": "^8.0.10"
}
```

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

# 1. Service Pattern

Implementado en:

```bash
src/services/
```

Archivos:

- authService.js
- usuarioService.js

## Objetivo

Separar la lógica de consumo de APIs de la lógica visual de los componentes React.

## Beneficios

- Código más mantenible.
- Reutilización de llamadas HTTP.
- Componentes más limpios.
- Mejor organización del proyecto.
- Facilita cambios futuros en endpoints.

## Ejemplo

```javascript
export const obtenerUsuarios = async () => {
    const res = await fetch(API_URL, {
        headers: obtenerCabeceras()
    });

    return await res.json();
};
```

---

# 2. Component-Based Architecture

Implementado mediante componentes reutilizables React.

## Objetivo

Separar funcionalidades en componentes independientes y reutilizables.

## Beneficios

- Escalabilidad.
- Reutilización.
- Mantenimiento más sencillo.
- Separación clara de responsabilidades.

## Ejemplo

```bash
components/RutaProtegida.jsx
```

---

# 3. Protected Route Pattern

Implementado en:

```bash
RutaProtegida.jsx
```

## Objetivo

Restringir acceso a vistas privadas cuando el usuario no se encuentra autenticado o no posee el rol adecuado.

## Funcionamiento

El componente:

- Verifica existencia del token JWT.
- Verifica rol del usuario.
- Redirecciona automáticamente al login si no cumple los permisos.

## Ejemplo

```javascript
if (!token) {
    return <Navigate to="/login" replace />;
}
```

## Beneficios

- Seguridad.
- Protección de rutas privadas.
- Control de acceso por roles.
- Mejor experiencia de navegación.

---

# Buenas prácticas implementadas

## Separación de responsabilidades

- Pages → Vistas principales.
- Services → Lógica HTTP.
- Components → Componentes reutilizables.
- Styles → Estilos separados.

---

## Código modular

Cada funcionalidad fue organizada en carpetas específicas para facilitar el mantenimiento y escalabilidad.

---

## Uso de ESLint

Se incorporó ESLint para mantener un estándar de código consistente y detectar errores durante el desarrollo.

---

## Persistencia de sesión

La autenticación se mantiene utilizando LocalStorage:

```javascript
localStorage.setItem('token_colegio', datos.token);
localStorage.setItem('usuario_rol', datos.rol);
```

---

## Manejo de rutas

Se utilizó React Router DOM para gestionar la navegación de forma dinámica entre vistas.

---

# Funcionalidades implementadas

# Login de usuarios

Vista encargada de autenticar usuarios mediante JWT.

## Funciones

- Inicio de sesión.
- Validación de credenciales.
- Obtención de token JWT.
- Persistencia de sesión.
- Almacenamiento de rol.

## Endpoint consumido

```http
POST http://localhost:8090/api/auth/login
```

---

# Gestión de usuarios

Vista encargada de consumir el microservicio Usuario.

## Operaciones implementadas

- Obtener usuarios.
- Crear usuarios.
- Editar usuarios.
- Eliminar usuarios.
- Cerrar sesión.

## Endpoints consumidos

```http
GET    /api/usuarios
POST   /api/usuarios/crear
PUT    /api/usuarios/{id}
DELETE /api/usuarios/{id}
```

---

# Protección de rutas

Implementada mediante:

```bash
RutaProtegida.jsx
```

## Rol requerido

Actualmente la ruta:

```bash
/usuarios
```

solo puede ser accedida por usuarios con rol:

```bash
ADMINISTRADOR
```

---

# Comunicación con backend

Este frontend consume una arquitectura backend basada en microservicios desarrollados con Spring Boot.

## Servicios conectados

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

# Arquitectura de Microservicios

El frontend consume servicios desacoplados e independientes.

## Beneficios

- Escalabilidad.
- Despliegue independiente.
- Mejor mantenibilidad.
- Separación de dominios.
- Mayor modularidad.

---

# Patrón BFF (Backend For Frontend)

El sistema utiliza un Backend For Frontend para consolidar información proveniente de múltiples microservicios.

## Beneficios

- Reduce llamadas desde frontend.
- Optimiza rendimiento.
- Centraliza agregación de datos.
- Simplifica consumo de información.

---

# Estrategia de branching utilizada

El equipo utilizó GitHub Flow para el control de versiones.

## Flujo utilizado

- main → Rama principal estable.
- feature/* → Desarrollo de funcionalidades.
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
- Mejor trazabilidad.
- Mayor estabilidad del proyecto.

---

# Instalación del proyecto

## 1. Clonar repositorio

```bash
git clone https://github.com/Mayckol2005/FullStack-III-Frontend.git
```

---

## 2. Ingresar al proyecto

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

Genera versión optimizada para producción.

---

## Preview de producción

```bash
npm run preview
```

Permite visualizar la build final localmente.

---

## Linter

```bash
npm run lint
```

Ejecuta ESLint para validar calidad y estandarización del código.

---

# Requisitos

- Node.js v18 o superior
- npm v9 o superior
- Backend ejecutándose
- API Gateway activo
- Microservicios activos

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
