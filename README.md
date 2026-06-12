# 🏆 Mundialito — Guía de Despliegue en Netlify

Quiniela del Mundial 2026 con autenticación, predicciones, ranking global y grupos de amigos.

---

## Stack

- **Frontend**: React 18 + Vite + React Router
- **Backend / DB / Auth**: Supabase (gratis)
- **Deploy**: Netlify (gratis)
- **Fuentes**: Bebas Neue + Inter (Google Fonts)

---

## Paso 1 — Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratis.
2. Haz clic en **New project**.
3. Elige un nombre (ej: `mundialito`) y una contraseña segura para la base de datos.
4. Espera ~2 minutos a que el proyecto se inicialice.

---

## Paso 2 — Configurar la base de datos

1. En tu proyecto Supabase, ve a **SQL Editor** (menú izquierdo).
2. Crea una nueva consulta y pega todo el contenido del archivo `supabase-schema.sql`.
3. Haz clic en **Run** (▶).
4. Verifica que no haya errores — deberías ver tablas creadas exitosamente.

---

## Paso 3 — Obtener credenciales de Supabase

1. Ve a **Settings → API** en tu proyecto.
2. Copia:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon / public key**: el key largo que empieza con `eyJ...`

---

## Paso 4 — Configurar variables de entorno localmente

Crea un archivo `.env` en la raíz del proyecto:

```
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...tu-key-aqui
```

---

## Paso 5 — Probar localmente (opcional)

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` y verifica que funcione.

---

## Paso 6 — Subir a GitHub

```bash
git init
git add .
git commit -m "feat: mundialito inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/mundialito.git
git push -u origin main
```

---

## Paso 7 — Desplegar en Netlify

### Opción A: Drag & Drop (más rápido)

1. Corre `npm run build` — genera la carpeta `dist/`.
2. Ve a [app.netlify.com](https://app.netlify.com).
3. Arrastra la carpeta `dist/` al área de deploy.
4. Ve a **Site settings → Environment variables** y agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Vuelve a hacer deploy para que tome las variables.

### Opción B: Conectar con GitHub (recomendado para actualizaciones)

1. Ve a [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Conecta tu cuenta de GitHub y selecciona el repo `mundialito`.
3. Configuración de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. En **Environment variables**, agrega:
   - `VITE_SUPABASE_URL` = tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu anon key
5. Haz clic en **Deploy site**.

---

## Paso 8 — Configurar dominio personalizado (opcional)

En **Site settings → Domain management** puedes agregar tu propio dominio o usar el subdominio gratis de Netlify (`mundialito.netlify.app`).

---

## ¿Cómo ingresar resultados reales?

Cuando se jueguen los partidos, ingresa los resultados directamente en Supabase:

1. Ve a **Table Editor → match_results**.
2. Inserta filas con `match_id` (ej: `G1`, `G2`...) y los goles de cada equipo.
3. El ranking se actualiza automáticamente.

Los `match_id` de la fase de grupos siguen el formato `G1` a `G72`. Los de eliminatorias: `R32-1` a `R32-16`, `R16-1` a `R16-8`, `QF-1` a `QF-4`, `SF-1`, `SF-2`, `TP-1`, `F-1`.

---

## Sistema de puntos

| Resultado | Puntos |
|-----------|--------|
| Marcador exacto (ej: predices 2-1 y fue 2-1) | **6 pts** |
| Resultado correcto (ej: predices 3-0 y fue 1-0) | **3 pts** |
| Incorrecto | **0 pts** |

---

## Estructura del proyecto

```
mundialito/
├── src/
│   ├── components/
│   │   ├── AuthContext.jsx    # Proveedor de autenticación
│   │   └── Navbar.jsx         # Navegación
│   ├── lib/
│   │   ├── supabase.js        # Cliente + helpers de Supabase
│   │   └── matches.js         # Datos de los 104 partidos
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── Login.jsx          # Inicio de sesión
│   │   ├── Signup.jsx         # Registro
│   │   ├── Predictions.jsx    # ⚽ Predicciones (core)
│   │   ├── Ranking.jsx        # 🏆 Ranking global
│   │   └── Groups.jsx         # 👥 Grupos de amigos
│   ├── App.jsx                # Router principal
│   ├── main.jsx               # Entry point
│   └── index.css              # Estilos globales
├── supabase-schema.sql        # Schema de la base de datos
├── netlify.toml               # Config de Netlify
├── vite.config.js
├── .env.example
└── package.json
```

---

## Preguntas frecuentes

**¿Cuánto cuesta?**
Nada. Supabase Free tier permite 50,000 usuarios y 500MB de storage. Netlify Free permite 100GB de bandwidth/mes.

**¿Puedo cambiar los equipos o partidos?**
Sí, edita `src/lib/matches.js`. Los grupos y los partidos son arrays que puedes modificar fácilmente.

**¿Puedo agregar más idiomas?**
El sitio está en español. Para agregar inglés u otro idioma, considera usar `react-i18next`.

**¿Se puede habilitar login con Google?**
Sí. En Supabase ve a **Authentication → Providers → Google** y actívalo. Luego agrega un botón en Login.jsx usando `supabase.auth.signInWithOAuth({ provider: 'google' })`.
