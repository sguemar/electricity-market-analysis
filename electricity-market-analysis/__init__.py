from flask import Flask, render_template, request, redirect, url_for
from flask_login import LoginManager, current_user, login_user, logout_user, login_required
from flask_sqlalchemy import SQLAlchemy
from werkzeug.urls import url_parse

from .forms import SignUpForm, LoginForm


app = Flask(__name__)
app.secret_key = "dev"
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@127.0.0.1/electricity_market_analysis'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

login_manager = LoginManager(app)
db = SQLAlchemy(app)

from .models import User

@app.route("/")
def index():
	return render_template("index.html")


@app.route("/signup/", methods=["GET", "POST"])
def sign_up():
	if current_user.is_authenticated:
		return redirect(url_for("index"))
	form = SignUpForm()
	error = None
	if form.validate_on_submit():
		username = form.username.data
		password = form.password.data
		user = User.get_by_username(username)
		if user is not None:
			error = f"El nombre de usuario '{username}' ya está siendo utilizado por otro usuario"
		else:
			user = User(username=username, user_type=1)
			user.set_password(password)
			user.save()
			login_user(user, remember=True)
			next_page = request.args.get('next', None)
			if not next_page or url_parse(next_page).netloc != '':
				next_page = url_for('index')
			return redirect(next_page)
	return render_template("sign_up.html", form=form, error=error)


@app.route("/login", methods=["GET", "POST"])
def log_in():
	if current_user.is_authenticated:
		return redirect(url_for('index'))
	form = LoginForm()
	if form.validate_on_submit():
		user = User.get_by_username(form.username.data)
		if user is not None and user.check_password(form.password.data):
			login_user(user, remember=form.remember_me.data)
			next_page = request.args.get('next')
			if not next_page or url_parse(next_page).netloc != '':
				next_page = url_for('index')
			return redirect(next_page)
	return render_template('login.html', form=form)


@login_manager.user_loader
def load_user(user_id):
	return User.get_by_id(user_id)


@app.route('/logout')
@login_required
def log_out():
	logout_user()
	return redirect(url_for('index'))
