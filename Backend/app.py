from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import jwt_required, get_jwt_identity
from decouple import config
import logging
logging.basicConfig(level=logging.DEBUG)


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = config('SQLALCHEMY_DATABASE_URI')
app.config['JWT_SECRET_KEY'] = config('JWT_SECRET_KEY')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.debug = True


db = SQLAlchemy(app)
jwt = JWTManager(app)



class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)



class Organization(db.Model):
    __tablename__ = 'organizations'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)


user_organization_association = db.Table('user_organization',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('organization_id', db.Integer, db.ForeignKey('organizations.id'), primary_key=True)
)


User.organizations = db.relationship('Organization', secondary=user_organization_association, backref=db.backref('users'))



migrate = Migrate(app, db)

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email:
            return jsonify({"message": "Email is required."}), 400

        if not password:
            return jsonify({"message": "Password is required."}), 400
        
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"message": "User with this email already exists!"}), 400

        hashed_password = generate_password_hash(password, method='scrypt')
        new_user = User(email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created!"}), 201
    
    except Exception as e:
        app.logger.error(f"Exception occurred: {e}")
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first() 
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"message": "Invalid credentials!"}), 401
    access_token = create_access_token(identity=user.email) 
    return jsonify({"access_token": access_token})

@app.route('/create-org', methods=['POST'])
def new_organition():
    try:
        data = request.get_json()

        organization_name = data.get('name')
        
        if organization_name is None:
            return jsonify({"message": "Organization name is required."}), 400

        existing_organization = Organization.query.filter_by(name=organization_name).first()

        if existing_organization:
            return jsonify({"message": "An organization with this name already exists."}), 400

        new_organization = Organization(name=organization_name)

        db.session.add(new_organization)
        db.session.commit()

        return jsonify({"message": "Organization created!"}), 201

    except KeyError:
     
        return jsonify({"message": "Invalid data provided."}), 400
    except Exception as e:
       
        app.logger.error(f"Error while creating organization: {e}")
        return jsonify({"message": "Internal server error. Please try again later."}), 500


@app.route('/show_users', methods=['GET'])
def show_users():
    users = User.query.all()
    users_list = [{"email": user.email, "id": user.id} for user in users]
    return jsonify({"users": users_list, "message": "All users!"}), 200


@app.route('/show_organizations', methods=['GET'])
def show_organizations():
    organizations = Organization.query.all()
    organization_list = [{"name": organization.name} for organization in organizations]

    return jsonify({"names": organization_list, "message": "All organizations!"}), 200


@app.route('/add-user-to-org', methods=['POST'])
def add_user_to_org():
    try:
        data = request.get_json()

        user_id = data.get('user_id')
        organization_name = data.get('name')

        if not user_id or not organization_name:
            return jsonify({"error": "User ID and organization name are required"}), 400

        user = User.query.get(user_id)
        organization = Organization.query.filter_by(name=organization_name).first()

        if not user or not organization:
            return jsonify({"error": "User or Organization not found"}), 404

        if organization not in user.organizations:
            user.organizations.append(organization)
            db.session.commit()
            return jsonify({"message": "Successfully added user to organization"}), 201
        else:
            return jsonify({"error": "User already added to this organization"}), 400

    except KeyError:
        return jsonify({"message": "Invalid data provided."}), 400
    except Exception as e:
      
        app.logger.error(f"Error while adding user to organization: {e}")
        return jsonify({"message": "Internal server error. Please try again later."}), 500


@app.route('/protected-resource', methods=['GET'])
@jwt_required()  
def protected_resource():
    current_user = get_jwt_identity()
    return jsonify(message=f"Hello, {current_user}! You have access to this protected resource.")



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=False, host='0.0.0.0')
    