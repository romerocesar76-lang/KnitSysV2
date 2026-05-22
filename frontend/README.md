# KnitSys Frontend - React + Vite

Frontend moderno y responsivo para el sistema de gestión de contactos empresariales KnitSys.

## 🚀 Tecnologías

- **React 18** - UI library
- **Vite** - Build tool ultra-rápido
- **Axios** - Cliente HTTP
- **React Router** - Navegación (opcional)

## 📁 Estructura

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── pages/              # Páginas principales
│   ├── services/
│   │   └── api.js          # Configuración de Axios y servicios API
│   ├── App.jsx             # Componente principal
│   ├── App.css             # Estilos específicos de App
│   ├── index.css           # Estilos globales
│   └── main.jsx            # Punto de entrada
├── index.html
├── package.json
├── vite.config.js          # Configuración de Vite con proxy
└── README.md
```

## 🛠️ Desarrollo

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno (opcional)

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3001/api
```

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### 4. Proxy automático

Vite está configurado para redirigir las peticiones `/api` al backend en `http://localhost:3001`. Esto evita problemas de CORS durante el desarrollo.

## 🏗️ Build para producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`.

## 🌐 Deploy en Vercel

### Opción 1: Automático (recomendado)

1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa el repositorio
4. Configura las variables de entorno:
   - `VITE_API_URL`: URL de tu backend en producción
5. ¡Listo! Deploy automático en cada push

### Opción 2: Manual

```bash
npm run build
vercel --prod
```

## 📱 Módulos

### 1. Inicio (Home)
- Dashboard con estadísticas
- Accesos rápidos a funcionalidades principales
- Tarjetas con métricas clave

### 2. Empresas
- Listado de empresas con búsqueda
- Filtros por estado (activas/inactivas)
- CRUD completo de empresas
- Gestión de contactos por empresa

### 3. Contactos
- Listado de contactos
- Búsqueda y filtrado
- CRUD completo de contactos
- Gestión de emails y teléfonos múltiples

### 4. Configuración
- Ajustes del sistema
- Información de la base de datos
- Configuración de notificaciones

## 🎨 Estilos

El diseño es responsivo y accesible, con:
- Soporte completo para teclado (tabindex, focus visible)
- Contraste de colores WCAG AA
- Animaciones suaves
- Diseño mobile-first

## 🔗 Conexión con Backend

El servicio API (`src/services/api.js`) proporciona:

```javascript
import { empresaService, contactoService } from './services/api'

// Empresas
empresaService.getAll()           // Listar todas
empresaService.getById(id)        // Obtener por ID
empresaService.create(data)       // Crear
empresaService.update(id, data)   // Actualizar
empresaService.delete(id)         // Eliminar

// Contactos
contactoService.getAll()          // Listar todos
contactoService.getById(id)       // Obtener por ID
contactoService.create(data)      // Crear
contactoService.update(id, data)  // Actualizar
contactoService.delete(id)        // Eliminar
```

## 📝 Notas

- El frontend usa datos de ejemplo inicialmente
- Para conectar con el backend real, descomenta las llamadas API en los componentes
- Asegúrate de que el backend esté corriendo en `http://localhost:3001`
- En producción, configura `VITE_API_URL` con la URL de tu backend desplegado

## 🤝 Contribución

1. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
2. Commit cambios (`git commit -m 'Add nueva funcionalidad'`)
3. Push a la rama (`git push origin feature/nueva-funcionalidad`)
4. Abre un Pull Request

## 📄 Licencia

Propiedad de KnitSys - Todos los derechos reservados