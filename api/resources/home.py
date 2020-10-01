from flask_restful import Resource

class home(Resource):
    def get(self):
        return {"value": "never should've came here, adventurer"}