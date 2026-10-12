using Microsoft.EntityFrameworkCore;
using TaskManagementApp.Api.Models;

namespace TaskManagementApp.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Priority);
            entity.HasIndex(e => e.DueDate);
        });
    }

    public void SeedInitialData()
    {
        if (!Tasks.Any())
        {
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            var tomorrow = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd");
            var nextWeek = DateTime.UtcNow.AddDays(7).ToString("yyyy-MM-dd");
            var nowStr = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

            Tasks.AddRange(
                new TaskItem
                {
                    Title = "Review quarterly project roadmap & deliverables",
                    Description = "Sync with product and engineering teams to align on upcoming milestone deliverables.",
                    Status = "pending",
                    Priority = "high",
                    Category = "Work",
                    DueDate = tomorrow,
                    CreatedAt = nowStr,
                    UpdatedAt = nowStr
                },
                new TaskItem
                {
                    Title = "Complete frontend responsive layout",
                    Description = "Implement modern glassmorphic dashboard with stats counters and Lucide icons.",
                    Status = "completed",
                    Priority = "high",
                    Category = "Work",
                    DueDate = today,
                    CreatedAt = nowStr,
                    UpdatedAt = nowStr
                },
                new TaskItem
                {
                    Title = "Weekly grocery shopping & meal prep",
                    Description = "Stock up on organic produce, fruits, and prepare meals for the upcoming week.",
                    Status = "pending",
                    Priority = "medium",
                    Category = "Personal",
                    DueDate = nextWeek,
                    CreatedAt = nowStr,
                    UpdatedAt = nowStr
                },
                new TaskItem
                {
                    Title = "Read 2 chapters of System Design Interview",
                    Description = "Focus on distributed cache consistency and database replication strategies.",
                    Status = "pending",
                    Priority = "low",
                    Category = "Study",
                    DueDate = nextWeek,
                    CreatedAt = nowStr,
                    UpdatedAt = nowStr
                }
            );

            SaveChanges();
        }
    }
}
