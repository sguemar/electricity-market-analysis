''''
Program for simulating electricity bills
'''

import random, string, datetime, mysql.connector
from werkzeug.security import generate_password_hash


mydb = mysql.connector.connect(
  host = "localhost",
  user = "root",
  passwd = "",
  database = "electricity_market_analysis"
)
cursor = mydb.cursor()


CUSTOMERS_NUMBER = 1
INVOICES_NUMBER = 12
CONTRACT_CYCLE = datetime.timedelta(days=365)
INVOICE_CYCLE = datetime.timedelta(days=30)

kwh_base_price = 0.0398
kwh_annual_increase = 0.01078

def get_random_date(year):
   try:
      return datetime.datetime.strptime('{} {}'.format(random.randint(1, 366), year), '%j %Y')
   except ValueError:
      return get_random_date(year)

def get_kwh_base_price(year):
   year_difference = year - 1990
   return kwh_base_price + kwh_annual_increase * year_difference


def create_customer():
   customer = {}
   customer['name'] = (random.choice(names)).replace('\n','')
   customer['surname'] = ((random.choice(surnames)).replace('\n','') + " " +
                         (random.choice(surnames)).replace('\n',''))
   customer['nif'] = (str(random.randint(10**7, 10**8-1)) + 
                     random.choice(string.ascii_uppercase))
   return customer

def insert_customer(customer, user_id):
   sql = """
            INSERT INTO customers
            (
               name,
               surname,
               nif,
               user_id
            )
            VALUES (%s, %s, %s, %s);
         """
   val = (
         customer['name'],
         customer['surname'],
         customer['nif'],
         user_id,
      )
   cursor.execute(sql, val)
   mydb.commit()


def create_dwelling():
   dwelling = {}
   population = random.choice(populations).split(";")
   
   dwelling['cups'] = 'ES' + str(random.randint(10**15, 10**16-1))
   dwelling['cups'] += ''.join(random.choice(string.ascii_uppercase) for _ in range(4))
   dwelling['address'] = (random.choice(streets)).replace('\n','')
   dwelling['meter_box_number'] = str(random.randint(10**12, 10**13-1))
   dwelling['postal_code'] = population[2].replace('"','').replace('\n','')
   dwelling['population'] = population[1].replace('"','')
   dwelling['province'] = population[0].replace('"','')
   return dwelling

def insert_dwelling(dwelling):
   sql = """
            INSERT INTO dwellings
            (
               cups,
               address,
               postal_code,
               meter_box_number,
               population,
               province
            )
            VALUES (%s, %s, %s, %s, %s, %s);
         """
   val = (
         dwelling['cups'],
         dwelling['address'],
         dwelling['postal_code'],
         dwelling['meter_box_number'],
         dwelling['population'],
         dwelling['province'],
      )
   cursor.execute(sql, val)
   mydb.commit()


def create_contract(trading_company, init_date, end_date):
   contract = {}
   contract["contracted_power"] = random.choice([2.00, 2.50, 3.00, 3.50, 4.00, 4.50, 5.00, 5.50])
   contract["toll_access"] = random.choice(['2.0A', '20DHA'])
   contract["init_date"] = init_date
   contract["end_date"] = end_date
   contract["CNAE"] = "D35351351" + str(random.randint(2, 9))
   contract["cif"] = trading_company['cif']
   return contract

def insert_contract(contract):
   contract_number = str(random.randint(10**12, 10**13-1))
   sql = """
            INSERT INTO contracts
            (
               contract_number,
               contracted_power,
               toll_access,
               init_date,
               end_date,
               CNAE,
               cif
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s);
         """
   val = (
         contract_number,
         contract["contracted_power"],
         contract["toll_access"],
         contract["init_date"],
         contract["end_date"],
         contract["CNAE"],
         contract["cif"],
      )
   try:
      cursor.execute(sql, val)
   except mysql.connector.errors.IntegrityError:
      return insert_contract(contract)

   mydb.commit()

   return contract_number


def insert_customer_dwelling_contract(customer, dwelling, contract, contract_number_id):
   sql = """
            INSERT INTO customer_dwelling_contract
            (
               nif,
               cups,
               contract_number,
               init_date,
               end_date
            )
            VALUES (%s, %s, %s, %s, %s);
         """
   val = (
            customer["nif"],
            dwelling["cups"],
            contract_number_id,
            contract["init_date"],
            contract["end_date"],
          )
   cursor.execute(sql, val)
   mydb.commit()

def insert_distributor_dwelling(distributor, dwelling, init_date):
   sql = """
            INSERT INTO distributor_dwelling
            (
               cif,
               cups,
               init_date
            )
            VALUES (%s, %s, %s);
         """
   val = (
         distributor["cif"],
         dwelling["cups"],
         init_date,
      )
   cursor.execute(sql, val)
   mydb.commit()

def set_end_date_last_relation_distributor_dwelling(distributors, dwelling, relation_init_date, relation_end_date):
   sql = """
            UPDATE distributor_dwelling
            SET end_date = %s
            WHERE cif = %s
            AND cups = %s
            AND init_date = %s
         """
   val = (
         relation_end_date,
         distributors["cif"],
         dwelling["cups"],
         relation_init_date,
      )
   cursor.execute(sql, val)
   mydb.commit()


