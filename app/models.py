from sqlalchemy.dialects.mysql import TINYINT

from . import db


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


class Contract(db.Model):

	__tablename__ = "contracts"

	contract_number = db.Column(db.Integer, primary_key=True)
	contracted_power = db.Column(db.Float, nullable=True)
	toll_access = db.Column(db.String(255), nullable=True)
	init_date = db.Column(db.DateTime, nullable=False)
	end_date = db.Column(db.DateTime, nullable=False)
	CNAE = db.Column(db.String(10), nullable=False)
	tariff_access = db.Column(db.String(255), nullable=True)
	contract_reference = db.Column(db.String(255), nullable=False)
	description = db.Column(db.Text(), nullable=True)
	conditions = db.Column(db.Text(), nullable=True)
	cif = db.Column(
		db.String(255),
		db.ForeignKey('company.cif', ondelete='CASCADE'),
		nullable=False
	)

	@staticmethod
	def get_by_contract_number(contract_number):
		return Contract.query.get(contract_number)

	def __repr__(self):
		return 'Contrato {}, fecha de inicio: {}, fecha de fin {}'.format(
			self.contract_number,
			self.init_date,
			self.end_date
		)


class Invoice(db.Model):

	__tablename__ = "invoices"

	invoice_number = db.Column(db.Integer, primary_key=True)
	contracted_power_amount = db.Column(db.Float, nullable=False)
	consumed_energy_amount = db.Column(db.Float, nullable=False)
	issue_date = db.Column(db.DateTime, nullable=False)
	charge_date = db.Column(db.DateTime, nullable=False)
	init_date = db.Column(db.DateTime, nullable=False)
	end_date = db.Column(db.DateTime, nullable=False)
	total_amount = db.Column(db.Float, nullable=False)
	tax = db.Column(db.Float, nullable=False)
	contract_number = db.Column(
		db.Integer,
		db.ForeignKey('contracts.contract_number', ondelete='CASCADE'),
		nullable=False
	)

	def delete(self):
		db.session.delete(self)
		db.session.commit()

	@staticmethod
	def get_by_invoice_number(invoice_number):
		return Invoice.query.get(invoice_number)

	@staticmethod
	def get_by_contract_number(contract_number):
		return Invoice.query.filter_by(contract_number=contract_number).all()

	def __repr__(self):
		return 'Factura {}, fecha de inicio: {}, fecha de fin {}, cantidad_total: {}'.format(
			self.invoice_number,
			self.init_date,
			self.end_date,
			self.total_amount
		)


class Dwelling(db.Model):

	__tablename__ = "dwellings"

	cups = db.Column(db.String(22), primary_key=True)
	address = db.Column(db.String(255), nullable=False)
	postal_code = db.Column(db.String(5), nullable=False)
	meter_box_number = db.Column(db.String(255), nullable=False)
	population = db.Column(db.String(255), nullable=False)
	province = db.Column(db.String(255), nullable=False)


class Customer_Dwelling_Contract(db.Model):

	__tablename__ = "customer_dwelling_contract"

	nif = db.Column(
		db.String(9),
		db.ForeignKey('customers.nif', ondelete='CASCADE'),
		primary_key=True
	)
	cups = db.Column(
		db.String(22),
		db.ForeignKey('dwellings.cups', ondelete='CASCADE'),
		primary_key=True
	)
	contract_number = db.Column(
		db.Integer(),
		db.ForeignKey('contracts.contract_number', ondelete='CASCADE'),
	 	primary_key=True
	)
	init_date = db.Column(db.DateTime, nullable=False)
	end_date = db.Column(db.DateTime, nullable=False)

	@staticmethod
	def get_by_nif(nif):
		return Customer_Dwelling_Contract.query.filter_by(nif=nif).all()
