from . import BaseTestClass

from app.auth.models import User
from app.customer.models import Customer
from app.company.models import Company

class AuthenticationTestCase(BaseTestClass):

    def test_login_without_credentials(self):
        res = self.client.post("/api/auth/login")
        self.assertEqual(400, res.status_code)
        self.assertIn(b'Missing JSON in request', res.data)

    def test_login_with_bad_credentials(self):
        res = self.client.post("/api/auth/login", json={"username": "test", "password": "test"})
        self.assertEqual(400, res.status_code)
        self.assertIn(b'User or password incorrect', res.data)

    def test_login_with_correct_credentials(self):
        res = self.client.post("/api/auth/login", json={"username": "test_username", "password": "test_password"})
        self.assertEqual(200, res.status_code)

    def test_customer_sign_up_without_data(self):
        with self.app.app_context():
            res = self.client.post("/api/auth/signup-customer")
            self.assertEqual(400, res.status_code)
            self.assertIn(b'Missing JSON in request', res.data)

    def test_customer_sign_up_fail_validation(self):
        with self.app.app_context():
            res = self.client.post("/api/auth/signup-customer", json={
                "username": "test1",
                "password": "12341234",
                "passwordconfirmation": "12341233",
                "name": "Juan",
                "surname": "Garrido",
                "nif": "12345678A",
                "email": "testemail@mail.com"
            })
            self.assertEqual(422, res.status_code)

    def test_customer_sign_up_correctly(self):
        with self.app.app_context():
            res = self.client.post("/api/auth/signup-customer", json={
                "username": "test1",
                "password": "12341234",
                "passwordconfirmation": "12341234",
                "name": "Juan",
                "surname": "Garrido",
                "nif": "12345678A",
                "email": "testemail@mail.com"
            })
            user = User.get_by_username("test1")
            customer = Customer.get_by_nif("12345678A")
            self.assertEqual(200, res.status_code)
            self.assertEqual("test1", user.username)
            self.assertEqual("12345678A", customer.nif)

    def test_company_sign_up_without_data(self):
        with self.app.app_context():
            res = self.client.post("/api/auth/signup-company")
            self.assertEqual(400, res.status_code)
            self.assertIn(b'Missing JSON in request', res.data)

    def test_company_sign_up_fail_validation(self):
        with self.app.app_context():
            res = self.client.post("/api/auth/signup-company", json={
                "username": "test1",
                "password": "12341234",
                "passwordconfirmation": "00000000",
                "name": "Iberdrola",
                "cif": "A12368224",
                "companytype": "0",
                "phone": "632541870",
                "email": "",
                "address": "Baleares",
                "url": ""
            })
            self.assertEqual(422, res.status_code)

    def test_company_sign_up_correctly(self):
        with self.app.app_context():
            res = self.client.post("/api/auth/signup-company", json={
                "username": "test1",
                "password": "12341234",
                "passwordconfirmation": "12341234",
                "name": "Iberdrola",
                "cif": "A12368224",
                "companytype": "0",
                "phone": "632541870",
                "email": "",
                "address": "Baleares",
                "url": ""
            })
            user = User.get_by_username("test1")
            company = Company.get_by_cif("A12368224")
            self.assertEqual(200, res.status_code)
            self.assertEqual("test1", user.username)
            self.assertEqual("A12368224", company.cif)


if __name__ == '__main__':
    unittest.main()