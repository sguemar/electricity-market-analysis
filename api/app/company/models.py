from sqlalchemy.dialects.mysql import TINYINT
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import func

from app import db

class Company(db.Model, SerializerMixin):

	__tablename__ = "companies"

	cif = db.Column(db.String(9), primary_key=True)
	name = db.Column(db.String(255), nullable=False)
	address = db.Column(db.String(255), nullable=False)
	url = db.Column(db.String(255))
	email = db.Column(db.String(255))
	company_type = db.Column(TINYINT(), nullable=False)
	phone = db.Column(db.Integer, nullable=False)
	user_id = db.Column(
		db.Integer,
		db.ForeignKey('users.id', ondelete='CASCADE'),
		nullable=False
	)

	def save(self):
		db.session.add(self)
		db.session.commit()

	@staticmethod
	def get_by_cif(cif):
		return Company.query.get(cif)

	@staticmethod
	def get_by_user_id(user_id):
		return Company.query.filter_by(user_id=user_id).first()

	@staticmethod
	def get_trading_company_by_name(name, name_unicode):
		search = "%{}%".format(name)
		search_unicode = "%{}%".format(name_unicode)
		return Company.query.filter(
			Company.name.like(search) | Company.name.like(search_unicode),
			Company.company_type == 0
		).first()

	@staticmethod
	def get_random_companies(amount):
		return Company.query.filter_by(company_type=0).order_by(func.random()).limit(amount).all()

	@staticmethod
	def get_all_trading_companies():
		return Company.query.filter_by(company_type=0).all()
		
	@staticmethod
	def get_all():
		return Company.query.all()


class Offer(db.Model, SerializerMixin):

	__tablename__ = "offers"

	id = db.Column(db.Integer, primary_key=True)
	offer_type = db.Column(db.Integer, nullable=False)
	fixed_term = db.Column(db.Float, nullable=False)
	variable_term = db.Column(db.Float)
	tip = db.Column(db.Float)
	valley = db.Column(db.Float)
	super_valley = db.Column(db.Float)
	cif = db.Column(
		db.String(9),
		db.ForeignKey('companies.cif', ondelete='CASCADE'),
		nullable=False
	)

	def delete(self):
		db.session.delete(self)
		db.session.commit()

	def save(self):
		db.session.add(self)
		db.session.commit()
		return self.id

	@staticmethod
	def get_by_id(id):
		return Offer.query.get(id)

	@staticmethod
	def get_all_by_cif(cif):
		return Offer.query.filter_by(cif=cif).all()

	@staticmethod
	def get_all():
		return Offer.query.all()


class OfferType(db.Model, SerializerMixin):

	__tablename__ = "offers_types"

	id = db.Column(db.Integer, primary_key=True)
	rate = db.Column(db.String(6), nullable=False)
	name = db.Column(db.String(255), nullable=False)

	def save(self):
		db.session.add(self)
		db.session.commit()

	@staticmethod
	def get_by_id(id):
		return OfferType.query.get(id)

	@staticmethod
	def get_all():
		return OfferType.query.all()


class OfferFeature(db.Model):

	__tablename__ = "offers_features"

	id = db.Column(db.Integer, primary_key=True)
	text = db.Column(db.String(255), nullable=False)
	offer_id = db.Column(
		db.Integer,
		db.ForeignKey('offers.id', ondelete='CASCADE'),
		nullable=False
	)

	def delete(self):
		db.session.delete(self)
		db.session.commit()

	def save(self):
		db.session.add(self)
		db.session.commit()

	@staticmethod
	def get_all_by_offer_id(offer_id):
		return OfferFeature.query.filter_by(offer_id=offer_id).all()
