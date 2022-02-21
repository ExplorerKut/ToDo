from flask_sqlalchemy import SQLAlchemy
from app import db
class Task(db.Model):
    id=db.Column(db.String(100),primary_key=True,nullable=False)
    description= db.Column(db.String(100),nullable=False)
    status= db.Column(db.Boolean,nullable=False)
    date_created=db.Column(db.DateTime(),nullable=False)
    date_completed=db.Column(db.DateTime(), nullable=True)

    def __init__(self,id,description,status,date_created):
        self.id=id
        self.description=description
        self.status=status
        self.date_created=date_created