from django.db import models


class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    horario_operativo = models.TimeField(help_text='Hora límite del horario operativo (ej: 10:30)')
    # Días a sumar según horario y tipo de inversión
    dias_dentro_horario = models.PositiveIntegerField(
        help_text='Días a sumar si la hora de creación es <= horario operativo'
    )
    dias_fuera_horario = models.PositiveIntegerField(
        help_text='Días a sumar si la hora de creación es > horario operativo'
    )
    dias_reinversion_dentro = models.PositiveIntegerField(
        help_text='Días a sumar en reinversión si la hora de creación es <= horario operativo'
    )
    dias_reinversion_fuera = models.PositiveIntegerField(
        help_text='Días a sumar en reinversión si la hora de creación es > horario operativo'
    )
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class DiaFeriado(models.Model):
    fecha = models.DateField(unique=True)
    descripcion = models.CharField(max_length=200)

    class Meta:
        verbose_name = 'Día Feriado'
        verbose_name_plural = 'Días Feriados'
        ordering = ['fecha']

    def __str__(self):
        return f'{self.descripcion} ({self.fecha})'
