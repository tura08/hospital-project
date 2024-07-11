from flask import Blueprint, request, jsonify
from app import db
from app.models import Ward, Operation
from datetime import datetime, timedelta

main = Blueprint('main', __name__)

@main.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'UP'})

@main.route('/wards', methods=['GET', 'POST', 'DELETE', 'PUT'])
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
        ward_id = request.json.get('id')
        ward = Ward.query.get(ward_id)
        if ward:
            if ward.operations:
                return jsonify({'error': 'Ward has scheduled operations and cannot be deleted'}), 400
            db.session.delete(ward)
            db.session.commit()
            return jsonify({'message': 'Ward deleted successfully!'}), 200
        return jsonify({'error': 'Ward not found'}), 404
    elif request.method == 'PUT':
        ward_id = request.json.get('id')
        ward_name = request.json.get('name')
        ward = Ward.query.get(ward_id)
        if ward and ward_name:
            ward.name = ward_name
            db.session.commit()
            return jsonify({'message':'Ward updated successfully!'}), 200
        return jsonify({'error': 'Invalid data or Ward not found'}), 400

@main.route('/operations', methods=['GET', 'POST', 'DELETE', 'PUT'])
def manage_operations():
    if request.method == 'GET':
        operations = Operation.query.all()
        return jsonify([{
            'id': op.id,
            'ward_id': op.ward_id,
            'ward_name': op.ward.name, 
            'patient_name': op.patient_name,
            'start_time': op.start_time.isoformat(),
            'end_time': op.end_time.isoformat()
        } for op in operations])
    elif request.method == 'POST':
        operation = request.json
        ward_id = operation.get('ward_id')
        patient_name = operation.get('patient_name')
        start_time = datetime.fromisoformat(operation.get('start_time'))
        end_time = datetime.fromisoformat(operation.get('end_time'))

        # Check if the duration is at least 30 minutes
        if end_time - start_time < timedelta(minutes=30):
            return jsonify({'error': 'Operation duration must be at least 30 minutes'}), 400

        if ward_id and patient_name and start_time and end_time:
            for op in Operation.query.filter_by(ward_id=ward_id).all():
                if (start_time >= op.start_time and start_time < op.end_time) or (
                        end_time > op.start_time and end_time <= op.end_time):
                    return jsonify({'error': 'Ward is double booked'}), 400

            new_operation = Operation(ward_id=ward_id, patient_name=patient_name,
                                      start_time=start_time, end_time=end_time)
            db.session.add(new_operation)
            db.session.commit()
            return jsonify({'message': 'Operation scheduled successfully!'}), 201
        return jsonify({'error': 'Invalid data'}), 400
    elif request.method == 'DELETE':
        operation_id = request.json.get('id')
        operation = Operation.query.get(operation_id)
        if operation:
            db.session.delete(operation)
            db.session.commit()
            return jsonify({'message': 'Operation deleted successfully!'}), 200
        return jsonify({'error': 'Operation not found'}), 404
    elif request.method == 'PUT':
        operation_id = request.json.get('id')
        ward_id = request.json.get('ward_id')
        patient_name = request.json.get('patient_name')
        start_time = datetime.fromisoformat(request.json.get('start_time'))
        end_time = datetime.fromisoformat(request.json.get('end_time'))

        operation = Operation.query.get(operation_id)
        
        # Check if the duration is at least 30 minutes
        if end_time - start_time < timedelta(minutes=30):
            return jsonify({'error': 'Operation duration must be at least 30 minutes'}), 400

        if operation and ward_id and patient_name and start_time and end_time:
            for op in Operation.query.filter_by(ward_id=ward_id).all():
                if op.id != operation_id and (
                        (start_time >= op.start_time and start_time < op.end_time) or (
                        end_time > op.start_time and end_time <= op.end_time)):
                    return jsonify({'error': 'Ward is double booked'}), 400

            operation.ward_id = ward_id
            operation.patient_name = patient_name
            operation.start_time = start_time
            operation.end_time = end_time

            db.session.commit()
            return jsonify({'message': 'Operation updated successfully!'}), 200
        return jsonify({'error': 'Invalid data or Operation not found'}), 400
