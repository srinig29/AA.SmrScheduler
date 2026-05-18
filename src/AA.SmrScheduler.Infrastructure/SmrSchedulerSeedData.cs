using AA.SmrScheduler.Domain;
using Microsoft.EntityFrameworkCore;

namespace AA.SmrScheduler.Infrastructure;

public static class SmrSchedulerSeedData
{
    public static async Task SeedSlotsAsync(SmrSchedulerDbContext dbContext)
    {
        if (await dbContext.AppointmentSlots.AnyAsync())
        {
            return;
        }

        var mechanics = await dbContext.Mechanics.AsNoTracking().ToListAsync();
        var serviceTypes = await dbContext.ServiceTypes.AsNoTracking().ToListAsync();

        if (mechanics.Count == 0 || serviceTypes.Count == 0)
        {
            return;
        }

        var startDate = DateTime.Today;
        var slots = new List<AppointmentSlot>();

        for (var dayOffset = 0; dayOffset < 7; dayOffset++)
        {
            var date = startDate.AddDays(dayOffset);

            foreach (var mechanic in mechanics)
            {
                for (var serviceIndex = 0; serviceIndex < serviceTypes.Count; serviceIndex++)
                {
                    var serviceType = serviceTypes[serviceIndex];
                    var startTime = date.AddHours(8 + (serviceIndex * 2));

                    slots.Add(new AppointmentSlot
                    {
                        BranchId = mechanic.BranchId,
                        MechanicId = mechanic.Id,
                        ServiceTypeId = serviceType.Id,
                        StartTime = startTime,
                        EndTime = startTime.AddMinutes(serviceType.DurationMinutes)
                    });
                }
            }
        }

        await dbContext.AppointmentSlots.AddRangeAsync(slots);
        await dbContext.SaveChangesAsync();
    }
}
