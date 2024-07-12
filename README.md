# Hospital Booking System

This project is a basic hospital management system that includes a backend API built with Flask and SQLAlchemy, and a frontend built with Angular.

## Backend (Flask + SQLAlchemy)

### Prerequisites

- Python 3.8 or higher
- Flask
- Flask-SQLAlchemy

### Setup

1. Create and activate a virtual environment:

\`\`\`sh
python3 -m venv venv
source venv/bin/activate  
\`\`\`

2. Install dependencies:

\`\`\`sh
pip install -r requirements.txt
\`\`\`

3. Run the application:

\`\`\`sh
python3 app.py
flask run
\`\`\`

### API Endpoints

- \`GET /health\` - Health check
- \`GET /wards\` - Get all wards
- \`POST /wards\` - Add a new ward
- \`DELETE /wards\` - Delete a ward
- \`POST /operations\` - Schedule a new operation

## Frontend (Angular)

### Prerequisites

- Node.js 14 or higher
- Angular CLI

### Setup

1. Navigate to the frontend directory:

\`\`\`sh
cd ../frontend
\`\`\`

2. Install dependencies:

\`\`\`sh
npm install
\`\`\`

3. Serve the application:

\`\`\`sh
ng serve
\`\`\`

4. Open your browser and navigate to \`http://localhost:4200\`.

### Components

- \`WardFormComponent\` - Form to add a new ward
- \`WardListComponent\` - List of all wards
- \`OperationFormComponent\` - Form to schedule a new operation

## Database (SQLite)

The project uses SQLite as the database. The database file \`hospital.db\` is created in the backend directory.

### Database Schema

#### Ward Table

| Column | Type    | Description      |
| ------ | ------- | ---------------- |
| id     | Integer | Primary key      |
| name   | String  | Name of the ward |

#### Operation Table

| Column       | Type     | Description               |
| ------------ | -------- | ------------------------- |
| id           | Integer  | Primary key               |
| ward_id      | Integer  | Foreign key to Ward table |
| patient_name | String   | Name of the patient       |
| start_time   | DateTime | Operation start time      |
| end_time     | DateTime | Operation end time        |
