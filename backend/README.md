# KnitSys Backend API

API REST para el sistema de gestión KnitSys, construida con Node.js, Express y MySQL (TiDB Cloud).

## 📋 Características

- **CRUD completo** para Empresas y Contactos
- **Relaciones N:M** entre empresas y contactos
- **Gestión de emails y teléfonos** múltiples por contacto
- **Soft delete** para preservar el historial
- **Paginación y búsqueda** en listados
- **Conexión a TiDB Cloud** con pool de conexiones
- **CORS configurado** para frontend en Vercel

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` como `.env` y completa con tus datos de TiDB Cloud:

```bash
cp .env.example .env
```

Edita `.env` con:
- Tus credenciales de TiDB Cloud (host, usuario, password, database)
- El puerto del servidor
- La URL de tu frontend (para CORS)

### 3. Iniciar el servidor

**Desarrollo** (con auto-reload):
```bash
npm run dev
```

**Producción**:
```bash
npm start
```

## 📡 Endpoints de la API

### Empresas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/empresas` | Listar empresas (paginado) |
| GET | `/api/empresas/:id` | Obtener empresa por ID |
| GET | `/api/empresas/:id/contactos` | Contactos de una empresa |
| POST | `/api/empresas` | Crear nueva empresa |
| PUT | `/api/empresas/:id` | Actualizar empresa |
| PATCH | `/api/empresas/:id/activo` | Activar/desactivar |
| DELETE | `/api/empresas/:id` | Eliminar empresa (soft delete) |
| POST | `/api/empresas/:id/contactos` | Vincular contacto |
| DELETE | `/api/empresas/:id/contactos/:contactoId` | Desvincular contacto |

### Contactos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/contactos` | Listar contactos (paginado) |
| GET | `/api/contactos/:id` | Obtener contacto con detalles |
| POST | `/api/contactos` | Crear nuevo contacto |
| PUT | `/api/contactos/:id` | Actualizar contacto |
| PATCH | `/api/contactos/:id/activo` | Activar/desactivar |
| DELETE | `/api/contactos/:id` | Eliminar contacto |
| POST | `/api/contactos/:id/emails` | Agregar email |
| DELETE | `/api/contactos/:id/emails/:emailId` | Eliminar email |
| POST | `/api/contactos/:id/telefonos` | Agregar teléfono |
| DELETE | `/api/contactos/:id/telefonos/:telefonoId` | Eliminar teléfono |

## 🔍 Parámetros de Búsqueda

### Listar Empresas
```
GET /api/empresas?page=1&limit=20&search=textiles&activo=true
```

- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 20)
- `search`: Buscar por nombre, CUIT o actividad
- `activo`: Filtrar por estado (true/false)

### Listar Contactos
```
GET /api/contactos?page=1&limit=20&search=gomez&tipoContactoId=1
```

- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 20)
- `search`: Buscar por nombre o apellido
- `tipoContactoId`: Filtrar por tipo (Cliente, Proveedor, etc.)
- `activo`: Filtrar por estado

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configuración de TiDB Cloud
│   ├── models/
│   │   ├── Empresa.js        # Modelo de Empresas
│   │   └── Contacto.js       # Modelo de Contactos
│   ├── controllers/
│   │   ├── empresaController.js
│   │   └── contactoController.js
│   └── routes/
│       └── index.js          # Definición de rutas
├── .env.example              # Ejemplo de variables
├── .gitignore
├── package.json
├── server.js                 # Punto de entrada
└── README.md
```

## 🌐 Deploy en Render

1. Conecta tu repositorio de GitHub a Render
2. Configura las variables de entorno en el dashboard
3. El deploy es automático en cada push a main

**Variables de entorno necesarias:**
- `TIDB_HOST`
- `TIDB_PORT`
- `TIDB_USER`
- `TIDB_PASSWORD`
- `TIDB_DATABASE`
- `TIDB_SSL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `NODE_ENV=production`

## 🔒 Seguridad

⚠️ **Importante**: Actualmente todas las rutas son públicas. Antes de producción:

1. Implementar autenticación JWT
2. Agregar middleware de autorización
3. Validar y sanitizar todos los inputs
4. Configurar rate limiting
5. Usar HTTPS en producción

## 🛠️ Tecnologías

- **Node.js** - Runtime
- **Express** - Framework web
- **MySQL2** - Driver de base de datos
- **CORS** - Middleware de CORS
- **Dotenv** - Variables de entorno

## 📝 Licencia

MIT - KnitSys