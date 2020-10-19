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
                print("test1")
                
                if(args['email'] is not None and args['pass'] is not None):
                    query = "SELECT user_id, name FROM users WHERE email = %s AND password = SHA2(%s, 256)"
                    tup = (args['email'], args['pass'])
                    user_id = cursor.execute(query, tup)
                    print("curs executed")

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

        return({"get":"success"})

        

        
    def post(self):
        parser.add_argument('email', type=str)
        parser.add_argument('pass', type=str)
        parser.add_argument('name', type=str)
        args = parser.parse_args()

        try:
            conn = db.mysql.connect()
            cursor = conn.cursor()
            print(args['pass'])
            print(args['email'])
            if(args['email'] is not None and args['pass'] is not None and args['name'] is not None):
                #validate email and pass here
                query = "INSERT INTO users (email, password, name) VALUES (%s, SHA2(%s, 256), %s);"
                tup = (args['email'], args['pass'], args['name'])
                print(tup)
                print(query.format(tup))
                d = cursor.execute(query, tup)
                conn.commit()
                user_id = cursor.execute("SELECT user_id, name FROM users WHERE user_id = LAST_INSERT_ID()")
                
                if(user_id > 0):
                    resp = cursor.fetchall()
                    print(resp[0])
                    return({"user_id": resp[0][0], "name": resp[0][1]})
                else:
                    return {"user_id": "-1"}
            else:
                return "user pass, name not submitted", 400
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()


    def put(self):
        # parser.add_argument('pass', type=str)
        parser.add_argument('newPass', type=str)
        parser.add_argument('user_id', type=str)
        args = parser.parse_args()

        try:
            conn = db.mysql.connect()
            cursor = conn.cursor()
            if(args['newPass'] is not None and args['user_id'] is not None):
                query = "UPDATE users SET password = SHA2(%s, 256) WHERE user_id = %s"
                tup = (args['newPass'], args['user_id'])
                d = cursor.execute(query, tup)
                conn.commit()
                print(d)
                return {"request": "success"}
        except Exception as e:
            print(e)
        finally:
            cursor.close()
            conn.close()
                
