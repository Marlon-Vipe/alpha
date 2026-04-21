from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200, verbose_name='Nombre')
    operating_time = models.TimeField(
        verbose_name='Hora operativa',
        help_text='Hora límite del horario operativo (ej. 10:30)'
    )
    days_on_time = models.PositiveIntegerField(
        verbose_name='Días (dentro de horario)',
        help_text='Días a sumar cuando la hora de creación es <= hora operativa'
    )
    days_late = models.PositiveIntegerField(
        verbose_name='Días (fuera de horario)',
        help_text='Días a sumar cuando la hora de creación es > hora operativa'
    )
    days_on_time_reinvestment = models.PositiveIntegerField(
        verbose_name='Días reinversión (dentro de horario)',
        help_text='Días a sumar en reinversión cuando la hora de creación es <= hora operativa'
    )
    days_late_reinvestment = models.PositiveIntegerField(
        verbose_name='Días reinversión (fuera de horario)',
        help_text='Días a sumar en reinversión cuando la hora de creación es > hora operativa'
    )
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['name']

    def __str__(self):
        return self.name


class Holiday(models.Model):
    date = models.DateField(unique=True, verbose_name='Fecha')
    description = models.CharField(max_length=200, verbose_name='Descripción')

    class Meta:
        verbose_name = 'Día Feriado'
        verbose_name_plural = 'Días Feriados'
        ordering = ['date']

    def __str__(self):
        return f"{self.date} — {self.description}"
