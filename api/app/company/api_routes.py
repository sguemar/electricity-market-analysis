from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity


from . import company_bp
from app.auth.models import User
from .models import Company
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