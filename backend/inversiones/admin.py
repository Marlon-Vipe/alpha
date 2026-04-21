from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Producto, DiaFeriado

admin.site.unregister(User)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active']
    list_filter = ['is_staff', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'nombre', 'horario_operativo',
        'dias_dentro_horario', 'dias_fuera_horario',
        'dias_reinversion_dentro', 'dias_reinversion_fuera',
        'activo'
    ]
    list_filter = ['activo']
    search_fields = ['nombre']
    fieldsets = (
        (None, {
            'fields': ('nombre', 'horario_operativo', 'activo')
        }),
        ('Días a sumar (Inversión normal)', {
            'fields': ('dias_dentro_horario', 'dias_fuera_horario'),
            'description': 'Días hábiles a sumar según si la hora de creación es <= o > al horario operativo.'
        }),
        ('Días a sumar (Reinversión)', {
            'fields': ('dias_reinversion_dentro', 'dias_reinversion_fuera'),
            'description': 'Días hábiles a sumar en caso de reinversión.'
        }),
    )


@admin.register(DiaFeriado)
class DiaFeriadoAdmin(admin.ModelAdmin):
    list_display = ['fecha', 'descripcion']
    search_fields = ['descripcion']
    ordering = ['fecha']
    date_hierarchy = 'fecha'
