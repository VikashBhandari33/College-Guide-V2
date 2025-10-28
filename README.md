# College Guide - Full Stack Application

A complete college management system with timetables, syllabus, events, holidays, exams, and personal to-do lists.

## Tech Stack

### Frontend
- HTML5, CSS3
- JavaScript (Vanilla)
- Tailwind CSS
- AOS (Animate On Scroll)
- Feather Icons

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt for password hashing

## Project Structure

```
College Guide V2/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── backend/
    ├── models/
    │   ├── User.js
    │   └── Todo.js
    ├── routes/
    │   ├── auth.js
    │   └── todo.js
    ├── middleware/
    │   └── auth.js
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── server.js
    └── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- A modern web browser

### 1. Install MongoDB

**Windows:**
1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB as a service
3. Verify: Open Command Prompt and run `mongo --version`

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. Setup Backend

```bash
# Navigate to backend directory
cd "d:\College Guide V2\backend"

# Install dependencies
npm install

# The .env file is already created with default settings
# For production, change JWT_SECRET to a secure random string
```

### 3. Start the Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 3000
📍 API available at http://localhost:3000/api
```

### 4. Setup Frontend

Simply open the frontend HTML file in a browser:

**Option 1: Direct File Access**
- Navigate to `d:\College Guide V2\frontend`
- Double-click `index.html`

**Option 2: Using Live Server (Recommended)**
- Install "Live Server" extension in VS Code
- Right-click on `index.html` and select "Open with Live Server"

## Usage

### 1. Register a New Account
- Click "Sign Up" in the navigation
- Enter your name, email, and password (minimum 6 characters)
- You'll be automatically logged in after registration

### 2. Login
- Click "Log In" in the navigation
- Enter your email and password
- Upon successful login, you'll see "Welcome, [Your Name]!" in the navbar

### 3. Manage To-Dos
- Once logged in, scroll to the "Personal To-Do List" section
- Add tasks by typing in the input field and clicking "Add"
- Check/uncheck tasks to mark them as complete
- Delete tasks using the trash icon
- Your todos are stored in MongoDB and synced across devices

### 4. View Timetables
- Switch between ECE, CSE, and DSAI departments using the tabs
- View course schedules with color-coded subjects

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (requires authentication)

### Todos
All todo endpoints require authentication (Bearer token in Authorization header)

- `GET /api/todos` - Get all user's todos
- `POST /api/todos` - Create new todo
  ```json
  {
    "text": "Complete homework",
    "completed": false
  }
  ```

- `PUT /api/todos/:id` - Update todo
  ```json
  {
    "text": "Updated text",
    "completed": true
  }
  ```

- `DELETE /api/todos/:id` - Delete todo

## Features

✅ User Authentication (Register/Login/Logout)
✅ JWT-based authorization
✅ Password hashing with bcrypt
✅ MongoDB database for persistent storage
✅ Personal to-do list with CRUD operations
✅ Department-wise timetables (ECE, CSE, DSAI)
✅ Course syllabus information
✅ Upcoming events calendar
✅ Holiday calendar
✅ Exam schedule
✅ Responsive design
✅ Smooth animations

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Protected API routes
- CORS enabled for cross-origin requests
- Input validation on both frontend and backend

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod --version`
- Check if MongoDB service is started
- Verify connection string in `.env` file

### Backend Won't Start
- Check if port 3000 is available
- Run `npm install` to ensure all dependencies are installed
- Check for syntax errors in the terminal

### Frontend Can't Connect to Backend
- Ensure backend server is running on port 3000
- Check browser console for CORS errors
- Verify API_URL in `script.js` matches backend URL

### Todos Not Saving
- Ensure you're logged in
- Check browser console for errors
- Verify token is stored in localStorage

## Development

To modify the application:

1. **Frontend Changes**: Edit files in `frontend/` directory
2. **Backend Changes**: Edit files in `backend/` directory
3. **Database Models**: Modify files in `backend/models/`
4. **API Routes**: Update files in `backend/routes/`

## Future Enhancements

- [ ] User profile management
- [ ] File upload for assignments
- [ ] Real-time notifications
- [ ] Mobile app version
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login (Google, GitHub)
- [ ] Dark mode
- [ ] Export data to PDF/Excel

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check the console logs or contact the development team.
