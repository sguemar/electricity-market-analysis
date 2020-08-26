from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity


from . import company_bp
from app.auth.models import User
from .models import Company, Offer, OfferType, OfferFeature
from app.models import Contract, Customer_Dwelling_Contract, Potential_Customer_Notification
from app.customer.models import Customer
from app.auth.schemas import ProfileUserSchema
from .schemas import (
	ProfileCompanySchema,
	GeneralOfferSchema,
	HourlyOfferSchema,
	SuperValleyOfferSchema,
	OfferFeaturesSchema
)

@company_bp.route("/get-profile-data")
@jwt_required
def get_profile_data():
	logged_user = User.get_by_username(get_jwt_identity())
	logged_company = Company.get_by_user_id(logged_user.id)
	return {
		"name": logged_company.name,
		"address": logged_company.address,
		"url": logged_company.url,
		"email": logged_company.email,
		"phone": logged_company.phone
	}


@company_bp.route("/update-profile", methods=["PUT"])
@jwt_required
def update_profile():
	if not request.is_json:
		return "Missing JSON in request", 400
	data = request.get_json()
	data['phone'] = str(data['phone'])
	errors = {}
	if data['password'] or data['passwordconfirmation']:
		if data["password"] != data["passwordconfirmation"]:
			errors["passwordconfirmation"] = ["Las contraseñas no coinciden"]
		errors.update(validateUser(data))
	errors.update(validateCompany(data))
	if errors:
		return errors, 422
	user = User.get_by_username(get_jwt_identity())
	company = Company.get_by_user_id(user.id)
	if data['password']:
		user.set_password(data['password'])
	user.save()
	company.name = data['name']
	company.address = data['address']
	company.url = data['url']
	company.email = data['email']
	company.phone = int(data['phone'])
	company.save()
	return "", 200


@company_bp.route("/delete-account", methods=["DELETE"])
@jwt_required
def delete_account():
	logged_user = User.get_by_username(get_jwt_identity())
	logged_user.delete()
	return "", 200


@company_bp.route("/get-offers")
@jwt_required
def get_offers():
	logged_user = User.get_by_username(get_jwt_identity())
	logged_company = Company.get_by_user_id(logged_user.id)
	offers = __get_offers(logged_company.cif)
	return jsonify(offers)

@company_bp.route("/get-offers-types")
@jwt_required
def get_offers_types():
	offers_types = OfferType.get_all()
	return jsonify(__get_offers_types(offers_types))


@company_bp.route("/create-offer", methods=["POST"])
@jwt_required
def create_offer():
	if not request.is_json:
		return "Missing JSON in request", 400
	offer_data = request.get_json()
	errors = {}
	errors.update(validateOffer(offer_data))
	errors.update(validateFeatures(offer_data))
	if errors:
		return errors, 422
	offer_rate = int(offer_data["offerRate"])	
	logged_user = User.get_by_username(get_jwt_identity())
	logged_company = Company.get_by_user_id(logged_user.id)
	if offer_rate % 3 == 1:
		offer = Offer(
			offer_type=offer_rate,
			fixed_term=offer_data["fixedTerm"],
			variable_term=offer_data["variableTerm"],
			tip=0,
			valley=0,
			super_valley=0,
			cif=logged_company.cif
		)
	elif offer_rate % 3 == 2:
		offer = Offer(
			offer_type=offer_rate,
			fixed_term=offer_data["fixedTerm"],
			variable_term=0,
			tip=offer_data["tip"],
			valley=offer_data["valley"],
			super_valley=0,
			cif=logged_company.cif
		)
	else:
		offer = Offer(
			offer_type=offer_rate,
			fixed_term=offer_data["fixedTerm"],
			variable_term=0,
			tip=offer_data["tip"],
			valley=offer_data["valley"],
			super_valley=offer_data["superValley"],
			cif=logged_company.cif
		)
	offer_id = offer.save()
	if offer_data["characteristic1"]:
		offer_feature = OfferFeature(
			text=offer_data["characteristic1"],
			offer_id=offer_id
		)
		offer_feature.save()
	if offer_data["characteristic2"]:
		offer_feature = OfferFeature(
			text=offer_data["characteristic2"],
			offer_id=offer_id
		)
		offer_feature.save()
	if offer_data["characteristic3"]:
		offer_feature = OfferFeature(
			text=offer_data["characteristic3"],
			offer_id=offer_id
		)
		offer_feature.save()
	return "", 200


