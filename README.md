# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/217d7758-cc95-47de-a87a-4edef9f7c99b

## HR Management System

This is a comprehensive HR Management System with both frontend and backend components.

### Features
- Employee Management with image upload
- Department Management
- Attendance Tracking
- Leave Request Management
- Payroll Management
- Reports & Analytics
- Profile Management
- SQLite Database Backend
- REST API

### Backend Database View

The system includes a backend server that provides a complete database overview. You can view all data in table format by visiting:

**http://localhost:3001** (when server is running)

This shows:
- All employees with their details and avatars
- Department information
- Attendance records
- Leave requests
- Payroll data
- Statistics and overview

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/217d7758-cc95-47de-a87a-4edef9f7c99b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4a: Start both frontend and backend servers
npm run dev:full

# OR Step 4b: Start servers separately
# Terminal 1 - Backend server
npm run server

# Terminal 2 - Frontend development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start frontend development server (port 8080)
- `npm run server` - Start backend server (port 3001)
- `npm run dev:full` - Start both frontend and backend concurrently
- `npm run build` - Build for production

### API Endpoints

The backend provides the following API endpoints:

- `GET /` - Database overview in HTML table format
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `POST /api/upload-avatar` - Upload avatar image
- `GET /api/departments` - Get all departments

### Image Upload

The system supports image upload for employee avatars:
- Maximum file size: 5MB
- Supported formats: JPG, PNG, GIF
- Images are stored in `server/uploads/` directory
- Accessible via `/uploads/filename` URL

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/217d7758-cc95-47de-a87a-4edef9f7c99b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
