''''
Program for simulating electricity companies (trading-companies and distributors)
'''

import string, random, mysql.connector
from werkzeug.security import generate_password_hash

mydb = mysql.connector.connect(
	host = "localhost",
	user = "root",
	passwd = "",
	database = "electricity_market_analysis"
)
cursor = mydb.cursor()

cifs = set()

streets = open("bill_simulation/text_data/streets.txt", encoding='utf8').readlines()
populations = open("bill_simulation/text_data/populations.txt", encoding='utf8').readlines()

def create_trading_company(trading_company_info):
	trading_company = {}
	population = random.choice(populations).split(";")

	cif = random.choice(string.ascii_uppercase) + str(random.randint(10**7, 10**8-1))
	while cif in cifs:
		cif = (str(random.randint(10**7, 10**8-1)) + random.choice(string.ascii_uppercase))
	trading_company['cif'] = cif
	cifs.add(cif)
	trading_company['name'] = trading_company_info[1]
	trading_company['address'] = population[0].replace('"','')
	domain = trading_company['name'].split(',')[0].replace(' ', '').replace('.', '').lower()
	trading_company['url'] = "www." + domain + ".es"
	trading_company['email'] = domain + "@gmail.com"
	trading_company['type'] = 0
	trading_company['phone'] = str(random.randint(10**8, 10**9-1))
	return trading_company

def create_distributor(distributor_info):
	distributor = {}
	population = random.choice(populations).split(";")

	cif = random.choice(string.ascii_uppercase) + str(random.randint(10**7, 10**8-1))
	while cif in cifs:
		cif = (str(random.randint(10**7, 10**8-1)) + random.choice(string.ascii_uppercase))
	distributor['cif'] = cif
	cifs.add(cif)

	distributor['name'] = distributor_info[2]
	distributor['address'] = population[0].replace('"','')
	domain = distributor['name'].split(',')[0].replace(' ', '').replace('.', '').lower()
	distributor['url'] = "www." + domain + ".es"
	distributor['email'] = domain + "@gmail.com"
	distributor['type'] = 1
	distributor['phone'] = str(random.randint(10**8, 10**9-1))
	return distributor

def insert_company(company, user_id):
	sql = """
					INSERT INTO companies
					(
						cif,
						name,
						address,
						url,
						email,
						company_type,
						phone,
						user_id
					)
					VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
				"""
	val = (
		company['cif'],
		company['name'],
		company['address'],
		company['url'],
		company['email'],
		company['type'],
		company['phone'],
		user_id,
	)
	cursor.execute(sql, val)
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

	sql = "SELECT LAST_INSERT_ID()"
	cursor.execute(sql)

	user = cursor.fetchone()

	return user[0]


def create_offer(offer_type, cif):
	offer = {}
	offer['offer_type'] = offer_type
	if offer_type % 3 == 1:
		offer['fixed_term'] = round(random.random() * random.randint(2, 3), 6)
		offer['variable_term'] = round(random.random(), 6)
		offer['tip'] = 0
		offer['valley'] = 0
		offer['super_valley'] = 0
		offer['cif'] = cif
	elif offer_type % 3 == 2:
		offer['fixed_term'] = round(random.random() * random.randint(2, 3), 6)
		offer['variable_term'] = 0
		offer['tip'] = round(random.random() * 1.9, 6)
		offer['valley'] = round(offer['tip'] * 0.4, 6)
		offer['super_valley'] = 0
		offer['cif'] = cif
	else:
		offer['fixed_term'] = round(random.random() * random.randint(2, 3), 6)
		offer['variable_term'] = 0
		offer['tip'] = round(random.random() * 1.9, 6)
		offer['valley'] = round(offer['tip'] * 0.4, 6)
		offer['super_valley'] = round(offer['valley'] * 0.9, 6)
		offer['cif'] = cif
	return offer

def insert_offer(offer):
	sql = """
					INSERT INTO offers
					(
						offer_type,
						fixed_term,
						variable_term,
						tip,
						valley,
						super_valley,
						cif
					)
					VALUES (%s, %s, %s, %s, %s, %s, %s);
				"""
	val = (
		offer['offer_type'],
		offer['fixed_term'],
		offer['variable_term'],
		offer['tip'],
		offer['valley'],
		offer['super_valley'],
		offer['cif'],
	)
	cursor.execute(sql, val)
	mydb.commit()

	sql = """
					SELECT LAST_INSERT_ID()
				"""
	cursor.execute(sql)

	offer = cursor.fetchone()
	return offer[0]


def create_offer_feature(offer_id, offers_features_text):
	offer_feature = {}
	offer_feature['text'] = (random.choice(offers_features_text)).replace('\n','')
	offer_feature['offer_id'] = offer_id
	return offer_feature

def insert_offer_feature(offer_feature):
	sql = """
					INSERT INTO offers_features
					(
						text,
						offer_id
					)
					VALUES (%s, %s);
				"""
	val = (
		offer_feature['text'],
		offer_feature['offer_id'],
	)
	cursor.execute(sql, val)
	mydb.commit()

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

def create_companies():
	offers_features_text = open("bill_simulation/text_data/offers_features.txt", encoding='utf8').readlines()

	print("Insertando comercializadoras simuladas...")
	# CREATE TRADING COMPANIES
	with open('bill_simulation/text_data/trading_companies.txt', encoding='utf8') as trading_companies_file:
		for trading_company in trading_companies_file:
			# CREATE TRADING COMPANY
			company = create_trading_company(trading_company.split(";"))
			user_id = insert_user(company, 0)
			insert_company(company, user_id)

			# CREATE SIMULATED PRICES
			year = 2000
			kwh_price = random.uniform(0.0243, 0.0538)
			while year < 2020:
				kwh_annual_increase = random.uniform(0.00495, 0.02028)
				create_trading_company_prices(
					kwh_price,
					year,
					company["cif"]
				)
				kwh_price += kwh_annual_increase
				year += 1

			# CREATE OFFERS
			for i in range(9):
				offer = create_offer(i + 1, company["cif"])
				offer_id = insert_offer(offer)
				# CREATE OFFERS FEATURES
				for _ in range(random.randint(1, 3)):
					offer_feature = create_offer_feature(offer_id, offers_features_text)
					insert_offer_feature(offer_feature)


	print("Insertando distribuidoras simuladas...")
	# CREATE DISTRIBUTORS
	with open('bill_simulation/text_data/distributors.txt', encoding='utf8') as distributors_file:
		for distributor in distributors_file:
			# CREATE DISTRIBUTOR
			company = create_distributor(distributor.split(";"))
			user_id = insert_user(company, 0)
			insert_company(company, user_id)