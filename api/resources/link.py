from flask_restful import Resource, reqparse
from flask import send_from_directory, jsonify

from datetime import datetime, timedelta
from common import db
import uuid
import os

parser = reqparse.RequestParser()

# helpers
def file_ext(file_name):
    return file_name.rsplit('.', 1)[1].lower()

class link(Resource):

    def get(self):
        try:
            conn = db.mysql.connect()

            try:
                cursor = conn.cursor()
                parser.add_argument('link_id', type=str)
                parser.add_argument('getAttributes', type=str)
                args = parser.parse_args()

                link_id = args['link_id'] 


                # check DB to see if link has expired
                query = "SELECT expire_date, directory_loc, document_name, doc_id FROM links WHERE (link_id=%s)"
                cursor.execute(query, (link_id))
                response = cursor.fetchall()

                if response != ():
                    current_date = datetime.now()
                    expire_date = response[0][0]
                    directory = response[0][1]
                    file_name = response[0][2]
                    doc_id = response[0][3]

                    if current_date < expire_date:
                        content = {
                            "current_date": current_date,
                            "expire_date": expire_date,
                            "file_name": file_name,
                            "doc_id": doc_id,
                            "directory": directory
                            }
                        return jsonify(content)
                    
                    else:
                        return 'link expired', 404
                
                else:
                    return "link not found", 404

            except:
                print('QUERY FAILED')
                return {}, 400

            finally:
                conn.close()
            
        except Exception as e:
            print(e)
            return {}, 400
            

    def post(self):
        try:
            conn = db.mysql.connect()

            try:
                cursor = conn.cursor()
                parser.add_argument('user', type=str)
                args = parser.parse_args()

                user_id = args['user']
                if user_id is not None:
                    parser.add_argument('uuid', location='json')
                    parser.add_argument('name', location='json')
                    parser.add_argument('path', location='json')
                    args = parser.parse_args()
                    
                    
                    path = args['path']
                    file_name = args['name']
                    doc_id = args['uuid']
                    expire_date = datetime.now() + timedelta(1) # 24hr expiry date on link
                    link_id = uuid.uuid4() # link random uuid

                    # generate temporary link and store info in the DB
                    insert = 'INSERT INTO links (link_id, expire_date, directory_loc, document_name, doc_id) VALUES (%s, %s, %s, %s, %s)'
                    values = (str(link_id), expire_date, path, file_name, doc_id)
                    cursor.execute(insert, values)
                    conn.commit()

                    return "/Share?link_id=%(link_id)s" % {
                                "link_id": link_id,
                    }
            
            except:
                print('QUERY FAILED')
                return {}, 400

            finally:
                conn.close()
            
        except Exception as e:
            print(e)
            return {}, 400

