# FullStackProject

This project consists of three main components:

1. Backend (Python Flask)
2. Frontend (React)
3. Database (PostgreSQL)

The project utilizes Docker for containerization.
 
## Prerequisites

* Docker
* Docker Compose 

# Setup

## Environment Variables

Before you run the Docker Compose setup, you need to configure the necessary environment variables. You can do this by creating a .env file in the root directory of the project with the following content:

POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_postgres_database_name
JWT_SECRET_KEY=your_jwt_secret_key

Replace the placeholders (your_postgres_user, your_postgres_password, your_postgres_database_name, and your_jwt_secret_key) with your actual values.


## Building and Running the Containers

With the .env file in place, navigate to the root directory of the project in the terminal and run the following command:

docker-compose up --build

This command will build and run all three containers. Once the containers are running:

* The Backend will be available at: http://localhost:5000/
* The Frontend will be available at: http://localhost:3000/
* PostgreSQL will be exposed on the default port 5432.

## Stopping the Containers
To stop the running containers, press CTRL+C in the terminal.

To stop and remove all the containers, you can use the following command:

docker-compose down

# Development

If you make any changes to the Backend or Frontend and want to see those changes reflected in the running application, you will need to rebuild the Docker images. This can be done using the docker-compose up --build command.

