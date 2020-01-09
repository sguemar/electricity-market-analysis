import mysql.connector

def get_database_connector(host, user, passwd, database):
  return mysql.connector.connect(
    host = host,
    user = user,
    passwd = passwd,
    database = database
  )


conector = get_database_connector("localhost", "root", "", "")
cursor = conector.cursor()
cursor.execute("CREATE DATABASE IF NOT EXISTS electricity_market_analysis")

conector = get_database_connector("localhost", "root", "", "electricity_market_analysis")
cursor = conector.cursor()


cursor.execute(
  """
    CREATE TABLE IF NOT EXISTS users
      (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        type TINYINT NOT NULL
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
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
  """
)

cursor.execute(
  """
    CREATE TABLE IF NOT EXISTS dwellings
      (
        cups VARCHAR(22) PRIMARY KEY,
        address VARCHAR(255) NOT NULL,
        postal_code VARCHAR(5) NOT NULL,
        meter_box_number VARCHAR(255) NOT NULL,
        population VARCHAR(255) NOT NULL,
        province VARCHAR(255) NOT NULL
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
        type TINYINT NOT NULL,
        phone INT NOT NULL,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
  """
)

cursor.execute(
  """
    CREATE TABLE IF NOT EXISTS contracts
      (
        contract_number INT AUTO_INCREMENT PRIMARY KEY,
        contracted_power FLOAT DEFAULT 0,
        toll_access VARCHAR(255),
        init_date DATE NOT NULL,
        end_date DATE NOT NULL,
        CNAE VARCHAR(10) NOT NULL,
        tariff_access VARCHAR(255),
        contract_reference VARCHAR(255) NOT NULL,
        description LONGTEXT,
        conditions LONGTEXT,
        cif VARCHAR(9) NOT NULL,
        file LONGBLOB,
        FOREIGN KEY (cif) REFERENCES companies(cif)
      );
  """
)

cursor.execute(
  """
    CREATE TABLE IF NOT EXISTS invoices
      (
        invoice_number INT AUTO_INCREMENT PRIMARY KEY,
        contracted_power_amount FLOAT NOT NULL,
        consumed_energy_amount FLOAT NOT NULL,
        issue_date DATE NOT NULL,
        charge_date DATE NOT NULL,
        init_date DATE NOT NULL,
        end_date DATE NOT NULL,
        total_amount FLOAT NOT NULL,
        tax FLOAT NOT NULL,
        contract_number INT NOT NULL,
        file LONGBLOB,
        FOREIGN KEY (contract_number) REFERENCES contracts(contract_number)
      );
  """
)

cursor.execute(
  """
    CREATE TABLE IF NOT EXISTS customer_dwelling_contract
      (
        nif VARCHAR(9),
        cups VARCHAR(22),
        contract_number INT,
        init_date DATE NOT NULL,
        end_date DATE NOT NULL,
        CONSTRAINT PK_customer_dwelling_contract PRIMARY KEY (nif, cups, contract_number),
        FOREIGN KEY (nif) REFERENCES customers(nif),
        FOREIGN KEY (cups) REFERENCES dwellings(cups),
        FOREIGN KEY (contract_number) REFERENCES contracts(contract_number)
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
        FOREIGN KEY (cif) REFERENCES companies(cif),
        FOREIGN KEY (cups) REFERENCES dwellings(cups)
      );
  """
)

