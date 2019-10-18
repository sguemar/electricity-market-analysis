import subprocess, uuid, os, pprint, sys
from shutil import copyfile
from extract_data import extract_data


def process_bill(file_bill, type):

   file_txt = '/tmp/' + str(uuid.uuid4())
   results  = {}

   if type == 'pdf':
      #convert pdf to text
      subprocess.call(['pdftotext', file_bill, file_txt + '.txt', '-raw'])
   else:
      if type == 'txt':
         #if it is a txt file just copy to destiny
         copyfile(file_bill, file_txt + '.txt')
      else:
         #convert image to text
         subprocess.call(['tesseract', file_bill, file_txt, 
                          '--oem', '1', '-l', 'spa'])   
   
   file_txt = file_txt + '.txt'

   blocks = {
      'Datos del cliente': 'datos_cliente.txt', 
      'Datos del contrato': 'datos_contrato.txt', 
      'Datos de la factura': 'datos_factura.txt', 
      'Importes': 'resumen_factura.txt', 
      'Información de consumo': 'info_consumo.txt'
   }
   
   for fields in blocks: 
      
      dir_path = os.path.dirname(os.path.realpath(__file__))
      file_fields = os.path.join(dir_path,'static/FieldMatch_'+ blocks[fields]) 
      
      out = extract_data(file_txt, file_fields)
      
      results[fields] = out
   
   os.remove(file_txt)

   return results


if __name__ == '__main__':   
   if len(sys.argv) > 1 :        # 0: script name, 1: input file. 
      file_bill  = sys.argv[1]
      
      type = os.path.splitext(file_bill)[1][1:].lower()
      
      results = process_bill(file_bill, type)
            
      out_str = pprint.pformat(results)
      
      print(out_str)
       
   else:
      print ("\nProcess bill: Numero insuficiente de parametros.\n")
