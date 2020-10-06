from flask_restful import Resource, reqparse
from flask import jsonify, request
from werkzeug.utils import secure_filename 
from common import db
import os

parser = reqparse.RequestParser()

# config app for files
upload_path = "static/server"
supported_file_types = {
                        'txt': 'text/', 'pdf': 'pdf/',
                        'py': 'code/', 'java': 'code/', 'html': 'code/',
                        'png': 'image/', 'jpg': 'image/', 'jpeg': 'image/',
                        'csv': 'data/',
                        'zip': 'other/' 
                       }

# helper functions for POST
def supported_file(file_name):
        return '.' in file_name and file_name.rsplit('.', 1)[1].lower() in supported_file_types 

def file_ext(file_name):
    return file_name.rsplit('.', 1)[1].lower()

class documents(Resource):
    def get(self):


        parser.add_argument('key', type=str, help="key is needed to access documents")
        parser.add_argument('user', type=str)
        args = parser.parse_args()

        try:

            conn = db.mysql.connect()
            cursor = conn.cursor()

            if(args['key'] is not None):
                # cursor = conn.cursor()
                query = "SELECT document_name, date, uuid_id FROM documents WHERE uuid_id = %s"
                documents = cursor.execute(query, args['key'])
                
                if(documents > 0):
                    payload = []
                    resp = cursor.fetchall()
                    for result in resp:
                        content = {"document_name": result[0], "date": result[1], "uuid_id": result[2]}
                        payload.append(content)

                    # cursor.close()
                    print(payload)
                    return jsonify(payload)
                else:
                    # cursor.close()
                    return "invalid key", 400
            elif(args['user'] is not None):
                #get all documents owned by user id
                # cursor = conn.cursor()
                query = "SELECT doc_uuid FROM user_documents WHERE user_id = %s"
                doc_ids = cursor.execute(query, args['user'])

                if(doc_ids > 0):
                    print(doc_ids)
                    payload = []
                    resp = cursor.fetchall()
                    for result in resp:
                        content = {"doc_id": result[0]}
                        payload.append(content)
                    
                    # cursor.close()

                    return jsonify(payload)
            else:
                
                return "no user or key submitted", 400
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()

    def post(self):
        parser.add_argument('user', type=str)
        args = parser.parse_args()

        try:
            conn = db.mysql.connect()
            
            try:
                cursor = conn.cursor()

                if args['user'] is not None:
                    file_to_upload = request.files["file"]
                    file_name = file_to_upload.filename

                    # check if the file is a supported type and save to folder
                    if supported_file(file_name):
                        ext = file_ext(file_name)
                        folder = supported_file_types[ext]
                        location = upload_path + '/' + folder
                        
                        # INSERT file data into DB to generate uuid
                        insert = 'INSERT INTO documents (directory_loc, document_name, date, public) VALUES (%s, %s, NOW(), %s)'
                        values = (location, file_name, 1)
                        cursor.execute(insert, values)
                        conn.commit()

                        # SELECT for the uuid
                        query = 'SELECT uuid_id FROM documents WHERE (directory_loc = %s AND document_name = %s)'
                        values = (location, file_name)
                        cursor.execute(query, values)
                        response = cursor.fetchall()[0]
                        uuid = response[0]

                        # save file to server
                        file_to_upload.save(os.path.join(upload_path, folder + uuid + '.' + ext))
                        
                        return {
                                'data': uuid + '.' + ext,
                                'location': upload_path + '/' + folder,
                                'message': 'file uploaded'
                            }

                    else:

                        return 'unsupported file type', 400
                
                else:
                    return 'no user submitted', 400
                    
            except:
                print('QUERY FAILED')
            
            finally:
                conn.close()

            

        except Exception as e:
            print(e)

        