from app import app
from flask_restful import Api
from flask_cors import CORS
from resources.documents import documents
from resources.download import download
from resources.users import users
from resources.link import link

api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

api.add_resource(documents, '/api/documents')
api.add_resource(users, '/api/users')
api.add_resource(download, '/api/download')
api.add_resource(link, '/api/link')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)