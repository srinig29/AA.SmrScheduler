using AA.SmrScheduler.Domain;

namespace AA.SmrScheduler.Api.Contracts;

public class CreateAppointmentRequest
{
    public int AppointmentSlotId { get; set; }
    public int BranchId { get; set; }
    public int ServiceTypeId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string VehicleRegistration { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public class BookingConfirmationDto
{
    public int AppointmentId { get; set; }
    public string ReferenceNumber { get; set; } = string.Empty;
    public AppointmentStatus Status { get; set; }
}

public class AvailableSlotDto
{
    public int SlotId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public int BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public int MechanicId { get; set; }
    public string MechanicName { get; set; } = string.Empty;
    public int ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; } = string.Empty;
}

public class AppointmentDetailDto
{
    public int AppointmentId { get; set; }
    public string ReferenceNumber { get; set; } = string.Empty;
    public AppointmentStatus Status { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string VehicleRegistration { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public DateTime SlotStartTime { get; set; }
    public DateTime SlotEndTime { get; set; }
    public int BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public int MechanicId { get; set; }
    public string MechanicName { get; set; } = string.Empty;
    public int ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; } = string.Empty;
    public List<WorkNoteDto> WorkNotes { get; set; } = new();
}

public class WorkNoteDto
{
    public int Id { get; set; }
    public string Note { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}

public class AddWorkNoteRequest
{
    public string Note { get; set; } = string.Empty;
}

public class UpdateAppointmentStatusRequest
{
    public AppointmentStatus Status { get; set; }
}
