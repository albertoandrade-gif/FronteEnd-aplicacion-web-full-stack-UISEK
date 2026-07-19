# Frontend — Aplicación Web Full-Stack UISEK

Interfaz web desarrollada con React y Vite para gestionar un catálogo de películas, directores y vendedores.

El frontend consume una API REST desarrollada con Django REST Framework y utiliza OAuth 2.0 para autenticar a los usuarios y proteger las rutas privadas.

---

## Integrantes

- Alberto Sebastian Andrade Endara
- Sebastián Andrés Rubio Rivera

## Universidad

Universidad Internacional SEK — UISEK

## Carrera

Ingeniería en Informática

## Asignatura

Desarrollo Web

---

## Repositorios

### Frontend

```text
https://github.com/albertoandrade-gif/FronteEnd-aplicacion-web-full-stack-UISEK
```

### Backend

```text
https://github.com/sebastianrubio-cpu/BackEnd-aplicacion-web-full-stack-UISEK
```

---

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- Material UI
- Axios
- React Router
- OAuth 2.0
- Git y GitHub

---

## Arquitectura

```text
Usuario
  ↓
React + Material UI
  ↓
Axios
  ↓
API REST de Django
  ↓
OAuth 2.0
  ↓
SQLite y archivos multimedia
```

React se encarga de la interfaz visual.

Axios realiza las peticiones HTTP hacia el backend.

React Router administra la navegación y las rutas protegidas.

Django procesa las operaciones CRUD y devuelve respuestas en formato JSON.

---

## Funcionalidades

- Inicio de sesión mediante OAuth 2.0.
- Almacenamiento local del token de acceso.
- Envío automático del token Bearer mediante Axios.
- Protección de rutas privadas.
- Cierre de sesión.
- CRUD completo de películas.
- CRUD completo de directores.
- CRUD completo de vendedores.
- Selección de director para cada película.
- Selección de varios vendedores para cada película.
- Carga y visualización de pósteres.
- Carga y visualización de fotografías de directores.
- Confirmación antes de eliminar registros.
- Mensajes de éxito y error.
- Indicadores de carga.
- Diseño adaptable mediante Material UI.

---

## Rutas de la aplicación

| Ruta | Descripción | Protección |
|---|---|---|
| `/` | Página inicial | Pública |
| `/login` | Inicio de sesión | Pública |
| `/catalogo` | Gestión de películas | Privada |
| `/directores` | Gestión de directores | Privada |
| `/vendedores` | Gestión de vendedores | Privada |

---

## Estructura principal

```text
FrontEnd-aplicacion-web-full-stack-UISEK/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── AppNavbar.jsx
│   │   ├── ConfirmDeleteDialog.jsx
│   │   ├── DirectorFormDialog.jsx
│   │   ├── PeliculaFormDialog.jsx
│   │   ├── ProtectedLayout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── VendedorFormDialog.jsx
│   │
│   ├── pages/
│   │   ├── CatalogoPage.jsx
│   │   ├── DirectoresPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── VendedoresPage.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   └── authService.js
│   │
│   ├── utils/
│   │   └── media.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## Requisitos

- Node.js
- npm
- Git
- Backend Django funcionando en:

```text
http://127.0.0.1:8000
```

---

## Instalación

### 1. Clonar el repositorio

```powershell
git clone https://github.com/albertoandrade-gif/FronteEnd-aplicacion-web-full-stack-UISEK.git
```

Entrar al proyecto:

```powershell
cd FronteEnd-aplicacion-web-full-stack-UISEK
```

### 2. Instalar dependencias

```powershell
npm install
```

---

## Variables de entorno

Crear un archivo llamado:

```text
.env.local
```

en la raíz del proyecto.

Contenido básico:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_CLIENT_ID=COLOCAR_CLIENT_ID
```

El archivo `.env.local` no debe subirse a GitHub.

El repositorio contiene un archivo `.env.example` sin credenciales reales.

---

## Ejecución

