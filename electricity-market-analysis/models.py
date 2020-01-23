from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.mysql import TINYINT

from . import db


class User(db.Model, UserMixin):
	
	__tablename__ = "users"

	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(255), nullable=False, unique=True)
	password = db.Column(db.String(255), nullable=False)
	user_type = db.Column(TINYINT(), nullable=False)

	def set_password(self, password):
		self.password = generate_password_hash(password)

	def check_password(self, password):
		return check_password_hash(self.password, password)

	def save(self):
		if not self.id:
			db.session.add(self)
		db.session.commit()

	@staticmethod
	def get_by_id(id):
		return User.query.get(id)

	@staticmethod
	def get_by_username(username):
		return User.query.filter_by(username=username).first()

	def __repr__(self):
		return '<User {} type {}>'.format(self.username, self.type)


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