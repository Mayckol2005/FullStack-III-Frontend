# Colegio Bernardo O'Higgins — Frontend Plataforma de Gestión Escolar

![React](https://img.shields.io/badge/React-19.2.5-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.0.10-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4.1.7-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Frontend web de la plataforma de gestión escolar del **Colegio Bernardo O'Higgins**, desarrollado con React y Vite.

La aplicación proporciona una vista pública institucional y módulos privados asociados a los distintos roles de la comunidad educativa. El frontend consume servicios REST del ecosistema backend mediante el API Gateway y utiliza autenticación basada en JWT.

---

# Integrantes

- Martín Baza
- Mayckol Mardones
- Francisco Vera

---

# Objetivo del frontend

Desarrollar una interfaz web modular que permita a estudiantes, profesores y personal administrativo interactuar con los procesos académicos del establecimiento.

El frontend centraliza la experiencia de usuario de la plataforma y se comunica con una arquitectura backend distribuida basada en microservicios.

Entre los procesos contemplados se encuentran:

- Autenticación de usuarios.
- Navegación protegida según rol.
- Gestión académica.
- Registro de evaluaciones.
- Control de asistencia.
- Gestión de anotaciones.
- Consulta de información estudiantil.
- Comunicaciones institucionales.
- Administración de usuarios y estudiantes.
- Acceso a información pública del establecimiento.

---

# Funcionalidades implementadas

## Vista pública institucional

La ruta pública principal presenta información institucional del Colegio Bernardo O'Higgins y permite acceder al portal educativo.

Incluye:

- Identidad institucional del establecimiento.
- Información de Educación Básica y Educación Media.
- Hero principal con imagen del colegio.
- Presentación del proyecto educativo.
- Información sobre los niveles educativos.
- Sección de Admisión Escolar 2027.
- Información sobre apoyo al estudiante.
- Programa de Integración Escolar.
- Convivencia Escolar.
- Acompañamiento formativo.
- Documentos institucionales en formato PDF.
- Proyecto Educativo Institucional.
- Manual y Protocolos de Convivencia Escolar.
- Reglamento Interno Escolar.
- Información de ubicación y contacto.
- Integración visual con Google Maps.
- Acceso a Instagram y Facebook institucionales.
- Acceso al portal educativo.

---

## Autenticación

La aplicación implementa autenticación mediante JWT.

El proceso considera:

1. El usuario ingresa sus credenciales.
2. El frontend envía la solicitud de autenticación al backend.
3. `auth-service` valida las credenciales.
4. El backend genera un token JWT.
5. El frontend almacena la información necesaria para mantener la sesión.
6. Las solicitudes protegidas incorporan el token en el encabezado `Authorization`.

Ejemplo:

```http
Authorization: Bearer <token>
```

La aplicación permite además cerrar la sesión y eliminar los datos de autenticación almacenados localmente.

---

## Protección de rutas

Las vistas privadas se encuentran protegidas mediante componentes de control de acceso.

La aplicación valida:

- Existencia de una sesión autenticada.
- Token disponible.
- Rol del usuario.
- Acceso permitido a la ruta solicitada.

Cuando un usuario intenta acceder a una vista sin cumplir los requisitos de autorización, es redirigido al flujo correspondiente.

---

## Módulo Profesor

El módulo Profesor permite gestionar procesos académicos asociados a los cursos y asignaturas del docente autenticado.

### Dashboard del profesor

Presenta información del profesor y sus asignaciones académicas.

Permite acceder a:

- Evaluaciones.
- Asistencia.
- Anotaciones.

---

### Evaluaciones

La vista de evaluaciones permite:

- Seleccionar un curso.
- Seleccionar una asignatura.
- Consultar la nómina de estudiantes.
- Registrar calificaciones N1, N2 y N3.
- Recuperar evaluaciones previamente almacenadas.
- Sincronizar calificaciones con el backend.
- Visualizar promedios calculados a partir de las evaluaciones.

El flujo se integra con los servicios académicos y de evaluaciones mediante el API Gateway.

---

### Asistencia

La vista de asistencia permite:

- Seleccionar un curso.
- Seleccionar una fecha.
- Obtener la nómina de estudiantes.
- Recuperar asistencia previamente registrada.
- Marcar el estado de asistencia de cada estudiante.
- Guardar la lista completa del curso.
- Recargar la información persistida desde el backend.

---

### Anotaciones

La vista de anotaciones permite:

- Seleccionar un curso.
- Consultar estudiantes.
- Acceder a la hoja de vida de un estudiante.
- Registrar anotaciones positivas.
- Registrar anotaciones negativas.
- Consultar el historial de anotaciones.
- Visualizar indicadores de anotaciones positivas y negativas.
- Ordenar el historial desde los registros más recientes.

---

## Módulo Administrador

La plataforma contempla vistas administrativas para la gestión institucional.

Entre las funcionalidades presentes se encuentran:

- Gestión de usuarios.
- Gestión de estudiantes.
- Gestión de cursos.
- Comunicaciones institucionales.

Las operaciones disponibles dependen de la autorización del usuario y de los servicios backend asociados.

---

## Módulo Estudiante

El módulo Estudiante permite consultar información académica personal.

Incluye vistas para:

- Dashboard del estudiante.
- Mis notas.
- Mi asistencia.
- Mis anotaciones.
- Comunicaciones.

---

# Arquitectura del frontend

El proyecto utiliza una organización modular basada en separación de responsabilidades.

```txt
frontend-colegio-react/
│
├── public/
│
├── src/
│   ├── api/
│   │   ├── apiClient.js
│   │   └── apiClient.test.js
│   │
│   ├── assets/
│   │   ├── documents/
│   │   ├── images/
│   │   └── logos/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── profesor/
│   │   ├── public/
│   │   └── ui/
│   │
│   ├── hooks/
│   │
│   ├── pages/
│   │   ├── admin/
│   │   ├── alumno/
│   │   ├── profesor/
│   │   ├── public/
│   │   └── shared/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── styles/
│   │
│   ├── utils/
│   │
│   ├── App.jsx
│   ├── App.test.jsx
│   ├── main.jsx
│   └── setupTests.js
│
├── package.json
├── vite.config.js
└── README.md
```

---

# Organización por responsabilidades

| Directorio | Responsabilidad |
|---|---|
| `api/` | Cliente HTTP común y comunicación base con las APIs |
| `assets/` | Imágenes, logotipos y documentos institucionales |
| `components/` | Componentes reutilizables |
| `hooks/` | Hooks personalizados de React |
| `pages/` | Vistas organizadas por módulo y rol |
| `routes/` | Configuración de navegación |
| `services/` | Comunicación con los servicios backend |
| `styles/` | Estilos globales de la aplicación |
| `utils/` | Utilidades de autenticación, storage y formato |

---

# Stack tecnológico

## Frontend

- React 19.
- Vite 8.
- JavaScript ES6+.
- CSS3.
- React Router DOM.

## Comunicación HTTP

- Fetch API.
- APIs REST.
- API Gateway.

## Seguridad

- JWT.
- Control de acceso basado en roles.
- Rutas protegidas.
- Persistencia local de sesión.

## Testing

- Vitest.
- Testing Library.
- Jest DOM.
- Mocks y spies para dependencias y APIs.

## Calidad de código

- ESLint.
- Separación de responsabilidades.
- Componentes reutilizables.
- Servicios desacoplados de las vistas.

## Control de versiones

- Git.
- GitHub.
- GitHub Flow.

---

# Patrones y organización implementados

## Service Pattern

La lógica de comunicación con APIs se encuentra separada de los componentes visuales.

Los servicios se ubican en:

```txt
src/services/
```

Ejemplos:

```txt
authService.js
usuarioService.js
estudianteService.js
academicoService.js
profesorService.js
comunicacionService.js
```

Esta separación permite:

- Reutilizar llamadas HTTP.
- Evitar lógica de infraestructura en los componentes.
- Facilitar pruebas unitarias.
- Mantener centralizada la comunicación con el backend.

---

## API Client

La aplicación dispone de un cliente HTTP común en:

```txt
src/api/apiClient.js
```

Este componente centraliza aspectos comunes de las solicitudes y facilita el consumo de endpoints protegidos.

---

## Component-Based Architecture

La interfaz se divide en componentes reutilizables.

Ejemplos:

```txt
components/common/
components/layout/
components/profesor/
components/public/
components/ui/
```

Esta organización permite aislar responsabilidades visuales y reutilizar componentes en distintas vistas.

---

## Protected Route Pattern

Las rutas privadas utilizan un componente de protección encargado de verificar autenticación y autorización.

Ubicación:

```txt
src/components/common/RutaProtegida.jsx
```

El patrón permite restringir vistas de acuerdo con el rol disponible en la sesión.

---

## Custom Hooks

La aplicación utiliza hooks personalizados para encapsular lógica reutilizable asociada al estado y autenticación.

Ejemplo:

```txt
src/hooks/useAuth.js
```

---

# Comunicación con el backend

El frontend forma parte de una plataforma distribuida basada en microservicios Spring Boot.

El flujo principal de comunicación es:

```txt
React
  │
  ▼
API Gateway
  │
  ├── Auth Service
  ├── Usuario Service
  ├── Estudiante Service
  ├── Académico Service
  ├── Evaluación Service
  ├── Asistencia Service
  ├── Anotación Service
  ├── Comunicación Service
  └── Reporte Service
```

El API Gateway constituye el punto central de entrada hacia el ecosistema backend.

Durante la ejecución local, el Gateway se encuentra disponible en:

```txt
http://localhost:8080
```

---

# Seguridad y sesión

La sesión utiliza información almacenada en el navegador para conservar el estado de autenticación.

Entre las utilidades implementadas se encuentran funciones para:

- Guardar el token.
- Recuperar el token.
- Eliminar el token.
- Guardar el rol del usuario.
- Recuperar la información de autenticación.
- Validar el acceso a rutas.

Las solicitudes protegidas utilizan JWT en los encabezados HTTP.

```javascript
{
  Authorization: `Bearer ${token}`
}
```

---

# Testing y calidad de software

La aplicación utiliza Vitest y Testing Library para validar componentes, páginas, servicios, hooks, utilidades y navegación.

La suite contempla pruebas para:

- Autenticación.
- Cliente HTTP.
- Servicios.
- Rutas.
- Rutas protegidas.
- Componentes reutilizables.
- Landing pública.
- Login.
- Módulo Administrador.
- Módulo Profesor.
- Módulo Estudiante.
- Hooks.
- Utilidades de sesión.
- Formateadores.

## Última validación registrada

```txt
Test Files  40 passed (40)
Tests       205 passed (205)
```

Las pruebas focalizadas de la vista pública registraron:

```txt
HeroBanner.test.jsx     4 passed
LandingPage.test.jsx    9 passed

Tests                  13 passed
```

---

# Build de producción

La aplicación fue validada mediante el proceso de build de Vite.

Comando:

```bash
npm run build
```

Última validación registrada:

```txt
vite v8.0.10 building client environment for production...

63 modules transformed

✓ built
```

El proceso de build incluye los recursos utilizados por la landing pública, entre ellos:

- Imagen institucional del establecimiento.
- Logotipo del colegio.
- Proyecto Educativo Institucional.
- Manual y Protocolos de Convivencia Escolar.
- Reglamento Interno Escolar.

---

# Instalación del proyecto

## 1. Clonar el repositorio

```bash
git clone https://github.com/Mayckol2005/FullStack-III-Frontend.git
```

## 2. Ingresar al proyecto

```bash
cd FullStack-III-Frontend/frontend-colegio-react
```

## 3. Instalar dependencias

```bash
npm install
```

## 4. Ejecutar el entorno de desarrollo

```bash
npm run dev
```

La aplicación estará disponible, de forma predeterminada, en:

```txt
http://localhost:5173
```

---

# Scripts disponibles

## Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo de Vite.

## Testing

```bash
npm test -- --run
```

Ejecuta la suite completa de pruebas.

También es posible ejecutar pruebas focalizadas:

```bash
npx vitest run src/components/public/HeroBanner.test.jsx src/pages/public/LandingPage.test.jsx
```

## Build de producción

```bash
npm run build
```

Genera los archivos optimizados para producción.

## Preview

```bash
npm run preview
```

Permite visualizar localmente el resultado del build.

## ESLint

```bash
npm run lint
```

Ejecuta el análisis estático configurado para el proyecto.

---

# Requisitos

- Node.js.
- npm.
- Backend del proyecto disponible.
- API Gateway operativo.
- Microservicios necesarios registrados y disponibles.

Para levantar el ecosistema backend completo se debe consultar el repositorio correspondiente.

---

# Estrategia de branching

El equipo utiliza **GitHub Flow**.

| Rama | Propósito |
|---|---|
| `main` | Rama estable e integrada |
| `feat/*` | Desarrollo de nuevas funcionalidades |
| `docs/*` | Cambios de documentación |

El flujo de integración utilizado es:

```txt
main
  │
  └── rama de trabajo
          │
          ├── commits
          ├── push
          └── Pull Request
                    │
                    ▼
                   main
```

Los cambios se integran mediante Pull Requests una vez revisados y validados.

---

# Estado actual

- [x] Vista pública institucional.
- [x] Landing responsive.
- [x] Admisión Escolar 2027.
- [x] Documentos institucionales.
- [x] Google Maps.
- [x] Autenticación JWT.
- [x] Rutas protegidas.
- [x] Navegación por roles.
- [x] Módulo Administrador.
- [x] Módulo Profesor.
- [x] Módulo Estudiante.
- [x] Evaluaciones.
- [x] Asistencia.
- [x] Anotaciones.
- [x] Comunicaciones.
- [x] Suite automatizada de pruebas.
- [x] Build de producción validado.

---

# Repositorios

## Frontend

https://github.com/Mayckol2005/FullStack-III-Frontend

## Backend

https://github.com/Mayckol2005/FullStack-III

---

# Asignatura

**Desarrollo Fullstack III**

Profesor: **Marcelo Crisostomo**