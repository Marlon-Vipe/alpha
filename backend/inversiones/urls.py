from django.urls import path
from .views import ProductoListView, CalcularFechasView

urlpatterns = [
    path('productos/', ProductoListView.as_view(), name='productos-list'),
    path('inversiones/calcular/', CalcularFechasView.as_view(), name='calcular-fechas'),
]
