from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

login_manager = LoginManager()
db = SQLAlchemy()
jwt = JWTManager()

def create_app(settings_module):
	app = Flask(__name__, instance_relative_config=True)
	app.config.from_object(settings_module)
	if app.config.get('TESTING', False):
		app.config.from_pyfile('config-testing.py', silent=True)
	else:
		app.config.from_pyfile('config.py', silent=True)

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
	app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
	jwt.init_app(app)

	### BLUEPRINTS REGISTRATION ###
	from .public import public_bp
	app.register_blueprint(public_bp, url_prefix='/api/public')

	from .auth import auth_bp
	app.register_blueprint(auth_bp, url_prefix='/api/auth')

	from .customer import customer_bp
	app.register_blueprint(customer_bp, url_prefix='/api/customer')

	from .company import company_bp
	app.register_blueprint(company_bp, url_prefix='/api/company')

	return app