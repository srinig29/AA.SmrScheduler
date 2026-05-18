# SMR Scheduler Frontend

React-based MVP frontend for the SMR Appointment Scheduler.

## Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
cd frontend
npm install
```

### Running the App

```bash
npm start
```

The app will start at `http://localhost:3000` and connect to the backend API at `http://localhost:5080/api`.

## Building for Production

```bash
npm run build
```

## Architecture

### Screens

1. **Dashboard**: View today's schedule grouped by mechanic
   - Displays all appointments for the current day
   - Shows customer name, service type, and appointment status
   - Real-time refresh capability

2. **Book Appointment**: Customer-facing booking flow
   - Step 1: Select service type and available slot
   - Step 2: Enter customer details and confirm booking
   - Returns reference number on successful booking
   - Handles double-booking prevention (409 conflict)

3. **Mechanic Console**: Mechanic task management interface
   - Select mechanic to view 48-hour appointment window
   - View appointment details (customer, vehicle, service)
   - Add work notes to appointments
   - Update appointment status (Scheduled → InProgress → Completed/NoShow)

### Component Structure

```
src/
├── index.js              # React entry point
├── App.js               # Main app with navigation
├── App.css              # Global and nav styles
└── components/
    ├── Dashboard.js     # Today's schedule view
    ├── Dashboard.css
    ├── BookingFlow.js   # Two-step booking form
    ├── BookingFlow.css
    ├── MechanicConsole.js  # Mechanic task console
    └── MechanicConsole.css
```

### API Integration

The frontend connects to the backend API (<http://localhost:5080/api>) with the following endpoints:

- `GET /reference-data/branches` - List branches
- `GET /reference-data/service-types` - List service types
- `GET /slots/available` - List available appointment slots
- `POST /appointments` - Create new appointment
- `GET /appointments/{id}` - Get appointment details
- `POST /appointments/{id}/work-notes` - Add work note
- `PATCH /appointments/{id}/status` - Update appointment status
- `GET /mechanics` - List all mechanics
- `GET /mechanics/{id}/appointments` - Get mechanic's appointments (48 hours)
- `GET /dashboard/today` - Get today's schedule grouped by mechanic

## Features

- **No external state management**: Uses React hooks (useState, useEffect)
- **Simple routing**: Navbar buttons switch between screens (no React Router for simplicity)
- **Error handling**: User-friendly error messages and validation
- **Loading states**: Feedback during async operations
- **Responsive design**: Works on desktop and tablet
- **Clean UI**: Minimal styling with CSS-only approach

## Notes

This is a lightweight MVP designed for interview purposes. It demonstrates:

- React component composition
- API integration and error handling
- Form validation and state management
- Responsive UI design
- Clear separation of concerns