```powershell
npm.cmd run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

---

## Compilación

Para comprobar que el proyecto puede compilarse:

```powershell
npm.cmd run build
```

La carpeta generada es:

```text
dist/
```

Esta carpeta está ignorada por Git.

---

## Flujo de autenticación

1. El usuario escribe su nombre de usuario y contraseña.
2. React envía la solicitud al endpoint OAuth del backend.
3. Django valida las credenciales.
4. El backend devuelve un token de acceso.
5. El token se almacena en el navegador.
6. Axios incorpora el token en las peticiones protegidas.
7. React Router permite ingresar a las rutas privadas.
8. Si el token no existe o deja de ser válido, el usuario vuelve al login.

El encabezado utilizado es:

```http
Authorization: Bearer ACCESS_TOKEN
```

---

## Endpoint de autenticación

```text
POST /api/v1/o/token/
```

---

## Endpoints consumidos

### Directores

```text
GET    /api/v1/catalog/directores/
POST   /api/v1/catalog/directores/
GET    /api/v1/catalog/directores/{id}/
PATCH  /api/v1/catalog/directores/{id}/
DELETE /api/v1/catalog/directores/{id}/
```

### Películas

```text
GET    /api/v1/catalog/peliculas/
POST   /api/v1/catalog/peliculas/
GET    /api/v1/catalog/peliculas/{id}/
PATCH  /api/v1/catalog/peliculas/{id}/
DELETE /api/v1/catalog/peliculas/{id}/
```

### Vendedores

```text
GET    /api/v1/catalog/vendedores/
POST   /api/v1/catalog/vendedores/
GET    /api/v1/catalog/vendedores/{id}/
PATCH  /api/v1/catalog/vendedores/{id}/
DELETE /api/v1/catalog/vendedores/{id}/
```

---

## Gestión de imágenes

Las películas permiten cargar un póster.

Los directores permiten cargar una fotografía.

Las imágenes se envían al backend mediante:

```text
FormData
```

Los campos utilizados son:

```text
poster
foto
```

La función:

```text
src/utils/media.js
```

construye correctamente la URL de las imágenes entregadas por Django.

---

## Componentes principales

### `AppNavbar.jsx`

Muestra la barra de navegación y permite acceder a:

- Películas.
- Directores.
- Vendedores.
- Cerrar sesión.

### `ProtectedRoute.jsx`

Comprueba que exista un token antes de permitir el acceso a una página privada.

### `ProtectedLayout.jsx`

Aplica la estructura común de las páginas protegidas.

### Formularios

Los componentes:

```text
PeliculaFormDialog.jsx
DirectorFormDialog.jsx
VendedorFormDialog.jsx
```

permiten crear y editar registros mediante ventanas de diálogo.

### `ConfirmDeleteDialog.jsx`

Solicita confirmación antes de eliminar una película.

---

## Seguridad

No deben subirse al repositorio:

```text
.env.local
.env
node_modules/
dist/
access_token
refresh_token
contraseñas
client_secret
```

Las variables sensibles permanecen únicamente en el entorno local.

Los tokens son enviados mediante el encabezado Bearer.

---

## Pruebas realizadas

- Login con credenciales correctas.
- Login con credenciales incorrectas.
- Acceso a rutas protegidas.
- Redirección al login sin token.
- Creación de películas.
- Edición de películas.
- Eliminación de películas.
- Creación, edición y eliminación de directores.
- Creación, edición y eliminación de vendedores.
- Carga de pósteres.
- Carga de fotografías.
- Persistencia de imágenes después de recargar.
- Compilación mediante `npm run build`.

---

## Ejecución conjunta

### Terminal 1 — Backend

```powershell
cd "C:\Users\Luis Andrade\Documents\DesarrolloWeb\BackEnd-aplicacion-web-full-stack-UISEK"
.\venv\Scripts\python.exe manage.py runserver
```

### Terminal 2 — Frontend

```powershell
cd "C:\Users\Luis Andrade\Documents\DesarrolloWeb\FrontEnd-aplicacion-web-full-stack-UISEK"
npm.cmd run dev
```

Después abrir:

```text
http://localhost:5173
```

---

## Estado del proyecto

- Frontend funcional.
- Login OAuth operativo.
- Rutas protegidas.
- CRUD completo.
- Navegación mediante React Router.
- Comunicación con Axios.
- Pósteres y fotografías habilitados.
- Interfaz desarrollada con Material UI.
- Compilación completada correctamente.
- Archivos sensibles excluidos de Git.

---

## Licencia

Proyecto desarrollado con fines exclusivamente académicos para la Universidad Internacional SEK.

© 2026 — Alberto Andrade y Sebastián Andrés Rubio Rivera