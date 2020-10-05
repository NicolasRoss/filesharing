from app import app
from flaskext.mysql import MySQL

mysql = MySQL()

#setup for mysql database local testing
app.config['MYSQL_DATABASE_USER'] = 'docs'
app.config['MYSQL_DATABASE_PASSWORD'] = 'Filesharing123'
app.config['MYSQL_DATABASE_DB'] = 'docs'
app.config['MYSQL_DATABASE_HOST'] = 'documents.ckb7qqal4m5l.us-east-2.rds.amazonaws.com'

mysql.init_app(app)
