from app import db

class Ward(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

class Operation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ward_id = db.Column(db.Integer, db.ForeignKey('ward.id', ondelete='CASCADE'), nullable=False)
    patient_name = db.Column(db.String(100), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)

    ward = db.relationship('Ward', back_populates='operations', passive_deletes=True)

Ward.operations = db.relationship('Operation', order_by=Operation.id, back_populates='ward', cascade='all, delete-orphan')
