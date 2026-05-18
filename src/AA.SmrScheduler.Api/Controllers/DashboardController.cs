using AA.SmrScheduler.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AA.SmrScheduler.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly SmrSchedulerDbContext _dbContext;

    public DashboardController(SmrSchedulerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("today")]
    public async Task<ActionResult<List<object>>> GetTodaySchedule()
    {
        var start = DateTime.Today;
        var end = start.AddDays(1);

        var result = await _dbContext.Appointments
            .AsNoTracking()
            .Include(a => a.AppointmentSlot)
                .ThenInclude(s => s.Mechanic)
            .Include(a => a.AppointmentSlot)
                .ThenInclude(s => s.Branch)
            .Include(a => a.AppointmentSlot)
                .ThenInclude(s => s.ServiceType)
            .Where(a => a.AppointmentSlot.StartTime >= start && a.AppointmentSlot.StartTime < end)
            .OrderBy(a => a.AppointmentSlot.Mechanic.Name)
            .ThenBy(a => a.AppointmentSlot.StartTime)
            .Select(a => new
            {
                a.Id,
                a.ReferenceNumber,
                a.Status,
                a.CustomerName,
                a.VehicleRegistration,
                a.AppointmentSlot.StartTime,
                a.AppointmentSlot.EndTime,
                MechanicId = a.AppointmentSlot.MechanicId,
                MechanicName = a.AppointmentSlot.Mechanic.Name,
                BranchName = a.AppointmentSlot.Branch.Name,
                ServiceTypeName = a.AppointmentSlot.ServiceType.Name
            })
            .ToListAsync();

        return Ok(result);
    }
}
