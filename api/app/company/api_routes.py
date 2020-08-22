from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity


from . import company_bp
from app.auth.models import User
from .models import Company, Offers, OffersTypes, OffersFeatures
from app.auth.schemas import ProfileUserSchema
from .schemas import ProfileCompanySchema


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


def __get_offers(cif):
	offers = Offers.get_all_by_cif(cif)
	result = []
	for offer in offers:
		offer_result = offer.to_dict()
		offer_type = OffersTypes.get_by_id(offer.offer_type)
		offer_result["rate"] = offer_type.rate
		offer_result["name"] = offer_type.name
		offer_features = OffersFeatures.get_all_by_offer_id(offer.id)
		offer_features_text = []
		for offer_feature in offer_features:
			offer_features_text.append(offer_feature.text)
		offer_result["features"] = offer_features_text
		result.append(offer_result)
	return result