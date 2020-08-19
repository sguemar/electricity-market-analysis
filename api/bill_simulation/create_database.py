import mysql.connector


def get_database_connector(host, user, passwd, database):
    return mysql.connector.connect(
        host=host,
        user=user,
        passwd=passwd,
        database=database
    )


conector = get_database_connector("localhost", "root", "", "")
cursor = conector.cursor()
cursor.execute("CREATE DATABASE IF NOT EXISTS electricity_market_analysis")

conector = get_database_connector(
    "localhost", "root", "", "electricity_market_analysis")
cursor = conector.cursor()


cursor.execute(
    """
		CREATE TABLE IF NOT EXISTS users
		(
			id INT AUTO_INCREMENT PRIMARY KEY,
			username VARCHAR(255) NOT NULL UNIQUE,
			password VARCHAR(255) NOT NULL,
			user_type TINYINT NOT NULL
		);
  	"""
)

cursor.execute(
    """
		CREATE TABLE IF NOT EXISTS customers
		(
			nif VARCHAR(9) PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			surname VARCHAR(255) NOT NULL,
			email VARCHAR(255),
			user_id INT,
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		);
	"""
)

cursor.execute(
    """
		CREATE TABLE IF NOT EXISTS dwellings
		(
			cups VARCHAR(22) PRIMARY KEY,
			address VARCHAR(255) DEFAULT '',
			postal_code VARCHAR(5) DEFAULT '',
			meter_box_number VARCHAR(255) DEFAULT '',
			population VARCHAR(255) DEFAULT '',
			province VARCHAR(255) DEFAULT ''
		);
	"""
)

cursor.execute(
    """
		CREATE TABLE IF NOT EXISTS companies
		(
			cif VARCHAR(9) PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			address VARCHAR(255) NOT NULL,
			url VARCHAR(255),
			email VARCHAR(255),
			company_type TINYINT NOT NULL,
			phone INT NOT NULL,
			user_id INT,
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		);
	"""
)

cursor.execute(
    """
		CREATE TABLE IF NOT EXISTS contracts
		(
			contract_number VARCHAR(255) PRIMARY KEY,
			contracted_power FLOAT DEFAULT 0,
			toll_access VARCHAR(255) DEFAULT '',
			init_date DATE,
			end_date DATE,
			CNAE VARCHAR(10) DEFAULT '',
			tariff_access VARCHAR(255) DEFAULT '',
			description LONGTEXT,
			conditions LONGTEXT,
			cif VARCHAR(9),
			file LONGBLOB,
			FOREIGN KEY (cif) REFERENCES companies(cif) ON DELETE SET NULL
		);
	"""
)

cursor.execute(
    """
		CREATE TABLE IF NOT EXISTS invoices
		(
			invoice_number VARCHAR(255) PRIMARY KEY,
			contracted_power_amount FLOAT DEFAULT 0,
			consumed_energy_amount FLOAT DEFAULT 0,
			consumed_energy FLOAT DEFAULT 0,
			issue_date DATE,
			charge_date DATE,
			init_date DATE,
			end_date DATE,
			total_amount FLOAT DEFAULT 0,
			tax FLOAT DEFAULT 0,
			tax_amount FLOAT DEFAULT 0,
			contract_reference VARCHAR(255) DEFAULT '',
			contract_number VARCHAR(255) DEFAULT '',
			document LONGBLOB,
			FOREIGN KEY (contract_number) REFERENCES contracts(contract_number) ON DELETE CASCADE
		);
	"""
)

cursor.execute(
    """
		CREATE TABLE IF NOT EXISTS customer_dwelling_contract
		(
			nif VARCHAR(9),
			cups VARCHAR(22),
			contract_number VARCHAR(255),
			init_date DATE,
			end_date DATE,
			CONSTRAINT PK_customer_dwelling_contract PRIMARY KEY (nif, cups, contract_number),
			FOREIGN KEY (nif) REFERENCES customers(nif) ON DELETE CASCADE,
			FOREIGN KEY (cups) REFERENCES dwellings(cups) ON DELETE CASCADE,
			FOREIGN KEY (contract_number) REFERENCES contracts(contract_number) ON DELETE CASCADE
		);
	"""
)

cursor.execute(
    """
		CREATE TABLE IF NOT EXISTS distributor_dwelling
		(
			cif VARCHAR(9),
			cups VARCHAR(22),
			init_date DATE,
			end_date DATE,
			CONSTRAINT PK_distributor_dwelling PRIMARY KEY (cif, cups, init_date),
			FOREIGN KEY (cif) REFERENCES companies(cif) ON DELETE CASCADE,
			FOREIGN KEY (cups) REFERENCES dwellings(cups)
		);
	"""
)
