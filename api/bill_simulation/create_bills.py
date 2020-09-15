''''
Program for simulating electricity bills
'''

import random, string, datetime, mysql.connector, sys
from werkzeug.security import generate_password_hash


mydb = mysql.connector.connect(
  host = "localhost",
  user = "root",
  passwd = "",
  database = "electricity_market_analysis"
)
cursor = mydb.cursor()


INIT_CONTRACTS_YEAR = 2012
INVOICE_CYCLE = datetime.timedelta(days=28)

user_names = set()
nifs = set()
selected_trading_companies_cifs = set()

def get_random_date(year):
   try:
      return datetime.datetime.strptime('{} {}'.format(random.randint(1, 366), year), '%j %Y')
   except ValueError:
      return get_random_date(year)


def create_customer():
   customer = {}
   customer['name'] = (random.choice(names)).replace('\n','')   
   customer['surname'] = ((random.choice(surnames)).replace('\n','') + " " +
                         (random.choice(surnames)).replace('\n',''))
   nif = (str(random.randint(10**7, 10**8-1)) + random.choice(string.ascii_uppercase))
   while nif in nifs:
      nif = (str(random.randint(10**7, 10**8-1)) + random.choice(string.ascii_uppercase))
   customer['nif'] = nif
   nifs.add(nif)

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


def create_contract(trading_company, init_date):
   contract = {}
   contract["contracted_power"] = random.choice([2.00, 2.50, 3.00, 3.50, 4.00, 4.50, 5.00, 5.50]) #kW
   contract["toll_access"] = random.choice(['2.0A', '2.0DHA', '2.1A', '2.1DHA'])
   contract["init_date"] = init_date
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
         CNAE,
         cif
      )
      VALUES (%s, %s, %s, %s, %s, %s);
   """
   val = (
      contract_number,
      contract["contracted_power"],
      contract["toll_access"],
      contract["init_date"],
      contract["CNAE"],
      contract["cif"],
   )
   try:
      cursor.execute(sql, val)
   except mysql.connector.errors.IntegrityError:
      return insert_contract(contract)

   mydb.commit()

   return contract_number

def contract_set_end_date(contract_number, end_date):
   sql = """
      UPDATE contracts
      SET end_date = %s
      WHERE contract_number = %s
   """
   val = (
      end_date,
      contract_number,
   )
   cursor.execute(sql, val)
   mydb.commit() 


def insert_customer_dwelling_contract(customer, dwelling, contract, contract_number):
   sql = """
      INSERT INTO customer_dwelling_contract
      (
         nif,
         cups,
         contract_number,
         init_date
      )
      VALUES (%s, %s, %s, %s);
   """
   val = (
         customer["nif"],
         dwelling["cups"],
         contract_number,
         contract["init_date"],
   )
   cursor.execute(sql, val)
   mydb.commit()

def customer_dwelling_contract_set_end_date(nif, cups, contract_number, end_date):
   sql = """
      UPDATE customer_dwelling_contract
      SET end_date = %s
      WHERE nif = %s
      AND cups = %s
      AND contract_number = %s
   """
   val = (
      end_date,
      nif,
      cups,
      contract_number,
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


def create_invoice(contract_number, contracted_power, init_date, end_date, kwh_price, province):
   invoice = {}
   issue_date = end_date + datetime.timedelta(days=1)
   charge_date = end_date + datetime.timedelta(days=random.randint(2, 5))
   consumption_period = end_date - init_date
   invoice["contracted_power_amount"] = contracted_power * consumption_period.days * kwh_price
   # LESS ENERGY SUMMER MONTHS
   if init_date.month in [4, 5, 6, 7, 8, 9]:
      invoice["consumed_energy"] = random.randint(100, 250)
   # MORE ENERGY WINTER MONTHS
   else:
      invoice["consumed_energy"] = random.randint(200, 350)
   invoice["consumed_energy_amount"] = invoice["consumed_energy"] * kwh_price
   invoice["init_date"] = init_date.strftime("%Y-%m-%d")
   invoice["end_date"] = end_date.strftime("%Y-%m-%d")
   invoice["issue_date"] = issue_date.strftime("%Y-%m-%d")
   invoice["charge_date"] = charge_date.strftime("%Y-%m-%d")
   if province == "Las Palmas" or province == "Santa Cruz de Tenerife" or province == "Ceuta" or province == "Melilla":
      invoice["tax"] = 7
   else:
      invoice["tax"] = 21
   invoice["total_amount"] = (invoice["contracted_power_amount"] + invoice["consumed_energy_amount"]) * (1 + invoice["tax"] / 100) 
   invoice["tax_amount"] = invoice["total_amount"] - invoice["contracted_power_amount"] - invoice["consumed_energy_amount"]
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
               consumed_energy,
               init_date,
               end_date,
               issue_date,
               charge_date,
               tax,
               tax_amount,
               total_amount,
               contract_reference,
               contract_number
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
         """
   val = (
         ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(14)),
         invoice["contracted_power_amount"],
         invoice["consumed_energy_amount"],
         invoice["consumed_energy"],
         invoice["init_date"],
         invoice["end_date"],
         invoice["issue_date"],
         invoice["charge_date"],
         invoice["tax"],
         invoice["tax_amount"],
         invoice["total_amount"],
         invoice["contract_reference"],
         invoice["contract_number"],
      )
   try:
      cursor.execute(sql, val)
   except mysql.connector.errors.IntegrityError:
      return insert_invoice(invoice)
   mydb.commit()


