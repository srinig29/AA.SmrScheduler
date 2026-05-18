using AA.SmrScheduler.Api.Contracts;
using AA.SmrScheduler.Domain;
using AA.SmrScheduler.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AA.SmrScheduler.Api.Controllers;

[ApiController]
[Route("api/appointments")]
public class AppointmentsController : ControllerBase
{
    private readonly SmrSchedulerDbContext _dbContext;

    public AppointmentsController(SmrSchedulerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost]
    public async Task<ActionResult<BookingConfirmationDto>> CreateAppointment([FromBody] CreateAppointmentRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CustomerName) ||
            string.IsNullOrWhiteSpace(request.CustomerPhone) ||
            string.IsNullOrWhiteSpace(request.VehicleRegistration) ||
            string.IsNullOrWhiteSpace(request.Notes))
        {
            return BadRequest("Customer name, phone, vehicle registration, and notes are required.");
        }

        var slot = await _dbContext.AppointmentSlots
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == request.AppointmentSlotId);

        if (slot is null)
        {
            return NotFound("Appointment slot not found.");
        }

        if (slot.BranchId != request.BranchId || slot.ServiceTypeId != request.ServiceTypeId)
        {
            return BadRequest("Selected slot does not match the selected branch/service type.");
        }

        var appointment = new Appointment
        {
            AppointmentSlotId = request.AppointmentSlotId,
            CustomerName = request.CustomerName.Trim(),
            CustomerPhone = request.CustomerPhone.Trim(),
            VehicleRegistration = request.VehicleRegistration.Trim(),
            Notes = request.Notes.Trim(),
            Status = AppointmentStatus.Scheduled,
            ReferenceNumber = BuildReferenceNumber(),
            CreatedAtUtc = DateTime.UtcNow
        };

        _dbContext.Appointments.Add(appointment);

        try
        {
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict("This appointment slot is already booked.");
        }

        var confirmation = new BookingConfirmationDto
        {
            AppointmentId = appointment.Id,
            ReferenceNumber = appointment.ReferenceNumber,
            Status = appointment.Status
        };

        return CreatedAtAction(nameof(GetAppointmentById), new { id = appointment.Id }, confirmation);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AppointmentDetailDto>> GetAppointmentById(int id)
    {
        var appointment = await _dbContext.Appointments
            .AsNoTracking()
            .Include(a => a.AppointmentSlot)
                .ThenInclude(s => s.Branch)
            .Include(a => a.AppointmentSlot)
                .ThenInclude(s => s.Mechanic)
            .Include(a => a.AppointmentSlot)
                .ThenInclude(s => s.ServiceType)
            .Include(a => a.WorkNotes)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appointment is null)
        {
            return NotFound();
        }

        var dto = new AppointmentDetailDto
        {
            AppointmentId = appointment.Id,
            ReferenceNumber = appointment.ReferenceNumber,
            Status = appointment.Status,
            CustomerName = appointment.CustomerName,
            CustomerPhone = appointment.CustomerPhone,
            VehicleRegistration = appointment.VehicleRegistration,
            Notes = appointment.Notes,
            SlotStartTime = appointment.AppointmentSlot.StartTime,
            SlotEndTime = appointment.AppointmentSlot.EndTime,
            BranchId = appointment.AppointmentSlot.BranchId,
            BranchName = appointment.AppointmentSlot.Branch.Name,
            MechanicId = appointment.AppointmentSlot.MechanicId,
            MechanicName = appointment.AppointmentSlot.Mechanic.Name,
            ServiceTypeId = appointment.AppointmentSlot.ServiceTypeId,
            ServiceTypeName = appointment.AppointmentSlot.ServiceType.Name,
            WorkNotes = appointment.WorkNotes
                .OrderByDescending(n => n.CreatedAtUtc)
                .Select(n => new WorkNoteDto
                {
                    Id = n.Id,
                    Note = n.Note,
                    CreatedAtUtc = n.CreatedAtUtc
                })
                .ToList()
        };

        return Ok(dto);
    }

    [HttpPost("{id:int}/work-notes")]
    public async Task<ActionResult<WorkNoteDto>> AddWorkNote(int id, [FromBody] AddWorkNoteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Note))
        {
            return BadRequest("Work note is required.");
        }

        var appointment = await _dbContext.Appointments.FirstOrDefaultAsync(a => a.Id == id);

        if (appointment is null)
        {
            return NotFound();
        }

        var note = new WorkNote
        {
            AppointmentId = id,
            Note = request.Note.Trim(),
            CreatedAtUtc = DateTime.UtcNow
        };

        _dbContext.WorkNotes.Add(note);
        await _dbContext.SaveChangesAsync();

        return Ok(new WorkNoteDto
        {
            Id = note.Id,
            Note = note.Note,
            CreatedAtUtc = note.CreatedAtUtc
        });
    }

    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult> UpdateStatus(int id, [FromBody] UpdateAppointmentStatusRequest request)
    {
        var appointment = await _dbContext.Appointments.FirstOrDefaultAsync(a => a.Id == id);

        if (appointment is null)
        {
            return NotFound();
        }

        if (!CanTransition(appointment.Status, request.Status))
        {
            return BadRequest($"Invalid status transition from {appointment.Status} to {request.Status}.");
        }

        appointment.Status = request.Status;
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    private static string BuildReferenceNumber()
    {
        return $"SMR-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(1000, 9999)}";
    }

    private static bool CanTransition(AppointmentStatus current, AppointmentStatus next)
    {
        return (current, next) switch
        {
            (AppointmentStatus.Scheduled, AppointmentStatus.InProgress) => true,
            (AppointmentStatus.InProgress, AppointmentStatus.Completed) => true,
            (AppointmentStatus.InProgress, AppointmentStatus.NoShow) => true,
            _ => false
        };
    }
}
