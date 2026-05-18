namespace AA.SmrScheduler.Domain;

public class Appointment
{
    public int Id { get; set; }

    public string ReferenceNumber { get; set; } = string.Empty;

    public int AppointmentSlotId { get; set; }
    public AppointmentSlot AppointmentSlot { get; set; } = null!;

    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string VehicleRegistration { get; set; } = string.Empty;

    public string Notes { get; set; } = string.Empty;

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public List<WorkNote> WorkNotes { get; set; } = new();
}