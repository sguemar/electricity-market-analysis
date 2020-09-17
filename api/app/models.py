from sqlalchemy_serializer import SerializerMixin

from . import db


class Contract(db.Model, SerializerMixin):

	__tablename__ = "contracts"

	contract_number = db.Column(db.String(255), primary_key=True)
	contracted_power = db.Column(db.Float)
	toll_access = db.Column(db.String(255))
	init_date = db.Column(db.DateTime)
	end_date = db.Column(db.DateTime)
	CNAE = db.Column(db.String(10))
	tariff_access = db.Column(db.String(255))
	description = db.Column(db.Text())
	conditions = db.Column(db.Text())
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
	def get_by_contract_number(contract_number):
		return Contract.query.get(contract_number)

	@staticmethod
	def get_all_by_cif(cif):
		return Contract.query.filter_by(cif=cif).all()

	def __repr__(self):
		return 'Contrato {}, fecha de inicio: {}, fecha de fin {}'.format(
			self.contract_number,
			self.init_date,
			self.end_date
		)


class Invoice(db.Model, SerializerMixin):

	__tablename__ = "invoices"

	invoice_number = db.Column(db.String(255), primary_key=True)
	contracted_power_amount = db.Column(db.Float)
	consumed_energy_amount = db.Column(db.Float)
	consumed_energy = db.Column(db.Float)
	issue_date = db.Column(db.DateTime)
	charge_date = db.Column(db.DateTime)
	init_date = db.Column(db.DateTime)
	end_date = db.Column(db.DateTime)
	total_amount = db.Column(db.Float)
	tax = db.Column(db.Float)
	tax_amount = db.Column(db.Float)
	contract_reference = db.Column(db.String(255))
	contract_number = db.Column(
		db.String(255),
		db.ForeignKey('contracts.contract_number', ondelete='CASCADE')
	)
	document = db.Column(db.LargeBinary)

	def delete(self):
		db.session.delete(self)
		db.session.commit()
		
	def save(self):
		db.session.add(self)
		db.session.commit()

	@staticmethod
	def get_by_invoice_number(invoice_number):
		return Invoice.query.get(invoice_number)

	@staticmethod
	def get_by_contract_number(contract_number):
		return Invoice.query.filter_by(contract_number=contract_number).order_by(Invoice.init_date).all()

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
	address = db.Column(db.String(255))
	postal_code = db.Column(db.String(5))
	meter_box_number = db.Column(db.String(255))
	population = db.Column(db.String(255))
	province = db.Column(db.String(255))

	def save(self):
		db.session.add(self)
		db.session.commit()

	@staticmethod
	def get_by_cups(cups):
		return Dwelling.query.get(cups)


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
		db.String(255),
		db.ForeignKey('contracts.contract_number', ondelete='CASCADE'),
	 	primary_key=True
	)
	init_date = db.Column(db.DateTime)
	end_date = db.Column(db.DateTime)

	def delete(self):
		db.session.delete(self)
		db.session.commit()

	def save(self):
		db.session.add(self)
		db.session.commit()

	@staticmethod
	def get_by_nif(nif):
		return Customer_Dwelling_Contract.query.filter_by(
			nif=nif
		).all()

	@staticmethod
	def get_by_contract_number(contract_number):
		return Customer_Dwelling_Contract.query.filter_by(
			contract_number=contract_number
		).first()

	@staticmethod
	def get_by_nif_and_contract_number(nif, contract_number):
		return Customer_Dwelling_Contract.query.filter_by(
			nif=nif,
			contract_number=contract_number
		).first()


class Potential_Customer_Notification(db.Model):

	__tablename__ = "potentials_customers_notifications"

	id = db.Column(db.Integer, primary_key=True)
	nif = db.Column(
		db.String(9),
		db.ForeignKey('customers.nif', ondelete='CASCADE'),
		nullable=False
	)
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
	def get_all_by_cif(cif):
		return Potential_Customer_Notification.query.filter_by(cif=cif).all()

	@staticmethod
	def get_by_cif_and_nif(cif, nif):
		return Potential_Customer_Notification.query.filter_by(cif=cif, nif=nif).first()


class Offer_Notification(db.Model):

	__tablename__ = "offers_notifications"

	id = db.Column(db.Integer, primary_key=True)
	nif = db.Column(
		db.String(9),
		db.ForeignKey('customers.nif', ondelete='CASCADE'),
		nullable=False
	)
	cif = db.Column(
		db.String(9),
		db.ForeignKey('companies.cif'),
	)
	offer_id = db.Column(
		db.Integer,
		db.ForeignKey('offers.id'),
	)

	def delete(self):
		db.session.delete(self)
		db.session.commit()

	def save(self):
		db.session.add(self)
		db.session.commit()

	@staticmethod
	def get_by_nif_cif_offer_id(nif, cif, offer_id):
		return Offer_Notification.query.filter_by(nif=nif, cif=cif, offer_id=offer_id).first()

	@staticmethod
	def get_all_by_nif(nif):
		return Offer_Notification.query.filter_by(nif=nif).all()