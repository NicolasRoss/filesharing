from app import app
from flask import render_template, make_response, request
from flask_restful import Resource
from flask import jsonify
import os

# path for files to be saved to
app.config["UPLOADS"] = "static/server"

class upload(Resource):
    def get(self):
        return make_response(render_template('upload_page.html'))


    '''
    TODO add more file types to save and data like file size, date uploaded
    '''
    # add files to server
    def post(self):
        file_to_upload = request.files["file"]
        print(file_to_upload)
        #add text based files
        if file_to_upload.content_type.startswith("text/"):
            file_to_upload.save(os.path.join(app.config["UPLOADS"], 'text/' + file_to_upload.filename))
            
            return {
                    'data': file_to_upload.filename,
                    'message': 'file uploaded'
                   }

        else:

            return 'invalid file type', 400