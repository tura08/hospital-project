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

@main.route('/operations', methods=['GET', 'POST', 'DELETE'])
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

        # Checks for booking operations
        if end_time - start_time > timedelta(hours=12):
            return jsonify({'error': 'Operation cannot exceed 12 hours'}), 400
        if start_time < datetime.now() + timedelta(hours=12):
            return jsonify({'error': "Operation must be booked at least 12 hours in advance"}), 400
        if start_time < datetime.now():
            return jsonify({'error': "Operation cannot be scheduled in the past"}), 400
        if end_time - start_time < timedelta(minutes=30):
            return jsonify({'error': 'Operation duration must be at least 30 minutes'}), 400

        # Calculate the total scheduled time for the ward on the given day
        start_of_day = start_time.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)

        total_scheduled_time = db.session.query(db.func.sum(Operation.end_time - Operation.start_time)).filter(
            Operation.ward_id == ward_id,
            Operation.start_time >= start_of_day,
            Operation.end_time <= end_of_day
        ).scalar() or timedelta()

        # Check if adding the new operation exceeds 12 hours
        if total_scheduled_time + (end_time - start_time) > timedelta(hours=12):
            return jsonify({'error': 'Total scheduled operation time for the ward exceeds 12 hours in a day'}), 400

        if ward_id and patient_name and start_time and end_time:
            overlap_query = db.session.query(Operation).filter(
                Operation.ward_id == ward_id,
                Operation.start_time < end_time,
                Operation.end_time > start_time
            ).exists()
            overlap_exists = db.session.query(overlap_query).scalar()
            if overlap_exists:
                return jsonify({'error': 'Ward is double booked'}), 400

            new_operation = Operation(ward_id=ward_id, patient_name=patient_name, start_time=start_time, end_time=end_time)
            db.session.add(new_operation)
            db.session.commit()
            return jsonify({'message': "Operation scheduled successfully."}), 201
        return jsonify({'error': 'Invalid data'}), 400
    elif request.method == 'DELETE':
        operation_id = request.json.get('id')
        operation = Operation.query.get(operation_id)
        if operation:
            db.session.delete(operation)
            db.session.commit()
            return jsonify({'message': 'Operation deleted successfully!'}), 200
        return jsonify({'error': 'Operation not found'}), 404