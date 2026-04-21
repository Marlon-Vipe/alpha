from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='Nombre')),
                ('operating_time', models.TimeField(
                    help_text='Hora límite del horario operativo (ej. 10:30)',
                    verbose_name='Hora operativa',
                )),
                ('days_on_time', models.PositiveIntegerField(
                    help_text='Días a sumar cuando la hora de creación es <= hora operativa',
                    verbose_name='Días (dentro de horario)',
                )),
                ('days_late', models.PositiveIntegerField(
                    help_text='Días a sumar cuando la hora de creación es > hora operativa',
                    verbose_name='Días (fuera de horario)',
                )),
                ('days_on_time_reinvestment', models.PositiveIntegerField(
                    help_text='Días a sumar en reinversión cuando la hora de creación es <= hora operativa',
                    verbose_name='Días reinversión (dentro de horario)',
                )),
                ('days_late_reinvestment', models.PositiveIntegerField(
                    help_text='Días a sumar en reinversión cuando la hora de creación es > hora operativa',
                    verbose_name='Días reinversión (fuera de horario)',
                )),
                ('is_active', models.BooleanField(default=True, verbose_name='Activo')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Producto',
                'verbose_name_plural': 'Productos',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Holiday',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(unique=True, verbose_name='Fecha')),
                ('description', models.CharField(max_length=200, verbose_name='Descripción')),
            ],
            options={
                'verbose_name': 'Día Feriado',
                'verbose_name_plural': 'Días Feriados',
                'ordering': ['date'],
            },
        ),
    ]