def create_invoice(contract_number, contracted_power, init_date, kwh_price):
   invoice = {}
   end_date = init_date + INVOICE_CYCLE
   issue_date = end_date + datetime.timedelta(days=1)
   charge_date = end_date + datetime.timedelta(days=random.randint(2, 5))
   invoice["contracted_power_amount"] = contracted_power * INVOICE_CYCLE.days * kwh_price
   invoice["consumed_energy_amount"] = random.randint(100, 400) * kwh_price
   invoice["init_date"] = init_date.strftime("%Y-%m-%d")
   invoice["end_date"] = end_date.strftime("%Y-%m-%d")
   invoice["issue_date"] = issue_date.strftime("%Y-%m-%d")
   invoice["charge_date"] = charge_date.strftime("%Y-%m-%d")
   invoice["tax"] = 7
   invoice["total_amount"] = (invoice["contracted_power_amount"] + invoice["consumed_energy_amount"]) * (1 + invoice["tax"] / 100) 
   invoice["contract_reference"] = contract_number
   invoice["contract_number"] = contract_number
   return invoice

def insert_invoice(invoice):
   sql = """
            INSERT INTO invoices
            (
               invoice_number,
               contracted_power_amount,
               consumed_energy_amount,
               init_date,
               end_date,
               issue_date,
               charge_date,
               tax,
               total_amount,
               contract_reference,
               contract_number
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
         """
   val = (
         ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(14)),
         invoice["contracted_power_amount"],
         invoice["consumed_energy_amount"],
         invoice["init_date"],
         invoice["end_date"],
         invoice["issue_date"],
         invoice["charge_date"],
         invoice["tax"],
         invoice["total_amount"],
         invoice["contract_reference"],
         invoice["contract_number"],
      )
   try:
      cursor.execute(sql, val)
   except mysql.connector.errors.IntegrityError:
      return insert_invoice(invoice)
   mydb.commit()


def insert_user(user, user_type):
   sql = """
            INSERT INTO users
            (
               username,
               password,
               user_type
            )
            VALUES (%s, %s, %s);
         """

   if user_type == 0:
      username = user["cif"]
   else:
      username = user["name"]
   password = generate_password_hash(username)

   val = (
         username,
         password,
         user_type,
      )
   cursor.execute(sql, val)
   mydb.commit()

   sql = """
            SELECT id
            FROM users
            WHERE username = %s
            AND password = %s
            AND user_type = %s
         """
   cursor.execute(sql, val)

   user = cursor.fetchone()

   return user[0]


def get_trading_companies():
	cursor.execute("SHOW columns from companies")
	keys = [column[0] for column in cursor.fetchall()]
	cursor.execute("SELECT * FROM companies WHERE company_type = 0")
	trading_companies = cursor.fetchall()
	result = []
	[
		result.append(dict(zip(keys, trading_company)))
		for trading_company in trading_companies
	]
	return result

def get_distributors():
	cursor.execute("SHOW columns from companies")
	keys = [column[0] for column in cursor.fetchall()]
	cursor.execute("SELECT * FROM companies WHERE company_type = 1")
	distributors = cursor.fetchall()
	result = []
	[
		result.append(dict(zip(keys, distributor)))
		for distributor in distributors
	]
	return result

if __name__ == '__main__':

   names = open("bill_simulation/names.txt", encoding='utf8').readlines()
   surnames = open("bill_simulation/surnames.txt", encoding='utf8').readlines()
   populations = open("bill_simulation/populations.txt", encoding='utf8').readlines()
   streets = open("bill_simulation/streets.txt", encoding='utf8').readlines()
   trading_companies = get_trading_companies()
   distributors = get_distributors()

   # Create customers
   for _ in range(CUSTOMERS_NUMBER):
      customer = create_customer()
      user_id = insert_user(customer, 1)
      insert_customer(customer, user_id)
      
      dwelling = create_dwelling()
      insert_dwelling(dwelling)

      contract_cycle_init_date = get_random_date(random.randint(2012, 2019))
      contract_init_date = contract_cycle_init_date
      contract_end_date = contract_cycle_init_date + CONTRACT_CYCLE
      contract_year = contract_cycle_init_date.year
      distributor_dwelling_init_date = contract_cycle_init_date.strftime("%Y-%m-%d")
      
      distributor = random.choice(distributors)
      insert_distributor_dwelling(
         distributor,
         dwelling,
         distributor_dwelling_init_date
      )

      trading_company = random.choice(trading_companies)
      contract_number = 2

      kwh_price = get_kwh_base_price(contract_year)

      # Create contracts
      while contract_year < 2019:
         contract = create_contract(
            trading_company,
            contract_init_date.strftime("%Y-%m-%d"),
            contract_end_date.strftime("%Y-%m-%d")
         )
         contract_number_id = insert_contract(contract)
         insert_customer_dwelling_contract(customer, dwelling, contract, contract_number_id)

         invoice_init_date = contract_init_date
         
         contract_init_date = contract_end_date + datetime.timedelta(days=1)
         contract_end_date = contract_cycle_init_date + contract_number * CONTRACT_CYCLE
         contract_year = contract_init_date.year

         # The customer changes trading company
         if random.random() < 0.2:
            trading_company = random.choice(trading_companies)

         # The customer changes dwelling
         if random.random() < 0.1:
            set_end_date_last_relation_distributor_dwelling(
               distributor,
               dwelling,
               distributor_dwelling_init_date,
               contract_init_date.strftime("%Y-%m-%d")
            )
            distributor_dwelling_init_date = contract_init_date

            dwelling = create_dwelling()
            insert_dwelling(dwelling)

            # The customer changes distributor
            if random.random() < 0.3:
               distributor = random.choice(distributors)

            insert_distributor_dwelling(
               distributor,
               dwelling,
               distributor_dwelling_init_date.strftime("%Y-%m-%d"),
            )

         for _ in range(INVOICES_NUMBER):
            invoice = create_invoice(
               contract_number_id,
               contract["contracted_power"],
               invoice_init_date,
               kwh_price
            )
            insert_invoice(invoice)
            invoice_init_date += INVOICE_CYCLE + datetime.timedelta(days=1)

         contract_number += 1
         kwh_price += kwh_annual_increase
         

      