from datetime import date, timedelta
from .models import DiaFeriado


def _get_feriados() -> set:
    return set(DiaFeriado.objects.values_list('fecha', flat=True))


def _es_dia_habil(d: date, feriados: set) -> bool:
    return d.weekday() < 5 and d not in feriados


def _siguiente_dia_habil(d: date, feriados: set) -> date:
    while not _es_dia_habil(d, feriados):
        d += timedelta(days=1)
    return d


def _agregar_dias_habiles(d: date, dias: int, feriados: set) -> date:
    """Suma N días hábiles a una fecha, saltando fines de semana y feriados."""
    contador = 0
    while contador < dias:
        d += timedelta(days=1)
        if _es_dia_habil(d, feriados):
            contador += 1
    return d


def calcular_fechas_inversion(producto, en_reinversion: bool, plazo: int, fecha_creacion):
    """
    Calcula fechaInicio, fechaFin y plazoReal de una inversión.

    - fechaInicio: fecha_creacion + N días hábiles del producto (según horario y tipo)
    - fechaFin:    fechaInicio + plazo días calendario, ajustado al siguiente día hábil
    - plazoReal:   diferencia en días calendario entre fechaFin y fechaInicio
    """
    feriados = _get_feriados()

    hora_creacion = fecha_creacion.time()
    hora_operativa = producto.horario_operativo

    if en_reinversion:
        if hora_creacion <= hora_operativa:
            dias_a_sumar = producto.dias_reinversion_dentro
        else:
            dias_a_sumar = producto.dias_reinversion_fuera
    else:
        if hora_creacion <= hora_operativa:
            dias_a_sumar = producto.dias_dentro_horario
        else:
            dias_a_sumar = producto.dias_fuera_horario

    fecha_base = fecha_creacion.date()
    fecha_inicio = _agregar_dias_habiles(fecha_base, dias_a_sumar, feriados)

    # Suma plazo en días calendario y ajusta al siguiente día hábil si cae en no laborable
    fecha_fin_raw = fecha_inicio + timedelta(days=plazo)
    fecha_fin = _siguiente_dia_habil(fecha_fin_raw, feriados)

    plazo_real = (fecha_fin - fecha_inicio).days

    return fecha_inicio, fecha_fin, plazo_real
