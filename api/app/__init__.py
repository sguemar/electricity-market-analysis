from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

login_manager = LoginManager()
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
	app = Flask(__name__)
	login_manager.init_app(app)

	### CONFIGURATION ###
	# GENERAL
	app.secret_key = "dev"
	app.config['UPLOAD_FOLDER'] = '/tmp'
	app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

	# SQLALCHEMY
	app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@127.0.0.1/electricity_market_analysis'
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
	db.init_app(app)

	# JWT
	app.config['JWT_SECRET_KEY'] = 'jwt-secret-key-dev'
	app.config['JWT_TOKEN_LOCATION'] = ['cookies']
	app.config['JWT_COOKIE_SECURE'] = False
	app.config['JWT_COOKIE_CSRF_PROTECT'] = True
	jwt.init_app(app)

	### BLUEPRINTS REGISTRATION ###
	from .public import public_bp
	app.register_blueprint(public_bp)

	from .auth import auth_bp
	app.register_blueprint(auth_bp, url_prefix='/api/auth')

	from .customer import customer_bp
	app.register_blueprint(customer_bp)

	return app