from flask_sqlalchemy import SQLAlchemy
from app import db
class Task(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    description= db.Column(db.String(50))
    status= db.Column(db.Boolean)

    def __init__(self,id,description,status):
        self.id=id
        self.description=description
        self.status=status