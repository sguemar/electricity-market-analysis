''''
Program for simulating offers types
'''

import mysql.connector

mydb = mysql.connector.connect(
  host = "localhost",
  user = "root",
  passwd = "",
  database = "electricity_market_analysis"
)
cursor = mydb.cursor()

rates = ["2.0A", "2.0DHA", "2.0DHS", "2.1A", "2.1DHA", "2.1DHS", "3.0A", "3.0DHA", "3.0DHS"]
rates_names = [
  "Tarifa general",
  "Tarifa con discriminación horaria",
  "Tarifa supervalle",
]

def insert_offer_type(rate, name):
	sql = """
					INSERT INTO offers_types
					(
						rate,
						name
					)
					VALUES (%s, %s);
				"""
	val = (rate, name)
	cursor.execute(sql, val)
	mydb.commit()

def create_offers_types():
  for i, rate in enumerate(rates):
    insert_offer_type(rate, rates_names[i % 3])
