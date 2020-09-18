from . import BaseTestClass

from app.auth.models import User
from app.customer.models import Customer
from app.company.models import Company

class AuthenticationTestCase(BaseTestClass):

    def test_public_get_all_trading_companies(self):
        res = self.client.get("/api/public/get-all-trading-companies")
        self.assertEqual(200, res.status_code)

    def test_public_can_access_all_companies_info(self):
        res = self.client.get("/api/public/get-all-companies")
        self.assertEqual(200, res.status_code)

    def test_public_can_access_historical_prices(self):
        res = self.client.get("/api/public/get-historical-prices")
        self.assertEqual(200, res.status_code)

if __name__ == '__main__':
    unittest.main()