@company_bp.route("/get-offer-data/<int:offer_id>")
@jwt_required
def get_offer_data(offer_id):
	offer = Offer.get_by_id(offer_id)
	offer_features = OfferFeature.get_all_by_offer_id(offer_id)
	characteristics = ["", "", ""]
	for i, offer_feature in enumerate(offer_features):
		characteristics[i] = offer_feature.text
	return {
		"offerRate": offer.offer_type,
		"fixedTerm": offer.fixed_term,
		"variableTerm": offer.variable_term,
		"tip": offer.tip,
		"valley": offer.valley,
		"superValley": offer.super_valley,
		"characteristic1": characteristics[0],
		"characteristic2": characteristics[1],
		"characteristic3": characteristics[2],
	}


@company_bp.route("/edit-offer/<int:offer_id>", methods=["PUT"])
@jwt_required
def edit_offer(offer_id):
	if not request.is_json:
		return "Missing JSON in request", 400
	offer_data = request.get_json()
	errors = {}
	errors.update(validateOffer(offer_data))
	errors.update(validateFeatures(offer_data))
	if errors:
		return errors, 422
	offer = Offer.get_by_id(offer_id)
	offer_features = OfferFeature.get_all_by_offer_id(offer_id)
	for offer_feature in offer_features:
		offer_feature.delete()
	offer_rate = int(offer_data["offerRate"])
	if offer_rate % 3 == 1:
		offer.offer_type = offer_rate,
		offer.fixed_term = offer_data["fixedTerm"],
		offer.variable_term = offer_data["variableTerm"],
		offer.tip = 0,
		offer.valley = 0,
		offer.super_valley = 0,
	elif offer_rate % 3 == 2:
		offer.offer_type = offer_rate,
		offer.fixed_term = offer_data["fixedTerm"],
		offer.variable_term = 0,
		offer.tip = offer_data["tip"],
		offer.valley = offer_data["valley"],
		offer.super_valley = 0,
	else:
		offer.offer_type = offer_rate,
		offer.fixed_term = offer_data["fixedTerm"],
		offer.variable_term = 0,
		offer.tip = offer_data["tip"],
		offer.valley = offer_data["valley"],
		offer.super_valley = offer_data["superValley"],
	offer.save()
	if offer_data["characteristic1"]:
		offer_feature = OfferFeature(
			text=offer_data["characteristic1"],
			offer_id=offer_id
		)
		offer_feature.save()
	if offer_data["characteristic2"]:
		offer_feature = OfferFeature(
			text=offer_data["characteristic2"],
			offer_id=offer_id
		)
		offer_feature.save()
	if offer_data["characteristic3"]:
		offer_feature = OfferFeature(
			text=offer_data["characteristic3"],
			offer_id=offer_id
		)
		offer_feature.save()
	return "", 200


@company_bp.route("/delete-offer/<int:offer_id>", methods=["DELETE"])
@jwt_required
def delete_offer(offer_id):
	Offer.get_by_id(offer_id).delete()
	return "", 200


