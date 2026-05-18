using AA.SmrScheduler.Api.Contracts;
using AA.SmrScheduler.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AA.SmrScheduler.Api.Controllers;

[ApiController]
[Route("api/slots")]
public class SlotsController : ControllerBase
{
    private readonly SmrSchedulerDbContext _dbContext;

    public SlotsController(SmrSchedulerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("available")]
    public async Task<ActionResult<List<AvailableSlotDto>>> GetAvailableSlots([FromQuery] int? serviceTypeId)
    {
        var start = DateTime.Today;
        var end = start.AddDays(7);

        var query = _dbContext.AppointmentSlots
            .AsNoTracking()
            .Include(s => s.Branch)
            .Include(s => s.Mechanic)
            .Include(s => s.ServiceType)
            .Where(s => s.StartTime >= start && s.StartTime < end)
            .Where(s => !_dbContext.Appointments.Any(a => a.AppointmentSlotId == s.Id));

        if (serviceTypeId.HasValue)
        {
            query = query.Where(s => s.ServiceTypeId == serviceTypeId.Value);
        }

        var slots = await query
            .OrderBy(s => s.StartTime)
            .Select(s => new AvailableSlotDto
            {
                SlotId = s.Id,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                BranchId = s.BranchId,
                BranchName = s.Branch.Name,
                MechanicId = s.MechanicId,
                MechanicName = s.Mechanic.Name,
                ServiceTypeId = s.ServiceTypeId,
                ServiceTypeName = s.ServiceType.Name
            })
            .ToListAsync();

        return Ok(slots);
    }
}
