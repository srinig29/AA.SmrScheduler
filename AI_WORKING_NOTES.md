# AI Working Notes - AA SMR Appointment Scheduler

## Assignment summary

Build a simple interview-ready Service, Maintenance & Repair scheduler with three core flows:

- Customer/booking-agent: find available slots for next 7 days, filter by service type, create booking, show unique reference.
- Mechanic: select mechanic (no auth), view today/tomorrow appointments, view details, add timestamped notes, update status.
- Admin/shared: home view showing today schedule across all mechanics.

Source references used:

- Assignment PDF at solution root: `AI_Coding_Interview_Assignment (1).pdf`
- User-provided requirements in chat (treated as source of truth for MVP scope)

## Chosen stack

- Frontend: React (to be scaffolded in a later milestone)
- Backend: ASP.NET Core Web API (.NET 8)
- Database: SQL Server LocalDB
- ORM: Entity Framework Core
- Database workflow: EF Core migrations + seed on first run

## Current solution structure

- `AA.SmrScheduler.sln`
- `src/AA.SmrScheduler.Domain`
  - Core entities (`Appointment`, `AppointmentSlot`, `Branch`, `Mechanic`, `ServiceType`, `WorkNote`, `AppointmentStatus`)
- `src/AA.SmrScheduler.Infrastructure`
  - `SmrSchedulerDbContext` + EF model config + some seed records
- `src/AA.SmrScheduler.Api`
  - API host startup in `Program.cs`
- Missing currently: React frontend project

## Planned MVP scope

### Backend MVP

- Keep current layered structure simple:
  - Domain entities
  - Infrastructure DbContext + migrations + seeding
  - API controllers/endpoints
- Implement endpoints for:
  - Available slots (next 7 days, optional service type filter)
  - Create booking with required fields
  - Booking confirmation with unique reference number
  - Mechanic schedule for today/tomorrow
  - Appointment detail
  - Add work notes (timestamped)
  - Status transitions: Scheduled -> In Progress -> Completed or No-Show
  - Home summary: today schedule across mechanics
- Prevent double booking with DB unique constraint on `AppointmentSlotId` and API conflict handling.

### Frontend MVP

- React UI with three simple screens:
  - Home schedule dashboard (today)
  - Booking flow
  - Mechanic console

## Out-of-scope items

- Authentication/login
- Email/SMS notifications
- Rescheduling/cancellation
- Recurring appointments
- Payments/invoicing
- Mobile-specific UI optimization

## Build issues found

### Initial issues

- Missing EF Core package references in Infrastructure project.
- Missing Swagger package reference in API project.
- Solution targeted .NET 9, while assignment target is .NET 8.

### Fixes applied (Milestone 1)

- Retargeted all projects to `.NET 8`.
- Added EF Core packages to Infrastructure:
  - `Microsoft.EntityFrameworkCore`
  - `Microsoft.EntityFrameworkCore.SqlServer`
  - `Microsoft.EntityFrameworkCore.Design`
- Added Swagger package to API:
  - `Swashbuckle.AspNetCore`
- Updated API OpenAPI package version for net8 compatibility.

### Verification

- `dotnet restore` succeeded
- `dotnet build` succeeded
- Editor diagnostics now show no compile errors

## Step-by-step implementation plan

1. Fix build/package/reference issues (completed).
2. Add planning docs (`AI_WORKING_NOTES.md`) and keep updated (in progress).
3. Implement backend Phase 1 endpoints and DTOs with simple service layer.
4. Add/refresh EF migrations and deterministic first-run seed data (including appointment slots for next 7 days).
5. Scaffold React frontend and wire required MVP flows.
6. Final polish: validation, conflict handling checks, README finalization.

## AI prompts used

1. "You are helping me complete a 3-hour coding interview assignment for AA Insurance... Please start by inspecting the solution, fixing the current EF Core build issue, and creating AI_WORKING_NOTES.md with the plan before proceeding further."
2. "Start implementation"

## Decisions made

- Keep architecture interview-friendly and intentionally simple.
- Use existing domain entities and DbContext as the base, extending only where needed.
- Prioritize required flows over optional abstractions.
- Keep manual mapping/validation straightforward to reduce complexity.

## Known limitations / future improvements

- No auth/authorization model.
- No automated test suite yet (manual verification first for time-boxed interview).
- Slot generation strategy may be basic in MVP and can be refined later.
- No background jobs/notifications.
- No advanced UI state management; MVP will keep minimal client complexity.

## Progress log

- 2026-05-18: Milestone 1 complete (build/package/reference fixes, net8 retarget, clean build).
- 2026-05-18: Initial `AI_WORKING_NOTES.md` created.
- 2026-05-18: Added Phase 1 backend foundation endpoints, startup slot seeding, and CORS configuration.
