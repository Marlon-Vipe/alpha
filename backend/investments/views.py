from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Product
from .serializers import ProductSerializer, InvestmentInputSerializer
from .services import calculate_investment_dates


class ProductListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.filter(is_active=True)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class InvestmentCalculateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = InvestmentInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        product = Product.objects.get(id=data['producto'])

        fecha_inicio, fecha_fin, plazo_real = calculate_investment_dates(
            product=product,
            en_reinversion=data['enReinversion'],
            plazo=data['plazo'],
            fecha_creacion=data['fechaCreacion'],
        )

        result = {
            'producto': product.id,
            'plazo': data['plazo'],
            'fechaInicio': datetime.combine(fecha_inicio, datetime.min.time()),
            'fechaFin': datetime.combine(fecha_fin, datetime.min.time()),
            'plazoReal': plazo_real,
        }

        from .serializers import InvestmentResultSerializer
        out = InvestmentResultSerializer(result)
        return Response(out.data)
