from flask_restful import Resource, reqparse
from common import db

parser = reqparse.RequestParser()
# conn = db.mysql.connect()
# cursor = conn.cursor()

class users(Resource):
    
    def get(self):
        parser.add_argument('email', type=str)
        parser.add_argument('pass', type=str)
        args = parser.parse_args()

        try:
            conn = db.mysql.connect()

            try:
                cursor = conn.cursor()
                
                if(args['email'] is not None and args['pass'] is not None):
                    query = "SELECT user_id, name FROM users WHERE email = %s AND password = SHA2(%s, 256)"
                    tup = (args['email'], args['pass'])
                    user_id = cursor.execute(query, tup)

                    if(user_id > 0):
                        resp = cursor.fetchall()
                        print(resp[0][1])
                        return {"user_id": resp[0][0], "name": resp[0][1]}

                    else:
                        return {"user_id": "-1"}

                else:
                    return "no user_id submitted", 400
                
            except:
                print('QUERY FAILED')
            
            finally:
                conn.close()

        except Exception as e:
            print(e)

        

        
    def post(self):
        parser.add_argument('email', type=str)
        parser.add_argument('pass', type=str)
        args = parser.parse_args()

        try:
            conn = db.mysql.connect()
            cursor = conn.cursor()
            print(args['pass'])
            print(args['email'])
            if(args['email'] is not None and args['pass'] is not None):
                #validate email and pass here
                query = "INSERT INTO users (email, password) VALUES (%s, SHA2(%s, 256))"
                tup = (args['email'], args['pass'])
                print(tup)
                print(query.format(tup))
                d = cursor.execute(query, tup)
                conn.commit()
                # cursor.close()
                return {"request": "success"}
            else:
                return "user and pass not submitted", 400
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()