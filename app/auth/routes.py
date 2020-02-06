from flask import render_template, request, url_for, redirect
from flask_login import login_required, current_user, login_user, logout_user
from werkzeug.security import check_password_hash


from app import login_manager
from . import auth_bp
from .forms import LoginForm, CustomerSignUpForm, CompanySignUpForm
from .models import User
from app.customer.models import Customer
from app.models import Company


@auth_bp.route("/signup/", methods=["GET", "POST"])
def sign_up():
	if current_user.is_authenticated:
		return redirect(url_for("public.index"))

	customer_form = CustomerSignUpForm(form_type="customer")
	company_form = CompanySignUpForm(form_type="company")
	error = None
	form_type = None

	if request.method == "POST":
		form_type = request.form["form_type"]

	if form_type == "customer" and customer_form.validate_on_submit():
		username = customer_form.username.data
		password = customer_form.password.data
		nif = customer_form.nif.data
		user = User.get_by_username(username)
		customer = Customer.get_by_nif(nif)
		if user is not None:
			error = f"El nombre de usuario '{username}' ya está siendo utilizado por otro usuario"
		elif customer is not None:
			error = f"El NIF '{nif}' ya ha sido registrado"
		else:
			user = User(username=username, user_type=1)
			user.set_password(password)
			user.save()
			customer = Customer(
				nif=customer_form.nif.data,
				name=customer_form.name.data,
				surname=customer_form.surname.data,
				email=customer_form.email.data,
				user_id=user.id
			)
			customer.save()
			login_user(user, remember=True)
			next_page = request.args.get('next', None)
			if not next_page or url_parse(next_page).netloc != '':
				next_page = url_for('public.index')
			return redirect(next_page)
	if form_type == "company" and company_form.validate_on_submit():
		username = company_form.username.data
		password = company_form.password.data
		cif = company_form.cif.data
		user = User.get_by_username(username)
		company = Company.get_by_cif(cif)
		if user is not None:
			error = f"El nombre de usuario '{username}' ya está siendo utilizado por otro usuario"
		elif company is not None:
			error = f"El CIF '{cif}' ya ha sido registrado"
		else:
			user = User(username=username, user_type=0)
			user.set_password(password)
			user.save()
			company = Company(
				cif=company_form.cif.data,
				name=company_form.name.data,
				address=company_form.address.data,
				url=company_form.url.data,
				email=company_form.email.data,
				company_type=company_form.company_type.data,
				phone=company_form.phone.data,
				user_id=user.id
			)
			company.save()
			login_user(user, remember=True)
			next_page = request.args.get('next', None)
			if not next_page or url_parse(next_page).netloc != '':
				next_page = url_for('public.index')
			return redirect(next_page)
	return render_template(
		"sign_up.html",
		customer_form=customer_form,
		company_form=company_form,
		form_type=form_type,
		error=error
	)


@auth_bp.route("/login", methods=["GET", "POST"])
def log_in():
	if current_user.is_authenticated:
		return redirect(url_for('public.index'))
	form = LoginForm()
	if form.validate_on_submit():
		user = User.get_by_username(form.username.data)
		if user is not None and user.check_password(form.password.data):
			login_user(user, remember=form.remember_me.data)
			next_page = request.args.get('next')
			if not next_page or url_parse(next_page).netloc != '':
				next_page = url_for('public.index')
			return redirect(next_page)
	return render_template('login.html', form=form)


@login_manager.user_loader
def load_user(user_id):
	return User.get_by_id(user_id)


@auth_bp.route('/logout')
@login_required
def log_out():
	logout_user()
	return redirect(url_for('public.index'))
