from app import app
from flask_restful import Api
from flask_cors import CORS
from resources.home import home
from resources.documents import documents
from resources.users import users
from resources.upload import upload

api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
api.add_resource(home, '/')
api.add_resource(documents, '/documents')
api.add_resource(upload, '/upload')
api.add_resource(users, '/users')

if __name__ == "__main__":
    app.debug= True
    
    app.run(debug=True)