from app import db


class Customer(db.Model):

	__tablename__ = "customers"

	nif = db.Column(db.String(9), primary_key=True)
	name = db.Column(db.String(255), nullable=False)
	surname = db.Column(db.String(255), nullable=False)
	email = db.Column(db.String(255))
	user_id = db.Column(
		db.Integer,
		db.ForeignKey('users.id', ondelete='CASCADE'),
		nullable=False
	)

	def save(self):
		db.session.add(self)
		db.session.commit()

	@staticmethod
	def get_by_nif(nif):
		return Customer.query.get(nif)

	@staticmethod
	def get_by_user_id(user_id):
		return Customer.query.filter_by(user_id=user_id).first()
