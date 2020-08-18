from sqlalchemy.dialects.mysql import TINYINT

from app import db

class Company(db.Model):

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
