#!/bin/sh
set -e

echo "Esperando a PostgreSQL..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.5
done
echo "PostgreSQL listo."

python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py loaddata fixtures/initial_data.json || true
python manage.py collectstatic --noinput

# Crear superusuario si no existe
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@alpha.com.do', 'admin123')
    print('Superusuario creado: admin / admin123')
else:
    print('Superusuario ya existe.')
"

exec "$@"
