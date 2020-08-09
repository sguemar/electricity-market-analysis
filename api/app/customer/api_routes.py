from flask import jsonify, json, request, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.exceptions import BadRequestKeyError
from sqlalchemy.exc import IntegrityError

import uuid, os, unidecode, dateparser, random, string, datetime

from . import customer_bp, docreco
from .models import Customer
from app.auth.models import User
from app.models import (
	Customer_Dwelling_Contract,
	Contract,
	Dwelling,
	Invoice,
	Company
)


ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])


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
	contract = Contract.get_by_contract_number(invoice.contract_number)
	invoices = __get_invoices(contract.contract_number)
	if len(invoices) == 0:
		logged_user = User.get_by_username(get_jwt_identity())
		logged_customer = Customer.get_by_user_id(logged_user.id)
		nif = logged_customer.nif
		cus_dwe_con = Customer_Dwelling_Contract \
			.get_by_nif_and_contract_number(
				nif,
				invoice.contract_number
			)
		cus_dwe_con.delete()
		contract.delete()
	return "", 200


@customer_bp.route("/add-invoice", methods=["POST"])
@jwt_required
def process_bill():
	try:
		file = request.files["file"]
	except BadRequestKeyError:
		return {
			"message": "No se ha seleccionado ningún archivo",
			"type": "error"
		}, 200

	if not __allowed_file(file.filename):
		return {
			"message": "Los tipos de fichero permitidos son txt, pdf, png, jpg, jpeg, gif",
			"type": "error"
		}, 200

	# save file to upload directory with a hash code
	file_extension = file.filename.rsplit(".", 1)[1].lower()
	filename = str(uuid.uuid4()) + "." + file_extension

	bill_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
	file.save(bill_path)

	# information extraction from the bill
	results = docreco.process_bill(bill_path, file_extension)

	# Delete the bill uploaded
	os.remove(bill_path)

	contract_number = __get_first_value(
		results["Datos del contrato"]["ReferenciaContrato"]
	).split('/')[0].split('-')[0].split(' ')[0]

	if contract_number:
		contract = Contract.get_by_contract_number(contract_number)
		if not contract:
			cif = __get_first_value(results["Datos de la factura"]["CIF"])
			if cif:
				trading_company = Company.get_by_cif(cif)
				if not trading_company:
					return {
						"message": "No se encuentra la comercializadora",
						"type": "error"
					}, 200
			else:
				company_name = __get_first_value(results["Datos de la factura"]["Comercializadora"])
				if company_name:
					trading_company = Company.get_trading_company_by_name(
						company_name,
						unidecode.unidecode(company_name)
					)
					if trading_company:
						cif = trading_company.cif
					else:
						return {
							"message": "No se encuentra la comercializadora ni el cif en la factura",
							"type": "error"
						}, 200
				else:
						return {
							"message": "No se encuentra el nombre de la comercializadora en la factura",
							"type": "error"
						}, 200					
			contract_data = __get_contract_data(results)
			contract = Contract(
				contract_number=contract_number,
				contracted_power=contract_data["contracted_power"],
				toll_access=contract_data["toll_access"],
				end_date=contract_data["end_date"],
				CNAE=contract_data["CNAE"],
				tariff_access=contract_data["tariff_access"],
				cif=cif
			)
			contract.save()
	else:
		return {
			"message": "No se encuentra el número de referencia del contrato",
			"type": "error"
		}, 200
	invoice_data = __get_invoice_data(results, contract_number)

	invoice = Invoice(
		invoice_number=invoice_data["invoice_number"],
		contracted_power_amount=invoice_data["contracted_power_amount"],
		consumed_energy_amount=invoice_data["consumed_energy_amount"],
		issue_date=invoice_data["issue_date"],
		charge_date=invoice_data["charge_date"],
		init_date=invoice_data["init_date"],
		end_date=invoice_data["end_date"],
		total_amount=invoice_data["total_amount"],
		contract_reference=invoice_data["contract_reference"],
		contract_number=invoice_data["contract_number"],
		document=file.read()
	)

	try:
		invoice.save()
	except IntegrityError:
		return {
			"message": "Esta factura ya está registrada",
			"type": "error"
		}, 200

	cups = __get_first_value(results["Datos del contrato"]["CUPS"])

	if cups:
		if not Dwelling.get_by_cups(cups):
			__create_dwelling_with_cups(results, cups)
	else:
		cups = __create_dwelling_with_random_cups(results)

	logged_user = User.get_by_username(get_jwt_identity())
	logged_customer = Customer.get_by_user_id(logged_user.id)
	nif = logged_customer.nif

	if not Customer_Dwelling_Contract.get_by_nif_and_contract_number(nif, contract_number):
		customer_dwelling_contract = Customer_Dwelling_Contract(
			nif=nif,
			cups=cups,
			contract_number=contract_number
		)
		try:
			customer_dwelling_contract.save()
		except IntegrityError:
			pass
	return {
		"message": "La factura se ha guardado con éxito",
		"type": "success"
	}, 200


