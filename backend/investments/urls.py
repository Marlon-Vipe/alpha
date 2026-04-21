from django.urls import path
from .views import ProductListView, InvestmentCalculateView

urlpatterns = [
    path('productos/', ProductListView.as_view(), name='product-list'),
    path('calcular/', InvestmentCalculateView.as_view(), name='investment-calculate'),
]
