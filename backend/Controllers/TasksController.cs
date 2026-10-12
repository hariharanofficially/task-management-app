using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementApp.Api.Data;
using TaskManagementApp.Api.Models;

namespace TaskManagementApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;
    private static readonly HashSet<string> ValidPriorities = new(StringComparer.OrdinalIgnoreCase) { "low", "medium", "high" };
    private static readonly HashSet<string> ValidStatuses = new(StringComparer.OrdinalIgnoreCase) { "pending", "completed" };

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/tasks/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var today = DateTime.UtcNow.ToString("yyyy-MM-dd");

        var total = await _context.Tasks.CountAsync();
        var completed = await _context.Tasks.CountAsync(t => t.Status == "completed");
        var pending = await _context.Tasks.CountAsync(t => t.Status == "pending");
        var highPriority = await _context.Tasks.CountAsync(t => t.Status == "pending" && t.Priority == "high");
        var overdue = await _context.Tasks.CountAsync(t => t.Status == "pending" && t.DueDate != null && t.DueDate != "" && string.Compare(t.DueDate, today) < 0);

        var completionRate = total > 0 ? (int)Math.Round((double)completed / total * 100) : 0;

        var stats = new TaskStatsDto
        {
            Total = total,
            Completed = completed,
            Pending = pending,
            HighPriority = highPriority,
            Overdue = overdue,
            CompletionRate = completionRate
        };

        return Ok(ApiResponse<TaskStatsDto>.Ok(stats));
    }

    // GET /api/tasks
    [HttpGet]
    public async Task<IActionResult> GetTasks(
        [FromQuery] string? search = null,
        [FromQuery] string? status = null,
        [FromQuery] string? priority = null,
        [FromQuery] string? category = null,
        [FromQuery] string? sort = null)
    {
        IQueryable<TaskItem> query = _context.Tasks.AsNoTracking();

        // Keyword search in title or description
        if (!string.IsNullOrWhiteSpace(search))
        {
            var trimmedSearch = search.Trim().ToLower();
            query = query.Where(t => t.Title.ToLower().Contains(trimmedSearch) ||
                                     t.Description.ToLower().Contains(trimmedSearch));
        }

        // Filter by status (all, pending, completed)
        if (!string.IsNullOrWhiteSpace(status) && !status.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            var lowerStatus = status.ToLower();
            query = query.Where(t => t.Status == lowerStatus);
        }

        // Filter by priority
        if (!string.IsNullOrWhiteSpace(priority) && !priority.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            var lowerPriority = priority.ToLower();
            query = query.Where(t => t.Priority == lowerPriority);
        }

        // Filter by category
        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(t => t.Category == category);
        }

        // Sort ordering
        query = sort switch
        {
            "due_date_asc" => query.OrderBy(t => string.IsNullOrEmpty(t.DueDate) ? 1 : 0)
                                   .ThenBy(t => t.DueDate),
            "due_date_desc" => query.OrderBy(t => string.IsNullOrEmpty(t.DueDate) ? 1 : 0)
                                    .ThenByDescending(t => t.DueDate),
            "created_asc" => query.OrderBy(t => t.CreatedAt),
            "priority_desc" => query.OrderBy(t => t.Priority == "high" ? 1 :
                                                  t.Priority == "medium" ? 2 :
                                                  t.Priority == "low" ? 3 : 4),
            _ => query.OrderByDescending(t => t.CreatedAt)
        };

        var tasks = await query.ToListAsync();
        return Ok(ApiResponse<List<TaskItem>>.Ok(tasks, count: tasks.Count));
    }

    // GET /api/tasks/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetTaskById(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound(ApiResponse<TaskItem>.Fail($"Task with ID {id} not found."));
        }

        return Ok(ApiResponse<TaskItem>.Ok(task));
    }

    // POST /api/tasks
    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            return BadRequest(ApiResponse<TaskItem>.Fail("Title is required and must not be empty."));
        }

        var status = !string.IsNullOrWhiteSpace(dto.Status) && ValidStatuses.Contains(dto.Status)
            ? dto.Status.ToLower()
            : "pending";

        var priority = !string.IsNullOrWhiteSpace(dto.Priority) && ValidPriorities.Contains(dto.Priority)
            ? dto.Priority.ToLower()
            : "medium";

        var category = !string.IsNullOrWhiteSpace(dto.Category)
            ? dto.Category.Trim()
            : "General";

        var nowStr = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

        var newTask = new TaskItem
        {
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim() ?? string.Empty,
            Status = status,
            Priority = priority,
            Category = category,
            DueDate = string.IsNullOrWhiteSpace(dto.DueDate) ? null : dto.DueDate.Trim(),
            CreatedAt = nowStr,
            UpdatedAt = nowStr
        };

        _context.Tasks.Add(newTask);
        await _context.SaveChangesAsync();

        return StatusCode(201, ApiResponse<TaskItem>.Ok(newTask, "Task created successfully"));
    }

    // PUT /api/tasks/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskDto dto)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound(ApiResponse<TaskItem>.Fail($"Task with ID {id} not found."));
        }

        if (dto.Title != null)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return BadRequest(ApiResponse<TaskItem>.Fail("Title cannot be empty."));
            }
            task.Title = dto.Title.Trim();
        }

        if (dto.Description != null)
        {
            task.Description = dto.Description.Trim();
        }

        if (dto.Status != null)
        {
            if (!ValidStatuses.Contains(dto.Status))
            {
                return BadRequest(ApiResponse<TaskItem>.Fail("Status must be either 'pending' or 'completed'."));
            }
            task.Status = dto.Status.ToLower();
        }

        if (dto.Priority != null)
        {
            if (!ValidPriorities.Contains(dto.Priority))
            {
                return BadRequest(ApiResponse<TaskItem>.Fail("Priority must be 'low', 'medium', or 'high'."));
            }
            task.Priority = dto.Priority.ToLower();
        }

        if (dto.Category != null)
        {
            task.Category = dto.Category.Trim();
        }

        if (dto.DueDate != null)
        {
            task.DueDate = string.IsNullOrWhiteSpace(dto.DueDate) ? null : dto.DueDate.Trim();
        }

        task.UpdatedAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

        await _context.SaveChangesAsync();
        return Ok(ApiResponse<TaskItem>.Ok(task, "Task updated successfully"));
    }

    // PATCH /api/tasks/{id}/toggle
    [HttpPatch("{id:int}/toggle")]
    public async Task<IActionResult> ToggleTaskStatus(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound(ApiResponse<TaskItem>.Fail($"Task with ID {id} not found."));
        }

        task.Status = task.Status == "completed" ? "pending" : "completed";
        task.UpdatedAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

        await _context.SaveChangesAsync();
        return Ok(ApiResponse<TaskItem>.Ok(task, $"Task marked as {task.Status}"));
    }

    // DELETE /api/tasks/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound(ApiResponse<object>.Fail($"Task with ID {id} not found."));
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.Ok(new { id }, "Task deleted successfully"));
    }
}
