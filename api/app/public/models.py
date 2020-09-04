from app import db

class TradingCompanyPrices(db.Model):

	__tablename__ = "trading_company_prices"

	id = db.Column(db.Integer, primary_key=True)
	year = db.Column(db.Integer)
	price = db.Column(db.Float)
	cif = db.Column(
		db.String(9),
		db.ForeignKey('companies.cif'),
	)

	def delete(self):
		db.session.delete(self)
		db.session.commit()

	def save(self):
		db.session.add(self)
		db.session.commit()

	@staticmethod
	def get_all():
		return TradingCompanyPrices.query.all()