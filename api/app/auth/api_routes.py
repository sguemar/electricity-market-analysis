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