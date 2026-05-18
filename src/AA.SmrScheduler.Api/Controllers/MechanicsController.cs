using AA.SmrScheduler.Api.Contracts;
using AA.SmrScheduler.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AA.SmrScheduler.Api.Controllers;

[ApiController]
[Route("api/mechanics")]
public class MechanicsController : ControllerBase
{
    private readonly SmrSchedulerDbContext _dbContext;

    public MechanicsController(SmrSchedulerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<MechanicListItemDto>>> GetMechanics()
    {
        var mechanics = await _dbContext.Mechanics
            .AsNoTracking()
            .Include(m => m.Branch)
            .OrderBy(m => m.Name)
            .Select(m => new MechanicListItemDto
            {
                Id = m.Id,
                Name = m.Name,
                BranchId = m.BranchId,
                BranchName = m.Branch.Name
            })
            .ToListAsync();

        return Ok(mechanics);
    }

    [HttpGet("{id:int}/appointments")]
    public async Task<ActionResult<List<MechanicAppointmentListItemDto>>> GetMechanicAppointments(int id)
    {
        var start = DateTime.Today;
        var end = start.AddDays(2);

        var appointments = await _dbContext.Appointments
            .AsNoTracking()
            .Include(a => a.AppointmentSlot)
                .ThenInclude(s => s.Branch)
            .Include(a => a.AppointmentSlot)
                .ThenInclude(s => s.ServiceType)
            .Where(a => a.AppointmentSlot.MechanicId == id)
            .Where(a => a.AppointmentSlot.StartTime >= start && a.AppointmentSlot.StartTime < end)
            .OrderBy(a => a.AppointmentSlot.StartTime)
            .Select(a => new MechanicAppointmentListItemDto
            {
                AppointmentId = a.Id,
                ReferenceNumber = a.ReferenceNumber,
                Status = a.Status,
                SlotStartTime = a.AppointmentSlot.StartTime,
                SlotEndTime = a.AppointmentSlot.EndTime,
                CustomerName = a.CustomerName,
                VehicleRegistration = a.VehicleRegistration,
                ServiceTypeName = a.AppointmentSlot.ServiceType.Name,
                BranchName = a.AppointmentSlot.Branch.Name
            })
            .ToListAsync();

        return Ok(appointments);
    }
}