@company_bp.route("/get-customers")
@jwt_required
def get_customers():
	logged_user = User.get_by_username(get_jwt_identity())
	logged_company = Company.get_by_user_id(logged_user.id)
	contracts = Contract.get_all_by_cif(logged_company.cif)
	customers = {}
	for contract in contracts:
		c_d_c = Customer_Dwelling_Contract.get_by_contract_number(contract.contract_number)
		if c_d_c.nif not in customers:
			customers[c_d_c.nif] = Customer.get_by_nif(c_d_c.nif).to_dict()
	result = []
	for customer in customers.values():
		if not customer["email"]:
			customer["email"] = "-"
		result.append({
			"name": customer["name"],
			"surname": customer["surname"],
			"nif": customer["nif"],
			"email": customer["email"],
		})
	return jsonify(result), 200


@company_bp.route("/get-potentials-customers-notifications-count")
@jwt_required
def get_potentials_customers_notifications_count():
	logged_user = User.get_by_username(get_jwt_identity())
	logged_company = Company.get_by_user_id(logged_user.id)
	return str(len(Potential_Customer_Notification.get_all_by_cif(logged_company.cif)))


@company_bp.route("/get-potentials-customers")
@jwt_required
def get_potentials_customers():
	logged_user = User.get_by_username(get_jwt_identity())
	logged_company = Company.get_by_user_id(logged_user.id)
	p_c_ns = Potential_Customer_Notification.get_all_by_cif(logged_company.cif)
	customers = []
	for p_c_n in p_c_ns:
		customer = Customer.get_by_nif(p_c_n.nif)
		customer_email = customer.email
		if not customer.email:
			customer_email = "-"
		customers.append({
			"name": customer.name,
			"surname": customer.surname,
			"nif": customer.nif,
			"email": customer_email,
		})
	return jsonify(customers)


def validateUser(data):
	user = {
		"password": data["password"],
		"passwordconfirmation": data["passwordconfirmation"]
	}
	user = {k: v for k, v in user.items() if v}
	return ProfileUserSchema().validate(user)


def validateCompany(data):
	company = {
		"name": data["name"],
		"address": data["address"],
		"url": data["url"],
		"email": data["email"],
		"phone": data["phone"],
	}
	company = {k: v for k, v in company.items() if v}
	return ProfileCompanySchema().validate(company)


def validateOffer(data):
	offer_rate = int(data["offerRate"]) 
	if offer_rate % 3 == 1:
		offer = {
			"fixedTerm": data["fixedTerm"],
			"variableTerm": data["variableTerm"],
		}
		offer = {k: v for k, v in offer.items() if v}
		return GeneralOfferSchema().validate(offer)
	elif offer_rate % 3 == 2:
		offer = {
			"fixedTerm": data["fixedTerm"],
			"tip": data["tip"],
			"valley": data["valley"],
		}
		offer = {k: v for k, v in offer.items() if v}
		return HourlyOfferSchema().validate(offer)
	else:
		offer = {
			"fixedTerm": data["fixedTerm"],
			"tip": data["tip"],
			"valley": data["valley"],
			"superValley": data["superValley"],
		}
		offer = {k: v for k, v in offer.items() if v}
		return SuperValleyOfferSchema().validate(offer)


def validateFeatures(data):
	offer_features = {
		"characteristic1": data["characteristic1"],
		"characteristic2": data["characteristic2"],
		"characteristic3": data["characteristic3"],
	}
	offer_features = {k: v for k, v in offer_features.items() if v}
	return OfferFeaturesSchema().validate(offer_features)

def __get_offers(cif):
	offers = Offer.get_all_by_cif(cif)
	result = []
	for offer in offers:
		offer_result = offer.to_dict()
		offer_type = OfferType.get_by_id(offer.offer_type)
		offer_result["rate"] = offer_type.rate
		offer_result["name"] = offer_type.name
		offer_features = OfferFeature.get_all_by_offer_id(offer.id)
		offer_features_text = []
		for offer_feature in offer_features:
			offer_features_text.append(offer_feature.text)
		offer_result["features"] = offer_features_text
		result.append(offer_result)
	return result


def __get_offers_types(offers_types):
	result = []
	for offer_type in offers_types:
		result.append(offer_type.to_dict())
	return result