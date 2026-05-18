# AA SMR Scheduler

Interview assignment implementation for a simple Service, Maintenance & Repair booking system.

## Current status
- Backend solution builds successfully on .NET 8.
- EF Core and Swagger package/reference issues are fixed.
- React frontend is not scaffolded yet.

## Solution structure
- `src/AA.SmrScheduler.Api` - ASP.NET Core Web API host
- `src/AA.SmrScheduler.Domain` - domain entities
- `src/AA.SmrScheduler.Infrastructure` - EF Core DbContext and persistence config

## Prerequisites
- .NET SDK 8.x
- SQL Server LocalDB (MSSQLLocalDB)

## Run locally
1. Restore and build:
   - `dotnet restore AA.SmrScheduler.sln`
   - `dotnet build AA.SmrScheduler.sln`
2. Run API:
   - `dotnet run --project src/AA.SmrScheduler.Api`

The API currently applies pending migrations on startup via `Program.cs`.

## Database
Connection string is in `src/AA.SmrScheduler.Api/appsettings.json` and targets LocalDB:
- `Server=(localdb)\\MSSQLLocalDB;Database=AASmrSchedulerDb;Trusted_Connection=True;TrustServerCertificate=True`

## Scope guidance
See `AI_WORKING_NOTES.md` for:
- MVP scope
- out-of-scope items
- implementation plan
- decisions and limitations
