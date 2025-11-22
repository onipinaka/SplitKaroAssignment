# SplitKaro - Expense Tracker

A simple expense tracking application with natural language query support. Track your spending and search expenses using plain English queries like "how much did I spend on food last week?"

## Features

- ✅ Add expenses with amount, category, date, and description
- ✅ Natural language query parsing (e.g., "groceries this month", "food last Saturday")
- ✅ Filter expenses by category and date range
- ✅ Clean and intuitive UI
- ✅ RESTful API with Express.js
- ✅ MongoDB for data persistence

## Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Natural language parsing with `chrono-node`
- Input validation with Joi

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Assignment SplitKaro"
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/splitkaro
```

Start the backend server:

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:4000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` folder:

```env
VITE_API_BASE=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage

### Adding Expenses

1. Fill in the expense form with:
   - Amount (required)
   - Category (grocery, food, rent, etc.)
   - Date & time (optional, defaults to now)
   - Description

### Querying Expenses

Use natural language to search your expenses:

- "food this week"
- "how much did I spend on groceries last month?"
- "rent in September"
- "all expenses yesterday"
- "shopping between October 1 and October 15"

The app understands:
- **Categories**: grocery, food, rent, travel, utilities, shopping, fuel, entertainment, misc
- **Time phrases**: today, yesterday, last week, this month, past 7 days, etc.
- **Date ranges**: between X and Y

## API Endpoints

### Expenses

**POST** `/api/expenses` - Create a new expense
```json
{
  "amount": 500,
  "category": "food",
  "datetime": "2025-11-22T10:30:00Z",
  "description": "Lunch at restaurant"
}
```

**GET** `/api/expenses` - Get expenses with filters
- Query params: `category`, `from`, `to`, `limit`, `skip`

### Queries

**POST** `/api/query/local` - Natural language query
```json
{
  "query": "how much did I spend on food this month?"
}
```

### Health Check

**GET** `/health` - Server health status

## Project Structure

```
Backend/
├── src/
│   ├── config/          # Database configuration
│   ├── constants/       # Categories and constants
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Error handling, async wrapper
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Natural language parser
│   ├── validations/     # Joi schemas
│   └── index.js         # App entry point
└── package.json

Frontend/
├── src/
│   ├── api/             # API client functions
│   ├── pages/           # Page components
│   ├── sections/        # Feature sections (Form, Query)
│   └── main.jsx         # App entry point
└── package.json
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 4000)
- `MONGODB_URI` - MongoDB connection string

### Frontend (.env)
- `VITE_API_BASE` - Backend API URL (default: http://localhost:4000)

## Development

The project uses:
- `nodemon` for backend hot-reload during development
- `vite` for fast frontend development with HMR
- ESLint for code quality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT
