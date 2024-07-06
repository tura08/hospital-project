from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    db.init_app(app)

    # Enable CORS
    CORS(app)

    # Register blueprints, if any
    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
