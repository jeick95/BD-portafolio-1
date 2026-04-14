# Sistema de Gestión de Proyectos - Desarrollo de Aplicaciones

Sistema web con autenticación, roles de usuario y gestión de archivos.

## Características

- **Autenticación de usuarios** con Supabase
- **2 roles**: Admin y Usuario General
- **Dashboard de administración** (solo para admins)
- **Gestión de archivos** (subir, editar, eliminar - solo admins)
- **Perfil de usuario** editable
- **Diseño moderno** con animaciones

## Cuenta Admin

- **Email**: `t01256d@ms.upla.edu.pe`
- **Contraseña**: `12345@cuenta`

## Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia las credenciales de **Settings > API**:
   - Project URL
   - anon public key

### 2. Configurar la aplicación

Hay dos opciones:

#### Opción A: Usar la página de configuración
1. Abre `setup.html` en tu navegador
2. Ingresa la URL y clave de Supabase
3. Haz clic en "Probar Conexión"
4. Si funciona, haz clic en "Guardar y Continuar"

#### Opción B: Editar directamente
1. Abre `js/config.js`
2. Reemplaza los valores:
```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-clave-anonima';
```

### 3. Ejecutar SQL en Supabase

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Copia y pega el contenido de `supabase-setup.sql`
3. Ejecuta el script

## Estructura de la Base de Datos

### Tablas

- **perfiles**: Información de usuarios
- **archivos**: Archivos subidos
- **actividades**: Logs de actividad

### Buckets de Storage

- **archivos**: Para almacenar archivos subidos
- **avatars**: Para avatares de usuarios

## Permisos por Rol

### Admin
- ✅ Subir archivos
- ✅ Editar archivos
- ✅ Eliminar archivos
- ✅ Ver dashboard
- ✅ Gestionar usuarios
- ✅ Editar su perfil

### Usuario General
- ✅ Ver todas las páginas
- ✅ Ver archivos
- ❌ No puede subir/editar/eliminar archivos
- ❌ No puede ver el dashboard
- ✅ Editar su perfil

## Archivos del Proyecto

```
├── index.html          # Página principal
├── login.html          # Iniciar sesión
├── register.html       # Registro de usuarios
├── profile.html        # Perfil de usuario
├── dashboard.html      # Panel de admin
├── setup.html          # Configuración de conexión
├── proyecto.html       # Proyectos del curso
├── git.html            # Guía de Git
├── github-manual.html  # Manual de GitHub
├── about.html          # Sobre mí
├── js/
│   ├── config.js       # Configuración de Supabase
│   └── auth.js         # Funciones de autenticación
├── supabase-setup.sql  # Script SQL
└── README.md           # Este archivo
```

## Cómo usar

### Para usuarios generales
1. Regístrate en `register.html`
2. Inicia sesión con tus credenciales
3. Explora todas las páginas del sitio

### Para administradores
1. Inicia sesión con la cuenta admin
2. Accede al Dashboard desde la barra de navegación
3. Gestiona archivos y usuarios

## Notas Importantes

- Los usuarios que se registren con el email `t01256d@ms.upla.edu.pe` automáticamente serán admins
- Los demás usuarios serán "usuario" por defecto
- Los archivos se almacenan en Supabase Storage
- La conexión se puede probar desde `setup.html`

## Tecnologías Usadas

- HTML5 / CSS3
- JavaScript (ES6+)
- Supabase (Auth + Database + Storage)
- Font Awesome (iconos)
- SweetAlert2 (notificaciones)
- Google Fonts (tipografía)
