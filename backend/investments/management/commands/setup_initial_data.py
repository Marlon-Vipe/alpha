"""
Populates the database with:
  - Admin user  (admin / Admin1234!)
  - Test user   (inversor / Inversor1234!)
  - 1 product matching the document example (Product ID 1)
  - Dominican Republic public holidays 2022-2027
"""
from datetime import date, timedelta
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from investments.models import Holiday, Product


# ---------------------------------------------------------------------------
# Easter (Gregorian) — Gauss/Anonymous algorithm
# ---------------------------------------------------------------------------
def _easter(year: int) -> date:
    a = year % 19
    b = year // 100
    c = year % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = ((h + l - 7 * m + 114) % 31) + 1
    return date(year, month, day)


# DR transfer rule (Ley 139-97): if a transferable holiday falls on
# Tue/Wed/Thu → moved to preceding Monday; Sat/Sun → following Monday.
def _transfer(d: date) -> date:
    wd = d.weekday()  # 0=Mon … 6=Sun
    if wd == 1:
        return d - timedelta(days=1)
    if wd == 2:
        return d - timedelta(days=2)
    if wd == 3:
        return d - timedelta(days=3)
    if wd == 5:
        return d + timedelta(days=2)
    if wd == 6:
        return d + timedelta(days=1)
    return d


def _dr_holidays(year: int) -> list[tuple[date, str]]:
    easter = _easter(year)
    good_friday = easter - timedelta(days=2)
    corpus = easter + timedelta(days=60)

    holidays = [
        (date(year, 1, 1), 'Año Nuevo'),
        (_transfer(date(year, 1, 6)), 'Día de Reyes'),
        (date(year, 1, 21), 'Día de la Altagracia'),
        (_transfer(date(year, 1, 26)), 'Día de Duarte'),
        (date(year, 2, 27), 'Día de la Independencia'),
        (good_friday, 'Viernes Santo'),
        (date(year, 5, 1), 'Día del Trabajo'),
        (corpus, 'Corpus Christi'),
        (date(year, 8, 16), 'Día de la Restauración'),
        (date(year, 9, 24), 'Día de las Mercedes'),
        (_transfer(date(year, 11, 6)), 'Día de la Constitución'),
        (date(year, 12, 25), 'Navidad'),
    ]
    return holidays


class Command(BaseCommand):
    help = 'Seeds the database with initial data for testing'

    def handle(self, *args, **options):
        self._create_users()
        self._create_products()
        self._create_holidays()
        self.stdout.write(self.style.SUCCESS('Initial data loaded successfully.'))

    # ------------------------------------------------------------------
    def _create_users(self):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@alpha.com.do', 'Admin1234!')
            self.stdout.write('  Created superuser: admin / Admin1234!')
        else:
            self.stdout.write('  Superuser "admin" already exists, skipping.')

        if not User.objects.filter(username='inversor').exists():
            User.objects.create_user('inversor', 'inversor@alpha.com.do', 'Inversor1234!')
            self.stdout.write('  Created user: inversor / Inversor1234!')
        else:
            self.stdout.write('  User "inversor" already exists, skipping.')

    # ------------------------------------------------------------------
    def _create_products(self):
        defaults = {
            'operating_time': '10:30:00',
            'days_on_time': 2,
            'days_late': 3,
            'days_on_time_reinvestment': 1,
            'days_late_reinvestment': 2,
            'is_active': True,
        }
        product, created = Product.objects.get_or_create(
            id=1,
            defaults={'name': 'Certificado de Inversión', **defaults},
        )
        if created:
            self.stdout.write(f'  Created product: {product.name}')
        else:
            self.stdout.write(f'  Product "{product.name}" already exists, skipping.')

        p2_defaults = {
            'operating_time': '12:00:00',
            'days_on_time': 1,
            'days_late': 2,
            'days_on_time_reinvestment': 1,
            'days_late_reinvestment': 1,
            'is_active': True,
        }
        product2, created2 = Product.objects.get_or_create(
            name='Reporto',
            defaults=p2_defaults,
        )
        if created2:
            self.stdout.write(f'  Created product: {product2.name}')
        else:
            self.stdout.write(f'  Product "{product2.name}" already exists, skipping.')

    # ------------------------------------------------------------------
    def _create_holidays(self):
        created_count = 0
        for year in range(2022, 2028):
            for d, description in _dr_holidays(year):
                _, created = Holiday.objects.get_or_create(
                    date=d,
                    defaults={'description': f'{description} {year}'},
                )
                if created:
                    created_count += 1
        self.stdout.write(f'  Created {created_count} holiday records.')
