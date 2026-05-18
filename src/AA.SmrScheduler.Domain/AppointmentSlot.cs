namespace AA.SmrScheduler.Domain;

public class AppointmentSlot
{
    public int Id { get; set; }

    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public int BranchId { get; set; }
    public Branch Branch { get; set; } = null!;

    public int MechanicId { get; set; }
    public Mechanic Mechanic { get; set; } = null!;

    public int ServiceTypeId { get; set; }
    public ServiceType ServiceType { get; set; } = null!;

    public Appointment? Appointment { get; set; }
}