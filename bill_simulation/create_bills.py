''''
Program for simulating electricity bills
'''

import pprint, random, string, datetime, time, sys, mysql.connector
from decimal import Decimal, ROUND_UP

mydb = mysql.connector.connect(
  host = "localhost",
  user = "root",
  passwd = "",
  database = "electricity_market_analysis"
)

mycursor = mydb.cursor()

format = '%d/%m/%Y'

def random_date(start, end):
   """
   This function will return a random datetime between two datetime 
   objects.
   """
   stime = time.mktime(time.strptime(start, format))
   etime = time.mktime(time.strptime(end, format))

   ptime = stime + random.random() * (etime - stime)

   return ptime


def fill_template(template, directory, result, c, f):
   bill = open(template,"r").read()
   
   for label in result:
      bill = bill.replace("<" + label + ">", str(result[label]))
      

   file_name = directory + "/factura_" + str(c) + "_" + str(f) + ".txt"
   open(file_name,"w").write(bill)


def insert_customer(customer):
   sql = """
            INSERT INTO clientes
            (
               nombre,
               apellido1,
               apellido2,
               nif,
               direccion,
               codigo_postal,
               poblacion,
               provincia
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
         """
   val = (
            customer['Nombre'],
            customer['Apellido1'],
            customer['Apellido2'],
            customer['NIF'],
            customer['Direccion'],
            customer['CP'],
            customer['Poblacion'],
            customer['Provincia'],
          )
   mycursor.execute(sql, val)
   mydb.commit()


def insert_contract(contract, customer_id):  
   sql = """
            INSERT INTO contratos
            (
               id_cliente,
               cups,
               fin_contrato,
               numero_contador,
               peaje_acceso,
               potencia_contratada
            )
            VALUES (%s, %s, %s, %s, %s, %s);
         """
   val = (
            customer_id,
            contract['CUPS'],
            datetime.datetime.strptime(contract['FinContrato'], '%d/%m/%Y').strftime('%Y-%m-%d'),
            contract['NumeroContador'],
            contract['PeajeAcceso'],
            contract['PotenciaContratada'],
          )
   mycursor.execute(sql, val)
   mydb.commit()


def insert_bill(bill, customer_id):  
   sql = """
            INSERT INTO facturas
            (
               id_cliente,
               comercializadora,
               distribuidora,
               fecha_cargo,
               fecha_emision,
               fecha_fin,
               fecha_inicio,
               numero_factura
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
         """
   val = (
            customer_id,
            bill['Comercializadora'],
            bill['Distribuidora'],
            datetime.datetime.strptime(bill['FechaCargo'], '%d/%m/%Y').strftime('%Y-%m-%d'),
            datetime.datetime.strptime(bill['FechaEmision'], '%d/%m/%Y').strftime('%Y-%m-%d'),
            datetime.datetime.strptime(bill['FechaFin'], '%d/%m/%Y').strftime('%Y-%m-%d'),
            datetime.datetime.strptime(bill['FechaInicio'], '%d/%m/%Y').strftime('%Y-%m-%d'),
            bill['NumeroFactura'],
          )
   mycursor.execute(sql, val)
   mydb.commit()

   sql = """
            SELECT id
            FROM facturas
            WHERE id_cliente = %s
            AND comercializadora = %s
            AND distribuidora = %s
            AND fecha_cargo = %s
            AND fecha_emision = %s
            AND fecha_fin = %s
            AND fecha_inicio = %s
            AND numero_factura = %s
         """
   mycursor.execute(sql, val)

   myresult = mycursor.fetchone()

   return myresult[0]


def insert_amount(amount, bill_id):  
   sql = """
            INSERT INTO importes
            (
               id_factura,
               importe_alquiler_equipos,
               importe_descuento,
               importe_energia_consumida,
               importe_impuestos,
               importe_otros,
               importe_potencia_contratada,
               importe_subtotal,
               importe_total
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
         """
   val = (
            bill_id,
            amount["ImporteAlquilerEquipos"],
            amount["ImporteDescuento"],
            amount["ImporteEnergiaConsumida"],
            amount["ImporteImpuestos"],
            amount["ImporteOtros"],
            amount["ImportePotenciaContratada"],
            amount["ImporteSubTotal"],
            amount["ImporteTotal"],
          )
   mycursor.execute(sql, val)
   mydb.commit()


def insert_consumption(consumption, bill_id):  
   sql = """
            INSERT INTO consumos
            (
               id_factura,
               consumo_actual,
               consumo_anterior,
               lectura_actual,
               lectura_anterior
            )
            VALUES (%s, %s, %s, %s, %s);
         """
   val = (
            bill_id,
            consumption["ConsumoActual"],
            consumption["ConsumoAnterior"],
            consumption["LecturaActual"],
            consumption["LecturaAnterior"],
          )
   mycursor.execute(sql, val)
   mydb.commit()


