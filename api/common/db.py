from app import app
from flaskext.mysql import MySQL

mysql = MySQL()

#setup for mysql database local testing
app.config['MYSQL_DATABASE_USER'] = 'docs'
app.config['MYSQL_DATABASE_PASSWORD'] = 'docs'
app.config['MYSQL_DATABASE_DB'] = 'docs'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql.init_app(app)
