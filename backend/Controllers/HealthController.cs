using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace TaskManagementApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private static readonly Process CurrentProcess = Process.GetCurrentProcess();

    [HttpGet]
    public IActionResult GetHealth()
    {
        var uptimeSeconds = (DateTime.UtcNow - CurrentProcess.StartTime.ToUniversalTime()).TotalSeconds;

        return Ok(new
        {
            status = "ok",
            uptime = Math.Round(uptimeSeconds, 2),
            timestamp = DateTime.UtcNow.ToString("o"),
            service = "Task Management API (.NET 8)"
        });
    }
}
