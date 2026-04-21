from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Product, Holiday

admin.site.site_header = 'Alpha Inversiones — Administración'
admin.site.site_title = 'Alpha Inversiones'
admin.site.index_title = 'Panel de Administración'

# User admin is already registered by Django; we re-register to customize display
admin.site.unregister(User)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'name', 'operating_time',
        'days_on_time', 'days_late',
        'days_on_time_reinvestment', 'days_late_reinvestment',
        'is_active',
    )
    list_filter = ('is_active',)
    search_fields = ('name',)
    fieldsets = (
        ('Información General', {
            'fields': ('name', 'operating_time', 'is_active')
        }),
        ('Días a Sumar — Inversión Normal', {
            'fields': ('days_on_time', 'days_late'),
            'description': 'Días hábiles a sumar según si la hora de creación está dentro o fuera del horario operativo.'
        }),
        ('Días a Sumar — Reinversión', {
            'fields': ('days_on_time_reinvestment', 'days_late_reinvestment'),
            'description': 'Ídem para solicitudes de reinversión.'
        }),
    )


@admin.register(Holiday)
class HolidayAdmin(admin.ModelAdmin):
    list_display = ('date', 'description')
    search_fields = ('description',)
    list_filter = ('date',)
    date_hierarchy = 'date'
    ordering = ('date',)