@customer_bp.route("/get-consumption-data")
@jwt_required
def get_consumption_data():
	customer = None
	contracts = None
	contract_invoices = None
	logged_user = User.get_by_username(get_jwt_identity())
	if logged_user.user_type == 1:
		logged_customer = Customer.get_by_user_id(logged_user.id)
		customers_dwellings_contracts = Customer_Dwelling_Contract.get_by_nif(logged_customer.nif)
		contracts = []
		for customer_dwelling_contract in customers_dwellings_contracts:
			contracts.append(Contract.get_by_contract_number(customer_dwelling_contract.contract_number))
		contract_invoices = {}
		for contract in contracts:
			invoices = Invoice.get_by_contract_number(contract.contract_number)
			for invoice in invoices:
				year = int(invoice.init_date.strftime("%Y"))
				if year in contract_invoices:
					total_amounts_list = contract_invoices[year]
				else:
					total_amounts_list = [0 for _ in range(12)]
				month = int(invoice.init_date.strftime("%m")) - 1
				total_amounts_list[month] = round(invoice.total_amount, 2)	
				contract_invoices[year] = total_amounts_list
	else:
		return "No tienes permiso", 403
	return contract_invoices


def __allowed_file(filename):
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def __get_contract_data(results):
	contract = {}
	
	contracted_power = __get_first_value(results["Datos del contrato"]["PotenciaContratada"]).replace(',', '.')
	if contracted_power: 
		contract["contracted_power"] = float(contracted_power)
	else:
		contract["contracted_power"] = None

	contract["toll_access"] = __get_first_value(results["Datos del contrato"]["PeajeAcceso"])
	contract["end_date"] = __get_format_date(results["Datos del contrato"]["FinContrato"])
	contract["CNAE"] = __get_first_value(results["Datos del contrato"]["CNAE"])
	contract["tariff_access"] = __get_first_value(results["Datos del contrato"]["TarifaAcceso"])
	
	return contract


def __get_invoice_data(results, contract_number):
	invoice = {}

	invoice["invoice_number"] = __get_first_value(results["Datos de la factura"]["NumeroFactura"])

	contracted_power_amount = __get_first_value(results["Importes"]["ImportePotenciaContratada"]).replace(',', '.')
	if contracted_power_amount: 
		invoice["contracted_power_amount"] = float(contracted_power_amount)
	else:
		invoice["contracted_power_amount"] = None
	
	consumed_energy_amount = __get_first_value(results["Importes"]["ImporteEnergiaConsumida"]).replace(',', '.')
	if consumed_energy_amount: 
		invoice["consumed_energy_amount"] = float(consumed_energy_amount)
	else:
		invoice["consumed_energy_amount"] = None
	
	invoice["issue_date"] = __get_format_date(results["Datos de la factura"]["FechaEmision"])
	invoice["charge_date"] = __get_format_date(results["Datos de la factura"]["FechaCargo"])
	invoice["init_date"] = __get_format_date(results["Datos de la factura"]["FechaInicio"])
	invoice["end_date"] = __get_format_date(results["Datos de la factura"]["FechaFin"])

	# If issue date is empty, new issue date is end date plus three days
	if not invoice["issue_date"] and invoice["end_date"]:
		split_end_date = invoice["end_date"].split("-")
		invoice["issue_date"] = str(
			datetime.datetime(int(split_end_date[0]), int(split_end_date[1]), int(split_end_date[2])) + 
			datetime.timedelta(days=3)
		)

	total_amount = __get_first_value(results["Importes"]["ImporteTotal"]).replace(',', '.')
	if total_amount: 
		invoice["total_amount"] = float(total_amount)
	else:
		invoice["total_amount"] = None
	
	invoice["contract_reference"] = __get_first_value(results["Datos del contrato"]["ReferenciaContrato"])
	invoice["contract_number"] = contract_number 

	return invoice


def __create_dwelling_with_cups(results, cups):
	dwelling = Dwelling(
		cups=cups,
		address=__get_first_value(results["Datos del cliente"]["Direccion"]),
		meter_box_number=__get_first_value(results["Datos del contrato"]["NumeroContador"])
	)
	dwelling.save()


def __create_dwelling_with_random_cups(results):
	cups = 'ES' + str(random.randint(10**15, 10**16-1))
	cups += ''.join(random.choice(string.ascii_uppercase) for _ in range(4))
	dwelling = Dwelling(
		cups=cups,
		address=__get_first_value(results["Datos del cliente"]["Direccion"]),
		meter_box_number=__get_first_value(results["Datos del contrato"]["NumeroContador"])
	)
	dwelling.save()
	return cups


def __get_first_value(data):
	return "" if len(data) == 0 else data[0]


def __get_format_date(dates):
	for date in dates:
		try:
			return dateparser.parse(date).strftime('%Y-%m-%d')
		except AttributeError:
			pass
	return None


def __get_invoices(contract_number):
	_invoices = Invoice.get_by_contract_number(contract_number)
	invoices = []
	for invoice in _invoices:
		invoices.append(invoice.to_dict())
	return invoices