if __name__ == '__main__':   
   if len(sys.argv) > 2:        # 0: script name, 1: bill file, 2: directory
  
      template = sys.argv[1]
      directory = sys.argv[2]
      
      Nclientes = 5
      Nfacturas = 10

      nombres = open("nombres.txt").readlines()
      apellidos = open("apellidos.txt").readlines()
      comercializadoras = [line.replace('\n', '') for line in open("comercializadora.txt").readlines()] 
      distribuidoras = open("distribuidora.txt").readlines()
      poblaciones = open("poblaciones.txt").readlines()
      calles = open("calles.txt").readlines()
                                  
      result={}

      for c in range(Nclientes):
         result['Nombre'] = (random.choice(nombres)).replace('\n','')
         result['Apellido1'] = (random.choice(apellidos)).replace('\n','')
         result['Apellido2'] = (random.choice(apellidos)).replace('\n','')
         result['NIF'] = str(random.randint(10**7, 10**8-1)) + \
                         random.choice(string.ascii_uppercase)
         result['Direccion'] = (random.choice(calles)).replace('\n','')
         result['Comercializadora'] = random.choice(comercializadoras).split(";")[1]
         result['Distribuidora'] = (random.choice(distribuidoras).split(";")[2]).replace('\n','')
         poblacion = random.choice(poblaciones).split(";")
         result['CP'] = poblacion[2].replace('"','').replace('\n','')
         result['Poblacion'] = poblacion[1].replace('"','')
         result['Provincia'] = poblacion[0].replace('"','') 
         result['CUPS'] = 'ES' + str(random.randint(10**15, 10**16-1))
         letters = string.ascii_uppercase
         result['CUPS'] += ''.join(random.choice(letters) for i in range(4))
         result['NumeroContador'] = str(random.randint(10**12, 10**13-1))
         result['PotenciaContratada'] = random.choice([2.00, 2.50, 3.00, 3.50, 4.00, 4.50, 5.00, 5.50])
         result['PeajeAcceso'] = random.choice(['2.0A', '20DHA'])
         
         fechainicio = random_date("01/01/1990", "31/12/2019")
         month_time = 2592000
         day_time = 86400
         
         lectura_anterior = random.randint(0,100000)
         consumo_anterior = random.randint(0,7000)

         insert_customer(result)
         
         for f in range(Nfacturas):

            result['FechaInicio'] = \
               time.strftime(format, time.localtime(fechainicio))
            result['FechaFin'] = \
               time.strftime(format, time.localtime(fechainicio+2*month_time))
            result['FinContrato'] = \
               time.strftime(format, time.localtime(fechainicio+2*month_time))
            result['FechaEmision'] = \
               time.strftime(format, time.localtime(fechainicio+2*month_time+2*day_time))
            result['FechaCargo'] = \
               time.strftime(format, time.localtime(fechainicio+2*month_time+5*day_time))
            result['NumeroFactura'] = \
               'FI' + str(random.randint(10**9, 10**10-1))

            fechainicio += 2*month_time
     
            result['ImportePotenciaContratada'] = \
               Decimal(random.random()*50).quantize(Decimal('.01'), rounding=ROUND_UP)  
            result['ImporteEnergiaConsumida'] = \
               Decimal(random.random()*300).quantize(Decimal('.01'), rounding=ROUND_UP) 
            result['ImporteAlquilerEquipos'] = \
               Decimal(random.choice([0.50, 0.83, 0.97, 1.10, 1.30, 1.50, 2.00, 2.10])).quantize(Decimal('.01'), rounding=ROUND_UP) 
            result['ImporteOtros'] = \
               Decimal(random.random()*20).quantize(Decimal('.01'), rounding=ROUND_UP) 
            result['ImporteDescuento'] = \
               - Decimal(random.random()*10).quantize(Decimal('.01'), rounding=ROUND_UP) 
            subtotal = result['ImportePotenciaContratada'] + \
                       result['ImporteEnergiaConsumida'] + \
                       result['ImporteAlquilerEquipos'] + \
                       result['ImporteOtros'] + result['ImporteDescuento']
            result['ImporteSubTotal'] = Decimal(subtotal).quantize(Decimal('.01'), rounding=ROUND_UP)
            impuesto = subtotal * Decimal(random.choice([0.02, 0.03, 0.07, 0.1]))
            result['ImporteImpuestos'] = \
               Decimal(impuesto).quantize(Decimal('.01'), rounding=ROUND_UP) 
            result['ImporteTotal'] = \
               Decimal(subtotal + result['ImporteImpuestos']).quantize(Decimal('.01'), rounding=ROUND_UP) 
                 
            result['LecturaAnterior'] = lectura_anterior
            result['LecturaActual'] = lectura_anterior + random.randint(0,1000)
            #result['LecturaActualPunta']
            #result['LecturaActualValle']
            #result['LecturaAnteriorPunta']
            #result['LecturaAnteriorValle']

            result['ConsumoAnterior'] = consumo_anterior
            result['ConsumoActual'] = result['LecturaActual'] - lectura_anterior
            #result['ConsumoActualPunta']
            #result['ConsumoActualValle']
            #result['ConsumoAnteriorPunta']
            #result['ConsumoAnteriorValle']
            result['ConsumoTotal'] = result['ConsumoActual']
            
            lectura_anterior = result['LecturaActual']
            consumo_anterior = result['ConsumoActual']
            
            #create the 
            # fill_template(template, directory, result, c, f)
            

            # out_str = pprint.pformat(result)
            # file_name = directory + "/labels_" + str(c) + "_" + str(f) + ".txt"
            # open(file_name,"w").write(out_str)

            insert_contract(result, c + 1)
            bill_id = insert_bill(result, c + 1)
            insert_amount(result, bill_id)
            insert_consumption(result, bill_id)
   else:
      print ("\nSimulación facturas: Numero insuficiente de parametros.\n")
      
   
   

      
