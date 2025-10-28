# College Guide Backend

Backend API for College Guide application using Node.js, Express, and MongoDB.

## Setup Instructions

### 1. Install MongoDB
Make sure MongoDB is installed and running on your system.

**Windows:**
- Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Install and start MongoDB service

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment
Edit the `.env` file and update:
- `JWT_SECRET`: Change to a secure random string
- `MONGODB_URI`: Update if using a different MongoDB connection

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Todos
- `GET /api/todos` - Get all todos (requires auth)
- `POST /api/todos` - Create new todo (requires auth)
- `PUT /api/todos/:id` - Update todo (requires auth)
- `DELETE /api/todos/:id` - Delete todo (requires auth)

## Testing the API

Use tools like Postman or Thunder Client to test the API endpoints.

### Example: Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Example: Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes a `token` - use this in the Authorization header for protected routes:
```
Authorization: Bearer <your-token>
```
