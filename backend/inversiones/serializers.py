from rest_framework import serializers
from .models import Producto


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'horario_operativo']


class CalcularFechasInputSerializer(serializers.Serializer):
    producto = serializers.IntegerField()
    enReinversion = serializers.BooleanField()
    plazo = serializers.IntegerField(min_value=1)
    fechaCreacion = serializers.DateTimeField()

    def validate_producto(self, value):
        if not Producto.objects.filter(id=value, activo=True).exists():
            raise serializers.ValidationError('Producto no encontrado o inactivo.')
        return value


class CalcularFechasOutputSerializer(serializers.Serializer):
    producto = serializers.IntegerField()
    plazo = serializers.IntegerField()
    fechaInicio = serializers.DateTimeField()
    fechaFin = serializers.DateTimeField()
    plazoReal = serializers.IntegerField()
