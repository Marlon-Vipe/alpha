# Alpha Inversiones — Calculadora de Fechas

Aplicación fullstack para calcular fechas de inicio y fin de inversiones financieras, considerando días hábiles y feriados de República Dominicana.

## Stack

| Capa       | Tecnología                          |
|------------|-------------------------------------|
| Backend    | Django 4.2 + Django REST Framework  |
| Auth       | JWT (djangorestframework-simplejwt) |
| Base de datos | PostgreSQL 15                    |
| Frontend   | React 18 + TypeScript               |
| Contenedores | Docker + docker-compose           |

---

## Levantar con Docker (recomendado)

### Prerequisitos
- Docker Desktop instalado y corriendo

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd alpha-inversiones

# 2. Levantar todos los servicios
docker-compose up --build
```

Los servicios quedan disponibles en:

| Servicio        | URL                          |
|----------------|-------------------------------|
| Frontend        | http://localhost:3000         |
| API Backend     | http://localhost:8000/api/    |
| Django Admin    | http://localhost:8000/admin/  |

### Credenciales por defecto

| Usuario | Contraseña |
|---------|-----------|
| admin   | admin123  |

---

## Levantar en local (sin Docker)

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno (opcional, hay defaults)
# Crear .env con:
# DB_HOST=localhost
# DB_USER=postgres
# DB_PASSWORD=postgres

# Migraciones y datos iniciales
python manage.py migrate
python manage.py loaddata fixtures/initial_data.json
python manage.py createsuperuser

# Correr servidor
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

---

## API Endpoints

### Autenticación

```http
POST /api/auth/token/
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Listar productos

```http
GET /api/productos/
Authorization: Bearer <access_token>
```

### Calcular fechas de inversión

```http
POST /api/inversiones/calcular/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "producto": 1,
  "enReinversion": false,
  "plazo": 33,
  "fechaCreacion": "2022-07-12 09:00:00"
}
```

**Respuesta:**

```json
{
  "producto": 1,
  "plazo": 33,
  "fechaInicio": "2022-07-14 00:00:00",
  "fechaFin": "2022-08-17 00:00:00",
  "plazoReal": 34
}
```

---

## Lógica de Cálculo

1. **fechaInicio** = `fechaCreacion` + N días **hábiles** del producto  
   (N depende del horario operativo y si es reinversión)

2. **fechaFin** = `fechaInicio` + `plazo` días **calendario**  
   → Si cae en fin de semana o feriado, se mueve al siguiente día hábil

3. **plazoReal** = diferencia en días calendario entre `fechaFin` y `fechaInicio`

---

## Django Admin

Accede a `http://localhost:8000/admin/` con las credenciales de administrador para gestionar:

- **Usuarios** — crear y administrar usuarios del sistema
- **Productos** — configurar productos con sus 4 parámetros de días
- **Días Feriados** — registrar feriados de República Dominicana

### Datos de prueba precargados

El fixture `initial_data.json` incluye:
- **Producto Demo** (ID 1): configuración del ejemplo de la prueba técnica
- **Renta Fija** (ID 2): producto adicional de muestra
- Feriados de RD para 2022–2025

---

## Estructura del Proyecto

```
alpha-inversiones/
├── backend/
│   ├── config/          # Configuración Django
│   ├── inversiones/     # App principal
│   │   ├── models.py    # Producto, DiaFeriado
│   │   ├── services.py  # Lógica de cálculo de fechas
│   │   ├── views.py     # API endpoints
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── fixtures/        # Datos iniciales
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/       # Login, Calculator
│   │   ├── services/    # auth.ts, api.ts
│   │   └── types/       # Interfaces TypeScript
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```
