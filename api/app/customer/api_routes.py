from flask import jsonify, json
from flask_jwt_extended import jwt_required, get_jwt_identity

from . import customer_bp
from .models import Customer
from app.auth.models import User
from app.models import Customer_Dwelling_Contract, Contract, Dwelling, Invoice

@customer_bp.route("/get-invoices-data", methods=["GET"])
@jwt_required
def get_invoices_data():
	logged_user = User.get_by_username(get_jwt_identity())
	logged_customer = Customer.get_by_user_id(logged_user.id)
	customers_dwellings_contracts = Customer_Dwelling_Contract.get_by_nif(logged_customer.nif)
	data = []
	for customer_dwelling_contract in customers_dwellings_contracts:
		contract_number = customer_dwelling_contract.contract_number
		contract = Contract.get_by_contract_number(contract_number).to_dict()
		dwelling = Dwelling.get_by_cups(customer_dwelling_contract.cups)
		contract["address"] = dwelling.address
		invoices = __get_invoices(contract_number)
		contract = {
			"contract_data": contract,
			"invoices": invoices
		}
		data.append(contract)
	return jsonify(data)


@customer_bp.route("/delete-invoice/<string:invoice_number>", methods=["DELETE"])
@jwt_required
def delete_invoice(invoice_number):
	invoice = Invoice.get_by_invoice_number(invoice_number)
	invoice.delete()
	return "", 200


def __get_invoices(contract_number):
	_invoices = Invoice.get_by_contract_number(contract_number)
	invoices = []
	for invoice in _invoices:
		invoices.append(invoice.to_dict())
	return invoices