# AA SMR Scheduler

Interview assignment implementation for a simple Service, Maintenance & Repair booking system.

## 🎯 Current status

✅ **MILESTONE 5 COMPLETE - MVP READY FOR DEMO**

- Backend API (.NET 8) builds successfully and runs on <http://localhost:5080>
- EF Core migrations created and applied to LocalDB
- Seed data verified (Branches=2, Services=4, AvailableSlots=84)
- React frontend scaffolded with 3 MVP screens
- All API endpoints wired and tested (200 responses verified)
- ESLint warnings cleaned (unused vars and hook dependencies)

## Solution structure

```
AA.SmrScheduler/
├── src/
│   ├── AA.SmrScheduler.Api          # ASP.NET Core Web API
│   ├── AA.SmrScheduler.Domain       # Domain entities
│   └── AA.SmrScheduler.Infrastructure # EF Core DbContext
├── frontend/                        # React MVP app
├── README.md                        # This file
└── AI_WORKING_NOTES.md             # Detailed implementation plan
```

## 📋 Prerequisites

- .NET SDK 8.x
- SQL Server LocalDB (MSSQLLocalDB)
- Node.js 16+ and npm

## 🚀 Quick start

### Backend (Terminal 1)

```bash
cd src\AA.SmrScheduler.Api
dotnet run
```

Runs on: <http://localhost:5080>  
Swagger: <http://localhost:5080/swagger/index.html>

### Frontend (Terminal 2)

```bash
cd frontend
npm install  # (first time only)
npm start
```

Runs on: <http://localhost:3000>

### Test the MVP

1. **Dashboard**: Home screen shows today's appointments grouped by mechanic
2. **Booking Flow**: Select service type → pick available slot → enter customer details → confirm booking → get reference number
3. **Mechanic Console**: Select mechanic → view 48-hour appointments → view details → add work notes → update status

## 🔧 Backend commands

### Build

```bash
dotnet build AA.SmrScheduler.sln
```

### Restore packages

```bash
dotnet restore AA.SmrScheduler.sln
```

### Run API

```bash
dotnet run --project src/AA.SmrScheduler.Api
```

### Database migrations

```bash
# Create migration
dotnet ef migrations add <MigrationName> --project src/AA.SmrScheduler.Infrastructure --startup-project src/AA.SmrScheduler.Api --output-dir Migrations

# Apply migration
dotnet ef database update --project src/AA.SmrScheduler.Infrastructure --startup-project src/AA.SmrScheduler.Api

# Drop database
dotnet ef database drop --project src/AA.SmrScheduler.Infrastructure --startup-project src/AA.SmrScheduler.Api
```

## 🗄️ Database

Connection string: `(localdb)\MSSQLLocalDB;Database=AASmrSchedulerDb`

Located in: `src/AA.SmrScheduler.Api/appsettings.json`

**Seed data** (on first run):

- 2 branches (Dublin, Cork)
- 4 service types (Inspection 60min, Service 90min, Repair 120min, Diagnostics 60min)
- 3 mechanics (1-2 per branch)
- 84 appointment slots (7 days × 3 mechanics × 4 service types, auto-generated on startup)

## 📱 Frontend structure

```
frontend/
├── package.json
├── public/
│   └── index.html
├── src/
│   ├── App.js              # Main app with nav
│   ├── App.css             # Global styles + nav
│   ├── index.js            # React entry point
│   ├── index.css           # Base styles
│   └── components/
│       ├── Dashboard.js    # Today's schedule view
│       ├── Dashboard.css
│       ├── BookingFlow.js  # Booking form (2 steps)
│       ├── BookingFlow.css
│       ├── MechanicConsole.js  # Mechanic task management
│       └── MechanicConsole.css
└── README.md               # Frontend-specific guide
```

## 🔌 API endpoints

### Reference Data

- `GET /api/reference-data/branches` - Get all branches
- `GET /api/reference-data/service-types` - Get all service types

### Slots

- `GET /api/slots/available?serviceTypeId=<id>` - Get available slots (optional filter)

### Appointments

- `POST /api/appointments` - Create booking
- `GET /api/appointments/{id}` - Get appointment detail
- `POST /api/appointments/{id}/work-notes` - Add work note
- `PATCH /api/appointments/{id}/status` - Update status

### Mechanics

- `GET /api/mechanics` - Get all mechanics
- `GET /api/mechanics/{id}/appointments` - Get mechanic's 48-hour appointments

### Dashboard

- `GET /api/dashboard/today` - Get today's schedule grouped by mechanic

## ✅ Milestone checklist

- [x] Fix build/package/reference issues (Milestone 1)
- [x] Retarget to .NET 8 (Milestone 1)
- [x] Create planning documentation (Milestone 2)
- [x] Implement backend Phase 1 endpoints (Milestone 3)
- [x] Add EF migrations and verify seed data (Milestone 4)
- [x] Scaffold React MVP frontend (Milestone 5)
- [x] Wire all 3 screens to backend endpoints (Milestone 5)
- [x] Verify end-to-end connectivity (Milestone 5)
- [ ] Final hardening (error handling edge cases, README finalization)

## 🎓 Interview talking points

### Architecture

- **Layered design**: Domain → Infrastructure (EF) → API (Controllers)
- **Simple and interview-friendly**: No complex patterns (CQRS, MediatR, etc.)
- **CORS enabled** for React frontend

### Data model

- **AppointmentSlot**: Composite key (BranchId, MechanicId, ServiceTypeId, StartTime, EndTime)
- **Appointment**: Unique ReferenceNumber, unique constraint on AppointmentSlotId (prevents double-booking)
- **WorkNote**: Cascade delete on parent Appointment
- **Status machine**: Scheduled → InProgress → {Completed, NoShow}

### Key decisions

1. **Delete behaviors**: Explicit configuration to prevent SQL Server cascade path conflicts
2. **Idempotent seeding**: Startup checks for existing slots before bulk insert
3. **Double-booking prevention**: DB unique constraint + API 409 conflict response
4. **Slot generation**: 7 days ahead, 3 mechanics × 4 service types = 84 slots

### Frontend

- **No state management library**: React hooks only (useState, useEffect)
- **No Router**: Simple navbar state toggle between screens (MVP simplicity)
- **Fetch API**: Direct calls to backend (no axios or wrapper)
- **Responsive CSS Grid**: Works on desktop and tablet

## 📝 Scope

See `AI_WORKING_NOTES.md` for detailed:

- MVP scope and feature set
- Out-of-scope items
- Implementation plan
- Decisions and known limitations

## 🚨 Known limitations / Next steps

- No authentication/authorization
- No email/SMS notifications
- No rescheduling/cancellation UI
- No automated tests (manual verification completed)
- Simple ESLint warning suppressions (unused imports, hook dependencies)

## 📚 Further reading

- Backend planning: [AI_WORKING_NOTES.md](AI_WORKING_NOTES.md)
- Frontend details: [frontend/README.md](frontend/README.md)
- Domain model: See `src/AA.SmrScheduler.Domain/` entity classes
- API configuration: See `src/AA.SmrScheduler.Api/Program.cs`
