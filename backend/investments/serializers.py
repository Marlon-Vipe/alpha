from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'operating_time']


class InvestmentInputSerializer(serializers.Serializer):
    producto = serializers.IntegerField()
    enReinversion = serializers.BooleanField()
    plazo = serializers.IntegerField(min_value=1)
    fechaCreacion = serializers.DateTimeField(
        input_formats=['%Y-%m-%d %H:%M:%S', '%Y-%m-%dT%H:%M:%S', '%Y-%m-%dT%H:%M'],
        format='%Y-%m-%d %H:%M:%S',
    )

    def validate_producto(self, value):
        if not Product.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError('Producto no encontrado o no disponible.')
        return value


class InvestmentResultSerializer(serializers.Serializer):
    producto = serializers.IntegerField()
    plazo = serializers.IntegerField()
    fechaInicio = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    fechaFin = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    plazoReal = serializers.IntegerField()
