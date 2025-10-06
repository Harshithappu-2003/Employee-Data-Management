# Employee Data Management System

A comprehensive CRUD (Create, Read, Update, Delete) application for managing employee data, built with Next.js 15, TypeScript, and SQLite. Features a modern UI with real-time search, filtering, and complete test coverage.

## 🚀 Features

- **Complete CRUD Operations**: Create, read, update, and delete employee records
- **Real-time Search**: Search employees by name, email, or position
- **Department Filtering**: Filter employees by department (Engineering, Marketing, Sales, HR, Finance)
- **Form Validation**: Comprehensive client and server-side validation
- **Responsive Design**: Modern UI with dark mode support
- **Type Safety**: Full TypeScript implementation with Drizzle ORM
- **Comprehensive Testing**: 40+ test cases covering all functionality

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: SQLite with Turso (cloud) or local file
- **UI Components**: Shadcn/UI, Lucide React icons
- **Testing**: Jest, Testing Library
- **Styling**: Tailwind CSS with custom animations

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Git

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd employee-crud-app-main
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:

**Option A: Local SQLite (Recommended for Development)**
```bash
# .env.local
TURSO_CONNECTION_URL=file:./local.db
TURSO_AUTH_TOKEN=local-dev-token
```

**Option B: Turso Cloud Database (Production)**
```bash
# .env.local
TURSO_CONNECTION_URL=your_turso_connection_url
TURSO_AUTH_TOKEN=your_turso_auth_token
```

### 4. Set Up Database
```bash
# Create database tables
npx drizzle-kit push

# Seed with sample data (15 employees)
npx tsx src/db/seeds/employees.ts
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

### Run Specific Test Suites
```bash
# Run only API tests
npm test -- --testPathPattern="route.test.ts"

# Run only validation tests
npm test -- --testPathPattern="validation.test.ts"

# Run only database tests
npm test -- --testPathPattern="database.test.ts"
```

## 📊 Test Coverage

The project includes comprehensive test coverage:

- **API Endpoint Tests**: All CRUD operations (GET, POST, PUT, DELETE)
- **Business Logic Tests**: Input validation, email format, salary validation
- **Database Tests**: CRUD operations, query filtering, data integrity
- **Integration Tests**: End-to-end workflows and data consistency
- **Performance Tests**: Large dataset handling and concurrent operations

**Test Results**: 35+ passing tests with comprehensive coverage of all functionality.

## 🎯 Usage

### Landing Page
Visit `http://localhost:3000` to see the feature overview and access the employee management system.

### Employee Management
- **View Employees**: See all employees in a responsive table
- **Add Employee**: Click "Add Employee" to create new records
- **Edit Employee**: Click the edit icon to modify existing records
- **Delete Employee**: Click the delete icon with confirmation dialog
- **Search**: Use the search bar to find employees by name, email, or position
- **Filter**: Use the department dropdown to filter by department

### API Endpoints
- `GET /api/employees` - List all employees with pagination and filtering
- `POST /api/employees` - Create new employee
- `GET /api/employees/[id]` - Get employee by ID
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/employees/          # REST API endpoints
│   ├── employees/              # Employee management page
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # Shadcn/UI components
│   ├── EmployeeFormDialog.tsx  # Employee form modal
│   └── ErrorReporter.tsx       # Error handling
├── db/
│   ├── schema.ts               # Database schema
│   ├── index.ts                # Database connection
│   └── seeds/                  # Sample data
├── lib/
│   ├── utils.ts                # Utility functions
│   └── test-utils.ts           # Test utilities
└── types/
    └── employee.ts             # TypeScript types
```

## 🔧 Design Choices & Assumptions

### Database Design
- **SQLite**: Chosen for simplicity and local development
- **Drizzle ORM**: Type-safe database operations with excellent TypeScript support
- **Schema**: Employees table with all essential fields (name, email, position, department, salary, hire date)

### Architecture Decisions
- **Next.js App Router**: Modern routing with server components
- **API Routes**: RESTful API design for CRUD operations
- **TypeScript**: Full type safety throughout the application
- **Component Library**: Shadcn/UI for consistent, accessible components

### Testing Strategy
- **Jest**: Comprehensive testing framework with mocking capabilities
- **Test Categories**: Unit tests, integration tests, and end-to-end tests
- **Database Testing**: In-memory SQLite for isolated test execution
- **Coverage**: Aim for high test coverage of critical business logic

### UI/UX Decisions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Search**: Immediate filtering as user types
- **Form Validation**: Client and server-side validation for data integrity
- **Error Handling**: User-friendly error messages and loading states
- **Accessibility**: Keyboard navigation and screen reader support

### Performance Considerations
- **Pagination**: Limit database queries for large datasets
- **Search Optimization**: Efficient database queries with proper indexing
- **Caching**: Next.js built-in caching for API responses
- **Bundle Optimization**: Code splitting and lazy loading

## 🚀 Deployment

### Local Development
The application runs locally with SQLite database for development and testing.

### Production Deployment
For production, consider:
- **Database**: Use Turso cloud database for scalability
- **Hosting**: Deploy on Vercel, Netlify, or similar platforms
- **Environment Variables**: Set up production database credentials
- **Monitoring**: Add logging and error tracking

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:ci      # Run tests for CI/CD
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).