def insert_user(user):
   sql = """
            INSERT INTO users
            (
               username,
               password,
               user_type
            )
            VALUES (%s, %s, %s);
         """

   random_num = str(random.randint(0, 1000))
   username = user["name"] + random_num
   while username in user_names:
      random_num = str(random.randint(0, 1000))
      username = user["name"] + random_num
   user_names.add(username)

   password = generate_password_hash(username)
   val = (
         username,
         password,
         1,
      )
   cursor.execute(sql, val)
   mydb.commit()

   sql = "SELECT LAST_INSERT_ID()"
   cursor.execute(sql)

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


def insert_potential_customer_notification(nif, cif):
   sql = """
            INSERT INTO potentials_customers_notifications
            (
               nif,
               cif
            )
            VALUES (%s, %s);
         """
   val = (
         nif,
         cif,
      )
   cursor.execute(sql, val)
   mydb.commit()

def create_potential_customer(cif):
   customer = create_customer()
   user_id = insert_user(customer)
   insert_customer(customer, user_id)
   insert_potential_customer_notification(customer["nif"], cif)


def create_trading_company_prices(price, year, cif):
   sql = """
            INSERT INTO trading_company_prices
            (
               year,
               price,
               cif
            )
            VALUES (%s, %s, %s);
         """
   val = (
         year,
         price,
         cif,
      )
   cursor.execute(sql, val)
   mydb.commit()

if __name__ == '__main__':
   if len(sys.argv) < 2:
      sys.exit("Debes añadir un parámetro indicando el número de clientes con facturas simuladas que deseas crear.")
   
   try:
      CUSTOMERS_NUMBER = int(sys.argv[1])
   except:
      sys.exit("El parámetro a introducir debe ser un número mayor que cero")

   INVOICES_NUMBER = 12

   names = open("bill_simulation/text_data/names.txt", encoding='utf8').readlines()
   surnames = open("bill_simulation/text_data/surnames.txt", encoding='utf8').readlines()
   populations = open("bill_simulation/text_data/populations.txt", encoding='utf8').readlines()
   streets = open("bill_simulation/text_data/streets.txt", encoding='utf8').readlines()
   trading_companies = get_trading_companies()
   distributors = get_distributors()

   # CREATE CUSTOMERS
   for _ in range(CUSTOMERS_NUMBER):
      # CREATE CUSTOMER AND USER
      customer = create_customer()
      user_id = insert_user(customer)
      insert_customer(customer, user_id)
      
      # CREATE DWELLING
      dwelling = create_dwelling()
      insert_dwelling(dwelling)

      # CONTRACTS DATA
      current_date = get_random_date(INIT_CONTRACTS_YEAR)
      contract_init_date = current_date
      contract_year = contract_init_date.year
      
      # CREATE RELATIONSHIP DISTRIBUTOR_DWELLING
      distributor_dwelling_init_date = current_date.strftime("%Y-%m-%d")
      distributor = random.choice(distributors)
      insert_distributor_dwelling(
         distributor,
         dwelling,
         distributor_dwelling_init_date
      )

      # CHOOSE NEW OR USED TRADING COMPANY
      trading_company = random.choice(trading_companies)
      if len(selected_trading_companies_cifs) > 0:
         if random.random() < 0.5:
            cif = random.choice(tuple(selected_trading_companies_cifs))
            for item_trading_company in trading_companies:
               if item_trading_company["cif"] == cif:
                  trading_company = item_trading_company
                  break
      selected_trading_companies_cifs.add(trading_company["cif"])

      # RANDOM START PRICES
      kwh_price = random.uniform(0.0243, 0.0538)

      # CREATE CUSTOMER CONTRACTS
      while contract_year < 2020:
         # CREATE CONTRACT
         contract = create_contract(
            trading_company,
            contract_init_date.strftime("%Y-%m-%d"),
         )
         contract_number = insert_contract(contract)

         # CREATE RELATIONSHIP CUSTOMER_DWELLING_CONTRACT
         insert_customer_dwelling_contract(customer, dwelling, contract, contract_number)

         # CREATE TRADING COMPANY PRICES
         trading_company_prices = create_trading_company_prices(
            kwh_price,
            contract_year,
            trading_company["cif"]
         )

         # THE CUSTOMER CHANGES TRADING COMPANY
         if random.random() < 0.1:
            trading_company = random.choice(trading_companies)
            selected_trading_companies_cifs.add(trading_company["cif"])

         # THE CUSTOMER CHANGES DWELLING
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

            # THE CUSTOMER CHANGES DISTRIBUTOR
            if random.random() < 0.3:
               distributor = random.choice(distributors)

            # CREATE NEW RELATIONSHIP DISTRIBUTOR_DWELLING
            insert_distributor_dwelling(
               distributor,
               dwelling,
               distributor_dwelling_init_date.strftime("%Y-%m-%d"),
            )

         # CREATE CONTRACT INVOICES
         for _ in range(INVOICES_NUMBER):
            end_date = current_date + INVOICE_CYCLE
            while end_date.month == current_date.month:
               end_date += datetime.timedelta(days=random.choices([2, 3])[0])
            invoice = create_invoice(
               contract_number,
               contract["contracted_power"],
               current_date,
               end_date,
               kwh_price,
               dwelling["province"]
            )
            insert_invoice(invoice)
            current_date = end_date + datetime.timedelta(days=1)

         end_date = current_date - datetime.timedelta(days=1)
         contract_set_end_date(contract_number, end_date)
         customer_dwelling_contract_set_end_date(customer['nif'], dwelling['cups'], contract_number, end_date)
         contract_year = current_date.year
         contract_init_date = current_date
         kwh_annual_increase = random.uniform(0.00495, 0.02028)
         kwh_price += kwh_annual_increase
         create_potential_customer(trading_company["cif"])
         

      