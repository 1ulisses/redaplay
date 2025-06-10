from flask import Flask, render_template, request, redirect
from models import db, Client, Order

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///<nome>.db'
db.init_app(app)

with app.app_context():
    db.create_all()
    db.session.commit()
    
if __name__ == '__main__':
    app.run(debug=True)