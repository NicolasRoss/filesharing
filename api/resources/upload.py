from flask import jsonify, render_template, make_response, request
from flask_restful import Resource
from werkzeug.utils import secure_filename 
import os

# config app for files
upload_path = "static/server"
max_file_size = 16 * 1024 * 1024 # 16MB max-limit
supported_file_types = {
                        'txt': 'text/', 'pdf': 'pdf/',
                        'py': 'code/', 'java': 'code/', 'html': 'code/',
                        'png': 'image/', 'jpg': 'image/', 'jpeg': 'image/',
                        'csv': 'data/',
                        'zip': 'other/' 
                       }

def supported_file(file_name):
        return '.' in file_name and file_name.rsplit('.', 1)[1].lower() in supported_file_types 

def file_ext(file_name):
    return file_name.rsplit('.', 1)[1].lower()

class upload(Resource):
    def get(self):
        return make_response(render_template('upload_page.html'))

    # add files to server
    def post(self):
        if request.content_length < max_file_size:
            file_to_upload = request.files["file"]
            file_name = file_to_upload.filename

            # check if the file is a supported type and save to folder
            if supported_file(file_name):
                ext = file_ext(file_name)
                folder = supported_file_types[ext]
                file_to_upload.save(os.path.join(upload_path, folder + file_name))
                
                return {
                        'data': file_name,
                        'location': upload_path + folder,
                        'file_type': ext,
                        'message': 'file uploaded'
                    }

            else:

                return 'unsupported file type', 400
        
        else:
            return 'file to large', 413