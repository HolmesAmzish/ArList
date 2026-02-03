# ArList (Todo Project)

This project is a Todo application built with Spring Boot and React.js.

Note: The backend is my core work. The frontend was developed with the assistance of an LLM, so the code might be a bit messy, but it gets the job done!

## Getting Started
Follow these steps to get the project up and running on your local machine:

1. Database Setup
Create a database using PostgreSQL (or your preferred SQL database).

Ensure you update the database configuration in application.properties to match your local environment.

2. Backend Configuration
Navigate to backend/src/main/resources/.

Copy keys-example.properties to a new file named keys.properties.

Fill in your specific keys and credentials in keys.properties.

3. Run the Backend

```Bash
cd backend
mvn spring-boot:run
```

4. Run the Frontend

```Bash
cd frontend
npm install
npm run dev
```