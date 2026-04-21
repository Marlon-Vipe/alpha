import time
from django.db import connections
from django.db.utils import OperationalError
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Waits until the database is available'

    def handle(self, *args, **options):
        self.stdout.write('Waiting for database...')
        db_conn = None
        attempts = 0
        while not db_conn:
            try:
                db_conn = connections['default']
                db_conn.ensure_connection()
            except OperationalError:
                attempts += 1
                self.stdout.write(f'  Database unavailable, retrying... (attempt {attempts})')
                time.sleep(1)
        self.stdout.write(self.style.SUCCESS('Database ready.'))
