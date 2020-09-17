import unittest

from werkzeug.test import Client
from app import create_app, db
from app.auth.models import User
from app.customer.models import Customer


class BaseTestClass(unittest.TestCase):

    def setUp(self):
        self.app = create_app(settings_module="config.testing")
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()
            BaseTestClass.create_customer(
                "test_username",
                "test_password",
                "test_name",
                "test_surname",
                "test_nif",
                "test_email"
            )

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    @staticmethod
    def create_customer(username, password, name, surname, nif, email):
        user = User(username=username, user_type=1)
        user.set_password(password)
        user.save()
        customer = Customer()
        customer = Customer(
            nif=nif,
            name=name,
            surname=surname,
            email=email,
            user_id=1
        )
        customer.save()

    def login(self, username, password):
        return self.client.post('/api/auth/login', data=dict(
            username=username,
            password=password
        ), follow_redirects=True)
