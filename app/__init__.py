from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

login_manager = LoginManager()
db = SQLAlchemy()

def create_app():
	app = Flask(__name__)

	app.secret_key = "dev"
	app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@127.0.0.1/electricity_market_analysis'
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

	app.config['UPLOAD_FOLDER'] = '/tmp'
	app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

	login_manager.init_app(app)
	db.init_app(app)

	from .public import public_bp
	app.register_blueprint(public_bp)

	from .auth import auth_bp
	app.register_blueprint(auth_bp)

	from .customer import customer_bp
	app.register_blueprint(customer_bp)

	return app