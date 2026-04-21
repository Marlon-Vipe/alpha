# Alpha Inversiones — Calculadora de Fechas de Inversión

API y aplicación web para calcular las fechas de inicio y fin de inversiones en el mercado de valores.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3.11, Django 4.2, Django REST Framework, SimpleJWT |
| Base de datos | PostgreSQL 15 |
| Frontend | React 18, TypeScript, Vite |
| Despliegue | Docker + docker-compose |

---

## Levantar con Docker (recomendado)

### Prerrequisitos
- Docker Desktop (o Docker Engine + Compose v2)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd alpha-inversiones

# 2. Levantar todos los servicios
docker compose up --build
```

Al iniciar, el backend automáticamente:
1. Espera que PostgreSQL esté listo.
2. Ejecuta las migraciones.
3. Carga datos iniciales (usuarios, producto de ejemplo, feriados RD 2022–2027).
4. Levanta el servidor con Gunicorn.

| Servicio | URL |
|---------|-----|
| Frontend (React) | http://localhost:3000 |
| Backend API | http://localhost:8000/api/ |
| Django Admin | http://localhost:8000/admin/ |

---

## Credenciales de prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `Admin1234!` | Superusuario (acceso al admin) |
| `inversor` | `Inversor1234!` | Usuario de API |

---

## Levantar en local (sin Docker)

### Backend

```bash
cd backend

# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate        # Linux / Mac
# venv\Scripts\activate         # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con los datos de tu PostgreSQL local

# Migraciones y datos iniciales
python manage.py migrate
python manage.py setup_initial_data

# Iniciar servidor
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abrir http://localhost:5173 en el navegador. El proxy de Vite redirige `/api` hacia `http://localhost:8000`.

---

## Endpoints del API

### Autenticación

```
POST /api/token/
Body: { "username": "...", "password": "..." }
Response: { "access": "<jwt>", "refresh": "<jwt>" }

POST /api/token/refresh/
Body: { "refresh": "<jwt>" }
Response: { "access": "<jwt>" }
```

### Recursos protegidos (requieren `Authorization: Bearer <access_token>`)

```
GET  /api/productos/         → Lista de productos disponibles
POST /api/calcular/          → Cálculo de fechas de inversión
```

#### Ejemplo de cálculo

```json
// Request
POST /api/calcular/
{
  "producto": 1,
  "enReinversion": false,
  "plazo": 33,
  "fechaCreacion": "2022-07-12 09:00:00"
}

// Response
{
  "producto": 1,
  "plazo": 33,
  "fechaInicio": "2022-07-14 00:00:00",
  "fechaFin": "2022-08-17 00:00:00",
  "plazoReal": 34
}
```

---

## Lógica de cálculo

### Fecha Inicio
Se obtiene sumando **N días hábiles** a `fechaCreacion`. El valor de N depende del producto:

| Condición | Días |
|-----------|------|
| Hora creación ≤ hora operativa, no reinversión | `days_on_time` |
| Hora creación > hora operativa, no reinversión | `days_late` |
| Hora creación ≤ hora operativa, reinversión | `days_on_time_reinvestment` |
| Hora creación > hora operativa, reinversión | `days_late_reinvestment` |

### Fecha Fin
Se suman los **días de plazo (calendario)** a `fechaInicio`. Si el resultado cae en fin de semana o feriado, se avanza al próximo día hábil.

### Plazo Real
Diferencia en días calendario entre `fechaFin` y `fechaInicio`.

### Días hábiles
No se contabilizan sábados, domingos ni los días feriados cargados en la base de datos. Los feriados se gestionan desde el **Django Admin → Días Feriados**.

---

## Django Admin

Acceder a http://localhost:8000/admin/ con el usuario `admin`.

Desde el panel se puede gestionar:
- **Usuarios** — crear, editar y desactivar usuarios del sistema.
- **Productos** — configurar los productos con sus días de corte y hora operativa.
- **Días Feriados** — registrar los feriados nacionales que se excluyen del cálculo.

---

## Variables de entorno (backend)

| Variable | Descripción | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Clave secreta de Django | valor de desarrollo |
| `DEBUG` | Modo debug | `True` |
| `ALLOWED_HOSTS` | Hosts permitidos (separados por coma) | `*` |
| `DB_NAME` | Nombre de la base de datos | `alpha_inversiones` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `postgres` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `CORS_ALLOWED_ORIGINS` | Orígenes CORS permitidos | `http://localhost:3000` |
