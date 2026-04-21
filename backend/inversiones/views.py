from datetime import datetime
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Producto
from .serializers import ProductoSerializer, CalcularFechasInputSerializer
from .services import calcular_fechas_inversion


class ProductoListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        productos = Producto.objects.filter(activo=True)
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)


class CalcularFechasView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CalcularFechasInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        producto = Producto.objects.get(id=data['producto'])
        fecha_creacion = data['fechaCreacion']

        fecha_inicio, fecha_fin, plazo_real = calcular_fechas_inversion(
            producto=producto,
            en_reinversion=data['enReinversion'],
            plazo=data['plazo'],
            fecha_creacion=fecha_creacion,
        )

        return Response({
            'producto': producto.id,
            'plazo': data['plazo'],
            'fechaInicio': datetime.combine(fecha_inicio, datetime.min.time()).strftime('%Y-%m-%d %H:%M:%S'),
            'fechaFin': datetime.combine(fecha_fin, datetime.min.time()).strftime('%Y-%m-%d %H:%M:%S'),
            'plazoReal': plazo_real,
        })
