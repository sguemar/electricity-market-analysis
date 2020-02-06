from flask import render_template, redirect, url_for
from flask_login import login_required, current_user

from . import customer_bp
from app.customer.models import Customer
from app.models import Customer_Dwelling_Contract, Contract, Invoice


@customer_bp.route('/my-bills', methods=["GET", "POST"])
@login_required
def my_bills():
	customer = None
	contracts = None
	contract_invoices = None
	if current_user.user_type == 1:
		customer = Customer.get_by_user_id(current_user.id)
		customers_dwellings_contracts = Customer_Dwelling_Contract.get_by_nif(customer.nif)
		contracts = []
		for customer_dwelling_contract in customers_dwellings_contracts:
			contracts.append(Contract.get_by_contract_number(customer_dwelling_contract.contract_number))
		contract_invoices = {}
		for contract in contracts:
			contract_invoices[contract] = Invoice.get_by_contract_number(contract.contract_number)
	return render_template("bills/my_bills.html", contracts=contracts, contract_invoices=contract_invoices)


@customer_bp.route('/my-bills/show-bill/<int:invoice_number>')
@login_required
def show_bill(invoice_number):
	invoice = Invoice.get_by_invoice_number(invoice_number)
	return render_template("bills/show_bill.html", invoice=invoice)


@customer_bp.route('/my-bills/delete/<int:invoice_number>')
@login_required
def delete_bill(invoice_number):
	invoice = Invoice.get_by_invoice_number(invoice_number)
	invoice.delete()
	return redirect(url_for('customer.my_bills'))