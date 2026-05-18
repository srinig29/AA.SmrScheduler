using AA.SmrScheduler.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AA.SmrScheduler.Api.Controllers;

[ApiController]
[Route("api/reference-data")]
public class ReferenceDataController : ControllerBase
{
    private readonly SmrSchedulerDbContext _dbContext;

    public ReferenceDataController(SmrSchedulerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("branches")]
    public async Task<ActionResult<List<object>>> GetBranches()
    {
        var branches = await _dbContext.Branches
            .AsNoTracking()
            .OrderBy(b => b.Name)
            .Select(b => new { b.Id, b.Name })
            .ToListAsync();

        return Ok(branches);
    }

    [HttpGet("service-types")]
    public async Task<ActionResult<List<object>>> GetServiceTypes()
    {
        var serviceTypes = await _dbContext.ServiceTypes
            .AsNoTracking()
            .OrderBy(s => s.Name)
            .Select(s => new { s.Id, s.Name, s.DurationMinutes })
            .ToListAsync();

        return Ok(serviceTypes);
    }
}
