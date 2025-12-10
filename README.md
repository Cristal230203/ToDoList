# ToDo App - Full Stack (Frontend + Backend)

## 📋 Estructura del Proyecto

```
ToDoList/
├── frontend/                  (React + Vite + Tailwind)
│   ├── src/
│   │   ├── pages/            (Login, Register, TodoList)
│   │   ├── components/       (TodoItem)
│   │   ├── context/          (Auth, Toast, Theme providers)
│   │   ├── App.jsx           (Router principal)
│   │   ├── main.jsx          (Entrada)
│   │   └── index.css         (Tailwind)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── ToDo-App-Backend/          (Express + MongoDB)
    ├── server.js
    ├── .env                   (Variables de entorno)
    ├── config/
    │   └── database.js        (Conexión MongoDB)
    ├── middleware/
    │   └── auth.js            (JWT)
    ├── models/
    │   ├── usuario.js
    │   └── tareas.js
    └── routes/
        ├── auth.js            (Login/Register)
        └── todos.js           (CRUD tareas)
```

## 🚀 Instalación y Arranque (Guía Completa)

### Backend

1. **Instalar dependencias:**
   ```bash
   cd ToDo-App-Backend
   npm install
   ```

2. **Configurar variables de entorno (`.env`):**
   - El archivo `.env` ya existe con valores por defecto.
   - Si necesitas cambiar MongoDB URI o JWT_SECRET, edita `ToDo-App-Backend/.env`.
   - **Asegúrate de tener MongoDB corriendo** (localmente o en la nube):
     ```bash
     # Si usas MongoDB local:
     mongod
     ```

3. **Arrancar el servidor backend:**
   ```bash
   npm start
   # o con nodemon para desarrollo:
   npx nodemon server.js
   ```
   Debería ver: `🚀 Servidor corriendo en puerto 5000`

### Frontend

1. **Limpiar e instalar dependencias:**
   ```bash
   cd frontend
   rm -r node_modules package-lock.json  # Limpiar si hay conflictos previos
   npm install
   ```

2. **Configurar variables de entorno (`.env`):**
   - El archivo `.env` ya apunta a `http://localhost:5000/api`.
   - Si el backend está en otro puerto, edita `frontend/.env`.

3. **Arrancar el dev server:**
   ```bash
   npm run dev
   ```
   Abrirá automáticamente `http://localhost:5173` (o el puerto que Vite asigne).

## 📝 Flujo de Uso

1. **Ir a http://localhost:5173**
2. **Registrarse** o **iniciar sesión** con credenciales.
3. **Crear, editar, completar y eliminar tareas**.

## 🔑 Credenciales de Prueba

Si tienes MongoDB con datos preexistentes, úsalos. De lo contrario, crea una cuenta nueva en la pantalla de Registro.

## 🛠 Tecnologías

### Frontend
- React 18
- Vite (fast bundler)
- React Router (navegación)
- Tailwind CSS (estilos)
- Heroicons (iconos)

### Backend
- Express.js
- MongoDB + Mongoose
- JWT (autenticación)
- bcryptjs (hashing de contraseñas)
- CORS (peticiones fronend-backend)

## 📦 Scripts Disponibles

### Frontend
```bash
npm run dev       # Inicia dev server (Vite)
npm run build     # Build para producción
npm run preview   # Visualizar build local
```

### Backend
```bash
npm start         # Inicia servidor
npx nodemon server.js  # Inicia con auto-reload
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'database'"
- Asegúrate de que `config/database.js` exista (no `bd.js`).

### Error: "MONGODB_URI not defined"
- Verifica que `ToDo-App-Backend/.env` tenga `MONGODB_URI=...`.
- MongoDB debe estar corriendo.

### Error: "CORS" en frontend
- El backend permite CORS, pero verifica que `http://localhost:5000` sea accesible.

### Tailwind no se aplica
- Asegúrate de ejecutar `npm install` después de cambios en `package.json`.
- Vite debe procesar los archivos `.css`.

## 📄 Notas Importantes

- **Autenticación**: usa JWT almacenado en `localStorage`. Cada solicitud al backend incluye el token en el header `Authorization: Bearer <token>`.
- **Tareas**: cada usuario ve solo sus propias tareas (filtradas por `userId` en el backend).
- **Tema**: el tema (dark/light) se persiste en `localStorage`.

## 🎨 Personalización

Colores principales (en `tailwind.config.js`):
- Primario: `#F0D9B5` (beige dorado)
- Secundario: `#E8C79E` (beige claro)
- Acento: `#F1AAA9` (rosa suave)
- Dark: `#1a1825` (fondo oscuro)

Edita `tailwind.config.js` o los valores de color directamente en los componentes.

## 🔐 Seguridad

- **Contraseñas**: hasheadas con bcryptjs en el backend.
- **JWT**: expira en 7 días (configurable en `routes/authrutas.js`).
- **Variables secretas**: nunca comitees `.env` a git (ya está en `.gitignore`).

---

¡Disfruta tu ToDo App! 🎉
