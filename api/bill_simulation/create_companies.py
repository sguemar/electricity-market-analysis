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


if __name__ == '__main__':
	streets = open("bill_simulation/streets.txt", encoding='utf8').readlines()

	# Create trading companies
	with open('bill_simulation/trading_companies.txt', encoding='utf8') as trading_companies_file:
		for trading_company in trading_companies_file:
			company = create_trading_company(trading_company.split(";"))
			user_id = insert_user(company, 0)
			insert_company(company, user_id)

	# Create distributors
	with open('bill_simulation/distributors.txt', encoding='utf8') as distributors_file:
		for distributor in distributors_file:
			company = create_distributor(distributor.split(";"))
			user_id = insert_user(company, 0)
			insert_company(company, user_id)