import mysql.connector

mydb = mysql.connector.connect(
  host = "localhost",
  user = "root",
  passwd = "",
  database = "electricity_market_analysis"
)

mycursor = mydb.cursor()

mycursor.execute(
  """
    CREATE TABLE IF NOT EXISTS clientes
      (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255),
        apellido1 VARCHAR(255),
        apellido2 VARCHAR(255),
        nif VARCHAR(9),
        direccion VARCHAR(255),
        codigo_postal VARCHAR(255),
        poblacion VARCHAR(255),
        provincia VARCHAR(255)
      );
  """
)

mycursor.execute(
  """
    CREATE TABLE IF NOT EXISTS contratos
      (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_cliente INT,
        cups VARCHAR(22),
        fin_contrato DATE,
        numero_contador VARCHAR(255),
        peaje_acceso VARCHAR(255),
        potencia_contratada FLOAT DEFAULT 0,
        FOREIGN KEY (id_cliente) REFERENCES clientes(id)
      );
  """
)

mycursor.execute(
  """
    CREATE TABLE IF NOT EXISTS facturas
      (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_cliente INT,
        comercializadora VARCHAR(255),
        distribuidora VARCHAR(255),
        fecha_cargo DATE,
        fecha_emision DATE,
        fecha_fin DATE,
        fecha_inicio DATE,
        numero_factura VARCHAR(255),
        FOREIGN KEY (id_cliente) REFERENCES clientes(id)
      );
  """
)

mycursor.execute(
  """
    CREATE TABLE IF NOT EXISTS importes
      (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_factura INT,
        importe_alquiler_equipos FLOAT DEFAULT 0,
        importe_descuento FLOAT DEFAULT 0,
        importe_energia_consumida FLOAT DEFAULT 0,
        importe_impuestos FLOAT DEFAULT 0,
        importe_otros FLOAT DEFAULT 0,
        importe_potencia_contratada FLOAT DEFAULT 0,
        importe_subtotal FLOAT DEFAULT 0,
        importe_total FLOAT DEFAULT 0,
        FOREIGN KEY (id_factura) REFERENCES facturas(id)
      );
  """
)

mycursor.execute(
  """
    CREATE TABLE IF NOT EXISTS consumos
      (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_factura INT,
        consumo_actual INT DEFAULT 0,
        consumo_actual_punta INT DEFAULT 0,
        consumo_actual_valle INT DEFAULT 0,
        consumo_anterior INT DEFAULT 0,
        consumo_anterior_punta INT DEFAULT 0,
        consumo_anterior_valle INT DEFAULT 0,
        consumo_total INT DEFAULT 0,
        lectura_actual INT DEFAULT 0,
        lectura_actual_punta INT DEFAULT 0,
        lectura_actual_valle INT DEFAULT 0,
        lectura_anterior INT DEFAULT 0,
        lectura_anterior_punta INT DEFAULT 0,
        lectura_anterior_valle INT DEFAULT 0,
        FOREIGN KEY (id_factura) REFERENCES facturas(id)
      );
  """
)



