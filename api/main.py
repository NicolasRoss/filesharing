from app import app
from flask_restful import Api
from flask_cors import CORS
from resources.documents import documents
from resources.users import users

api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

api.add_resource(documents, '/documents')
api.add_resource(users, '/users')

if __name__ == "__main__":
    app.run(debug=True)