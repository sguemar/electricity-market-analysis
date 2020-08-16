from flask import request, make_response
from werkzeug.security import check_password_hash
from flask_jwt_extended import (
	jwt_required, create_access_token,
	jwt_refresh_token_required, create_refresh_token,
	get_jwt_identity, set_access_cookies,
	set_refresh_cookies, unset_jwt_cookies
)

from . import auth_bp
from .models import User
from app.customer.models import Customer
from app.models import Company
from .schemas import UserSchema
from app.customer.schemas import CustomerSchema	
from app.schemas import CompanySchema


@auth_bp.route("/signup-customer", methods=["POST"])
def signup_customer():
	if not request.is_json:
		return "Missing JSON in request", 400
	data = request.get_json()
	errors = {}
	errors.update(validateUser(data))
	errors.update(validateCustomer(data))
	if errors:
		return errors, 422
	if User.get_by_username(data['username']):
		return {"username": ["Nombre de usuario no disponible"]}, 422
	if Customer.get_by_nif(data['nif']):
		return {"nif": ["Este NIF ya ha sido registrado"]}, 422
	user = User(username=data['username'], user_type=1)
	user.set_password(data['password'])
	user.save()
	customer = Customer(
		nif=data['nif'].upper(),
		name=data['name'],
		surname=data['surname'],
		email=data['email'],
		user_id=user.id
	)
	customer.save()
	return "", 200


@auth_bp.route('/signup-company', methods=["POST"])
def signup_company():
	if not request.is_json:
		return "Missing JSON in request", 400
	data = request.get_json()
	errors = {}
	errors.update(validateUser(data))
	errors.update(validateCompany(data))
	if errors:
		return errors, 422
	if User.get_by_username(data['username']):
		return {"username": ["Nombre de usuario no disponible"]}, 422
	if Company.get_by_cif(data['cif']):
		return {"cif": ["Este CIF ya ha sido registrado"]}, 422
	user = User(username=data['username'], user_type=0)
	user.set_password(data['password'])
	user.save()
	company = Company(
		cif=data['cif'].upper(),
		name=data['name'],
		address=data['address'],
		url=data['url'],
		email=data['email'],
		company_type=data['companytype'],
		phone=data['phone'],
		user_id=user.id
	)
	company.save()
	return "", 200


@auth_bp.route("/login", methods=["POST"])
def login():
	if not request.is_json:
		return "Missing JSON in request", 400
	data = request.get_json()
	username = data['username']
	password = data['password']
	user = User.get_by_username(username)
	if user and user.check_password(password):
		access_token = create_access_token(identity=username)
		refresh_token = create_refresh_token(identity=username)
		response = make_response({"login": True})
		set_access_cookies(response, access_token)
		set_refresh_cookies(response, refresh_token)
		return response, 200
	return "User or password incorrect", 400


@auth_bp.route('/logout', methods=["POST"])
def logout():
    resp = make_response({'logout': True})
    unset_jwt_cookies(resp)
    return resp, 200


def validateUser(data):
	user = {
		"username": data["username"],
		"password": data["password"],
		"passwordconfirmation": data["passwordconfirmation"]
	}
	user = {k: v for k, v in user.items() if v}
	return UserSchema().validate(user)


def validateCustomer(data):
	customer = {
		"nif": data["nif"],
		"name": data["name"],
		"surname": data["surname"],
		"email": data["email"],
	}
	customer = {k: v for k, v in customer.items() if v}
	return CustomerSchema().validate(customer)


def validateCompany(data):
	company = {
		"name": data["name"],
		"cif": data["cif"],
		"url": data["url"],
		"email": data["email"],
		"phone": data["phone"],
		"address": data["address"],
	}
	company = {k: v for k, v in company.items() if v}
	return CompanySchema().validate(company)