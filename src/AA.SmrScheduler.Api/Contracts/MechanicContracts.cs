using AA.SmrScheduler.Domain;

namespace AA.SmrScheduler.Api.Contracts;

public class MechanicListItemDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
}

public class MechanicAppointmentListItemDto
{
    public int AppointmentId { get; set; }
    public string ReferenceNumber { get; set; } = string.Empty;
    public AppointmentStatus Status { get; set; }
    public DateTime SlotStartTime { get; set; }
    public DateTime SlotEndTime { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string VehicleRegistration { get; set; } = string.Empty;
    public string ServiceTypeName { get; set; } = string.Empty;
    public string BranchName { get; set; } = string.Empty;
}
