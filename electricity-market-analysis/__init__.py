from flask import Flask, render_template, request, redirect, url_for
from flask_login import LoginManager, current_user, login_user, logout_user, login_required
from flask_sqlalchemy import SQLAlchemy
from werkzeug.urls import url_parse

from .forms import CustomerSignUpForm, CompanySignUpForm, LoginForm


app = Flask(__name__)
app.secret_key = "dev"
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@127.0.0.1/electricity_market_analysis'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

login_manager = LoginManager(app)
db = SQLAlchemy(app)

from .models import User, Customer, Company, Customer_Dwelling_Contract, Contract, Invoice

@app.route("/")
def index():
	return render_template("index.html")


@app.route("/signup/", methods=["GET", "POST"])
def sign_up():
	if current_user.is_authenticated:
		return redirect(url_for("index"))

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
				next_page = url_for('index')
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
				next_page = url_for('index')
			return redirect(next_page)
	return render_template(
		"auth/sign_up.html",
		customer_form=customer_form,
		company_form=company_form,
		form_type=form_type,
		error=error
	)


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
	return render_template('auth/login.html', form=form)


@login_manager.user_loader
def load_user(user_id):
	return User.get_by_id(user_id)


@app.route('/logout')
@login_required
def log_out():
	logout_user()
	return redirect(url_for('index'))


@app.route('/my-bills', methods=["GET", "POST"])
@login_required
def my_bills():
	customer = None
	contracts = None
	contract_invoices = None
	if current_user.user_type == 1:
		customer = Customer.get_by_user_id(current_user.id)
		customers_dwellings_contracts = Customer_Dwelling_Contract.get_by_nif(customer.nif)
		contracts = []
		for customer_dwelling_contract in customers_dwellings_contracts:
			contracts.append(Contract.get_by_contract_number(customer_dwelling_contract.contract_number))
		contract_invoices = {}
		for contract in contracts:
			contract_invoices[contract] = Invoice.get_by_contract_number(contract.contract_number)
	return render_template("bills/my_bills.html", contracts=contracts, contract_invoices=contract_invoices)


@app.route('/my-bills/show-bill/<int:invoice_number>')
@login_required
def show_bill(invoice_number):
	invoice = Invoice.get_by_invoice_number(invoice_number)
	return render_template("bills/show_bill.html", invoice=invoice)


@app.route('/my-bills/delete/<int:invoice_number>')
@login_required
def delete_bill(invoice_number):
	invoice = Invoice.get_by_invoice_number(invoice_number)
	invoice.delete()
	return redirect(url_for('my_bills'))