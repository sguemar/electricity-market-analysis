''''
Program for simulating electricity bills
'''

import random, string, datetime, mysql.connector

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

trading_companies = []
distributors = []
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

def insert_customer(customer):
   sql = """
            INSERT INTO customers
            (
               name,
               surname,
               nif
            )
            VALUES (%s, %s, %s);
         """
   val = (
         customer['name'],
         customer['surname'],
         customer['nif'],
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


def create_trading_company(trading_company_info):
   trading_company = {}
   trading_company['cif'] = random.choice(string.ascii_uppercase) + str(random.randint(10**7, 10**8-1))
   trading_company['name'] = trading_company_info[1]
   trading_company['address'] = trading_company_info[4]
   domain = trading_company['name'].split(',')[0].replace(' ', '').replace('.', '').lower()
   trading_company['url'] = "www." + domain + ".es"
   trading_company['email'] = domain + "@gmail.com"
   trading_company['type'] = 0
   trading_company['phone'] = str(random.randint(10**8, 10**9-1))
   trading_companies.append(trading_company)
   return trading_company

def create_distributor(distributor_info):
   distributor = {}
   distributor['cif'] = random.choice(string.ascii_uppercase) + str(random.randint(10**7, 10**8-1))
   distributor['name'] = distributor_info[2]
   distributor['address'] = (random.choice(streets)).replace('\n','')
   domain = distributor['name'].split(',')[0].replace(' ', '').replace('.', '').lower()
   distributor['url'] = "www." + domain + ".es"
   distributor['email'] = domain + "@gmail.com"
   distributor['type'] = 1
   distributor['phone'] = str(random.randint(10**8, 10**9-1))
   distributors.append(distributor)
   return distributor

def insert_company(company):
   sql = """
            INSERT INTO companies
            (
               cif,
               name,
               address,
               url,
               email,
               type,
               phone
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s);
         """
   val = (
         company['cif'],
         company['name'],
         company['address'],
         company['url'],
         company['email'],
         company['type'],
         company['phone'],
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
   contract["contract_reference"] = str(random.randint(10**8, 10**9-1))
   contract["cif"] = trading_company['cif']
   return contract

def insert_contract(contract):
   sql = """
            INSERT INTO contracts
            (
               contracted_power,
               toll_access,
               init_date,
               end_date,
               CNAE,
               contract_reference,
               cif
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s);
         """
   val = (
         contract["contracted_power"],
         contract["toll_access"],
         contract["init_date"],
         contract["end_date"],
         contract["CNAE"],
         contract["contract_reference"],
         contract["cif"],
      )
   cursor.execute(sql, val)
   mydb.commit()

   sql = """
            SELECT contract_number
            FROM contracts
            WHERE contracted_power = %s
            AND toll_access = %s
            AND init_date = %s
            AND end_date = %s
            AND CNAE = %s
            AND contract_reference = %s
            AND cif = %s
         """
   cursor.execute(sql, val)

   contract = cursor.fetchone()

   return contract[0]


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
   invoice["contract_number"] = contract_number
   return invoice

def insert_invoice(invoice):
   sql = """
            INSERT INTO invoices
            (
               contracted_power_amount,
               consumed_energy_amount,
               init_date,
               end_date,
               issue_date,
               charge_date,
               tax,
               total_amount,
               contract_number
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
         """
   val = (
         invoice["contracted_power_amount"],
         invoice["consumed_energy_amount"],
         invoice["init_date"],
         invoice["end_date"],
         invoice["issue_date"],
         invoice["charge_date"],
         invoice["tax"],
         invoice["total_amount"],
         invoice["contract_number"],
      )
   cursor.execute(sql, val)
   mydb.commit()

if __name__ == '__main__':

   names = open("bill_simulation/names.txt").readlines()
   surnames = open("bill_simulation/surnames.txt").readlines()
   populations = open("bill_simulation/populations.txt").readlines()
   streets = open("bill_simulation/streets.txt").readlines()

   # Create trading companies
   with open('bill_simulation/trading_companies.txt') as trading_companies_file:
      for trading_company in trading_companies_file:
         company = create_trading_company(trading_company.split(";"))
         insert_company(company)

   # Create distributors
   with open('bill_simulation/distributors.txt') as distributors_file:
      for distributor in distributors_file:
         company = create_distributor(distributor.split(";"))
         insert_company(company)

   # Create customers
   for _ in range(CUSTOMERS_NUMBER):
      customer = create_customer()
      insert_customer(customer)

      dwelling = create_dwelling()
      insert_dwelling(dwelling)

      contract_cycle_init_date = get_random_date(random.randint(2015, 2018))
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
         
         contract_init_date = contract_end_date
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
            invoice_init_date += INVOICE_CYCLE

         contract_number += 1
         kwh_price += kwh_annual_increase
         

      