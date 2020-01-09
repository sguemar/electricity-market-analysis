from flask import Flask, jsonify, render_template, request, redirect
from flask_debug import Debug
from datetime import datetime
import sys, pprint, os, uuid, json
import docreco 

app = Flask(__name__)
Debug(app)
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = '/tmp'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.run(debug=True)

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
   return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/uploads/<path:path>')
def send_js(path):
    return send_from_directory('uploads', path)


@app.route('/', defaults={'js': 'jquery'})
@app.route('/<any(jquery):js>')
def index(js):
    print ("init.hmtl rendering")    
    return render_template('{0}.html'.format(js), js=js)


def xml_format(result):
   output_string="<bill>\n"
   
   for block in result:
      output_string += " <group>\n" 
      output_string += "  <name>" + block + "</name>\n"
      
      for field in result[block]:
         output_string += "  <field>\n" 
         output_string += "   <name>" + field + "</name>\n"
         output_string += "   <value>" + str(result[block][field]) + "</value>\n"
         output_string += "  </field>\n"
         
      output_string +=" </group>\n"

   output_string += "</bill>\n"
      
   return output_string
         
      

@app.route('/process_bill', methods=['POST'])
def process_bill():
   
   if request.method == 'POST':
      # check if the post request has the file part
      if 'filename' not in request.files:
         return jsonify(result='Filename field is not in the HTTP request. \n')

      file = request.files['filename']

      if file.filename == '':
         return jsonify(result='Filename empty. \n')

      if file and allowed_file(file.filename):
         #save file to upload directory with a hash code
         file_extension = file.filename.rsplit('.', 1)[1].lower()
         filename = str(uuid.uuid4()) + "." + file_extension

         bill_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
         file.save(bill_path)
         
         #information extraction from the bill
         results = docreco.process_bill(bill_path, file_extension)

         # Delete the bill uploaded
         os.remove(bill_path)  

         out_str = pprint.pformat(results)
         # print(xml_format(results))
         
         log = open("/var/www/access_log.txt", "a")
         log.write(str(datetime.now()) + ": " + request.remote_addr + "\n")
         
         return jsonify(result=out_str)
      else:
         return jsonify(result='Error: Allowed file types are txt, pdf, png, jpg, jpeg, gif')

   return jsonify(result='POST Error .')


if __name__ == '__main__':
   port = 2500
   host = "localhost"
   app.run(host=host, port=port)
