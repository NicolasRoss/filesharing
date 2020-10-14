from flask_restful import Resource, reqparse
from flask import jsonify, request
from datetime import datetime, date
from common import db
import werkzeug
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
        try:
            conn = db.mysql.connect()

            try:
                cursor = conn.cursor()
                parser.add_argument('user', type=str)
                args = parser.parse_args()
                user_id = args['user']

                if(user_id is not None):
                    # get all documents owned by user id
                    query = "SELECT uuid_id, directory_loc, document_name, date, public FROM documents WHERE user_id = %s"
                    doc_ids = cursor.execute(query, user_id)

                    if(doc_ids > 0):
                        payload = []
                        resp = cursor.fetchall()

                        for result in resp:
                            # print(result)
                            content = {
                                "doc_id": result[0],
                                "location": result[1],
                                "file_name": result[2],
                                "date": result[3],
                                "status": result[4]
                                }
                            payload.append(content)

                        return jsonify(payload)
                        
                else:
                    return "no user or key submitted", 400

            except:
                print('QUERY FAILED')

            finally:
                conn.close()
            
        except Exception as e:
            print(e)



    def post(self):
        try:
            conn = db.mysql.connect()

            try:
                cursor = conn.cursor()
                parser.add_argument('user', type=str)
                parser.add_argument('action', type=str)
                args = parser.parse_args()

                user_id = args['user']
                action = args['action']

                if user_id is not None and action == "insert":
                    parser.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')
                    args = parser.parse_args()
                    file_to_upload = args["file"]
                    file_name = file_to_upload.filename
                    
                    # check if the file is a supported type and save to folder
                    if supported_file(file_name):
                        ext = file_ext(file_name)
                        folder = supported_file_types[ext]
                        location = upload_path + '/' + folder
                        date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                        # INSERT file data into DB to generate uuid
                        insert = 'INSERT INTO documents (user_id, directory_loc, document_name, date, public) VALUES (%s, %s, %s, %s, %s)'
                        values = (user_id, location, file_name, date, 1)
                        cursor.execute(insert, values)
                        conn.commit()

                        # SELECT for the uuid
                        query = 'SELECT uuid_id FROM documents WHERE (user_id=%s AND directory_loc=%s AND document_name=%s AND date=%s)'
                        values = (user_id, location, file_name, date)
                        cursor.execute(query, values)
                        response = cursor.fetchall()[0]
                        uuid = response[0]

                        # # save file to server
                        file_to_upload.save(os.path.join(upload_path, folder + uuid + '.' + ext))
                        
                        return {
                                'data': uuid + '.' + ext,
                                'location': upload_path + '/' + folder,
                                'message': 'file uploaded'
                            }

                    else:
                        return 'unsupported file type', 400
                
                elif user_id is not None and action == "delete":
                    parser.add_argument('uuid', location='json')
                    parser.add_argument('name', location='json')
                    parser.add_argument('date', location='json')
                    parser.add_argument('path', location='json')
                    args = parser.parse_args()

                    uuid = args['uuid']
                    path = args['path']
                    file_name = args['name']
                    date = datetime.strptime(args['date'], '%a, %d %b %Y %H:%M:%S %Z')

                    # DELETE from DB
                    delete = 'DELETE FROM documents WHERE (user_id=%s AND uuid_id=%s AND directory_loc=%s AND document_name=%s AND date=%s)'
                    values = (user_id, uuid, path, file_name, date)
                    cursor.execute(delete, values)
                    conn.commit()

                    # DELETE from server
                    file_loc = args['path'] + args['uuid'] + '.' + file_ext(args['name'])
                    os.remove(file_loc)
                    
                    return {
                                'name': args['name'],
                                'message': 'file removed'
                            }

                else:
                    return 'no user submitted', 400
            except Exception as e:
                print(e)
            # except:
            #     print('QUERY FAILED')
            
            finally:
                conn.close()

        except Exception as e:
            print(e)

        