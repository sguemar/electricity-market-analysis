#!/usr/bin/python

import re, sys, json


def extract_data(file_txt, file_fields):

   # read the text file
   with open(file_txt, 'r', encoding="utf-8") as file:
      contents=file.read()
   
   #read the labels to search
   labels=eval(str(open(file_fields, 'r', encoding="utf-8").read()))
   results={}
   
   #search for the fields in the text
   for field in labels.keys():
      results[field]=list()
      for label in labels[field]:
         search = re.search(label, contents, flags=re.IGNORECASE)
         if search:
             results[field].append(search.group(1))

   return results


if __name__ == '__main__':   
#python extract_data.py factura1_tesseract.txt output.txt static/FieldMatch_v2.txt
   
   if len(sys.argv) > 3 :        # 0: script name, 1: input file, 2: output file, 3: pattern file. 
      input_txt   = sys.argv[1]
      output_txt  = sys.argv[2]
      file_fields = sys.argv[3]  # 3'static/FieldMatch_v2.txt'
      
      results = extract_data(input_txt, file_fields)
            
      json = json.dumps( results )
      
      f = open(output_txt,"w")
      f.write(json)
      f.close()
       
   else:
      print ("\nEXTRACT_DATA: Numero insuficiente de parametros.\n")
