using System.Text.Json.Serialization;

namespace TaskManagementApp.Api.Models;

public class TaskStatsDto
{
    [JsonPropertyName("total")]
    public int Total { get; set; }

    [JsonPropertyName("completed")]
    public int Completed { get; set; }

    [JsonPropertyName("pending")]
    public int Pending { get; set; }

    [JsonPropertyName("highPriority")]
    public int HighPriority { get; set; }

    [JsonPropertyName("overdue")]
    public int Overdue { get; set; }

    [JsonPropertyName("completionRate")]
    public int CompletionRate { get; set; }
}
