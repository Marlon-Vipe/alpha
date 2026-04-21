from datetime import date, timedelta
from .models import Holiday


def _get_holidays(start: date, end: date) -> set:
    return set(Holiday.objects.filter(date__range=[start, end]).values_list('date', flat=True))


def _is_business_day(d: date, holidays: set) -> bool:
    return d.weekday() < 5 and d not in holidays


def _next_business_day(d: date, holidays: set) -> date:
    while not _is_business_day(d, holidays):
        d += timedelta(days=1)
    return d


def _add_business_days(d: date, n: int, holidays: set) -> date:
    """Add n business days to d, starting to count from the day after d."""
    if n == 0:
        return _next_business_day(d, holidays)
    current = d
    count = 0
    while count < n:
        current += timedelta(days=1)
        if _is_business_day(current, holidays):
            count += 1
    return current


def calculate_investment_dates(product, en_reinversion: bool, plazo: int, fecha_creacion):
    """
    Returns (fecha_inicio, fecha_fin, plazo_real).

    fecha_inicio  = fecha_creacion.date() + N business days
                    where N depends on product config, operating time, and reinversion flag.
    fecha_fin     = fecha_inicio + plazo calendar days, advanced to next business day if needed.
    plazo_real    = (fecha_fin - fecha_inicio).days  (calendar difference).
    """
    creation_time = fecha_creacion.time()
    operating_time = product.operating_time
    creation_date = fecha_creacion.date()

    within_hours = creation_time <= operating_time

    if en_reinversion:
        offset = product.days_on_time_reinvestment if within_hours else product.days_late_reinvestment
    else:
        offset = product.days_on_time if within_hours else product.days_late

    # Fetch holidays for the full possible range up front (single DB query)
    end_range = creation_date + timedelta(days=plazo + 120)
    holidays = _get_holidays(creation_date, end_range)

    fecha_inicio = _add_business_days(creation_date, offset, holidays)
    raw_end = fecha_inicio + timedelta(days=plazo)
    fecha_fin = _next_business_day(raw_end, holidays)
    plazo_real = (fecha_fin - fecha_inicio).days

    return fecha_inicio, fecha_fin, plazo_real
