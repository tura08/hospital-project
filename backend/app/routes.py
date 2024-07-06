from flask import Blueprint, request, jsonify
from app import db
from app.models import Ward, Operation
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'UP'})

@main.route('/wards', methods=['GET', 'POST', 'DELETE'])
def manage_wards():
    if request.method == 'GET':
        wards = Ward.query.all()
        return jsonify([{'id': ward.id, 'name': ward.name} for ward in wards])
    elif request.method == 'POST':
        ward_name = request.json.get('name')
        if ward_name:
            new_ward = Ward(name=ward_name)
            db.session.add(new_ward)
            db.session.commit()
            return jsonify({'message': 'Ward added successfully!'}), 201
        return jsonify({'error': 'Invalid data'}), 400
    elif request.method == 'DELETE':
        ward_name = request.json.get('name')
        ward = Ward.query.filter_by(name=ward_name).first()
        if ward:
            db.session.delete(ward)
            db.session.commit()
            return jsonify({'message': 'Ward deleted successfully!'}), 200
        return jsonify({'error': 'Ward not found'}), 404

@main.route('/operations', methods=['GET', 'POST'])
def manage_operations():
    if request.method == 'GET':
        operations = Operation.query.all()
        return jsonify([
            {
                'id': operation.id,
                'ward_id': operation.ward_id,
                'patient_name': operation.patient_name,
                'start_time': operation.start_time.isoformat(),
                'end_time': operation.end_time.isoformat()
            } for operation in operations
        ])
    elif request.method == 'POST':
        operation = request.json
        ward_id = operation.get('ward_id')
        patient_name = operation.get('patient_name')
        start_time = datetime.fromisoformat(operation.get('start_time'))
        end_time = datetime.fromisoformat(operation.get('end_time'))

        if ward_id and patient_name and start_time and end_time:
            for op in Operation.query.filter_by(ward_id=ward_id).all():
                if (start_time >= op.start_time and start_time < op.end_time) or (
                        end_time > op.start_time and end_time <= op.end_time):
                    return jsonify({'error': 'Ward is double booked'}), 400

            new_operation = Operation(
                ward_id=ward_id, patient_name=patient_name,
                start_time=start_time, end_time=end_time
            )
            db.session.add(new_operation)
            db.session.commit()
            return jsonify({'message': 'Operation scheduled successfully!'}), 201
        return jsonify({'error': 'Invalid data'}), 400
