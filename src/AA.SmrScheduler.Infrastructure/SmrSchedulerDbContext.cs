using AA.SmrScheduler.Domain;
using Microsoft.EntityFrameworkCore;

namespace AA.SmrScheduler.Infrastructure;

public class SmrSchedulerDbContext : DbContext
{
    public SmrSchedulerDbContext(DbContextOptions<SmrSchedulerDbContext> options)
        : base(options)
    {
    }

    public DbSet<Branch> Branches => Set<Branch>();
    public DbSet<Mechanic> Mechanics => Set<Mechanic>();
    public DbSet<ServiceType> ServiceTypes => Set<ServiceType>();
    public DbSet<AppointmentSlot> AppointmentSlots => Set<AppointmentSlot>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<WorkNote> WorkNotes => Set<WorkNote>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Mechanic>()
            .HasOne(m => m.Branch)
            .WithMany()
            .HasForeignKey(m => m.BranchId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<AppointmentSlot>()
            .HasOne(s => s.Branch)
            .WithMany()
            .HasForeignKey(s => s.BranchId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<AppointmentSlot>()
            .HasOne(s => s.Mechanic)
            .WithMany()
            .HasForeignKey(s => s.MechanicId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<AppointmentSlot>()
            .HasOne(s => s.ServiceType)
            .WithMany()
            .HasForeignKey(s => s.ServiceTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.AppointmentSlot)
            .WithOne(s => s.Appointment)
            .HasForeignKey<Appointment>(a => a.AppointmentSlotId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<WorkNote>()
            .HasOne(w => w.Appointment)
            .WithMany(a => a.WorkNotes)
            .HasForeignKey(w => w.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Appointment>()
            .HasIndex(x => x.ReferenceNumber)
            .IsUnique();

        modelBuilder.Entity<Appointment>()
            .HasIndex(x => x.AppointmentSlotId)
            .IsUnique();

        modelBuilder.Entity<Branch>().HasData(
            new Branch { Id = 1, Name = "Dublin" },
            new Branch { Id = 2, Name = "Cork" }
        );

        modelBuilder.Entity<ServiceType>().HasData(
            new ServiceType { Id = 1, Name = "Inspection", DurationMinutes = 60 },
            new ServiceType { Id = 2, Name = "Service", DurationMinutes = 90 },
            new ServiceType { Id = 3, Name = "Repair", DurationMinutes = 120 },
            new ServiceType { Id = 4, Name = "Diagnostics", DurationMinutes = 60 }
        );

        modelBuilder.Entity<Mechanic>().HasData(
            new Mechanic { Id = 1, Name = "John Murphy", BranchId = 1 },
            new Mechanic { Id = 2, Name = "Sarah Kelly", BranchId = 1 },
            new Mechanic { Id = 3, Name = "Michael O'Brien", BranchId = 2 }
        );
    }
}