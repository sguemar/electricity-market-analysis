from . import BaseTestClass

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



if __name__ == '__main__':
    unittest.main()