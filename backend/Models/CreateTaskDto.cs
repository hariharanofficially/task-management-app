using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TaskManagementApp.Api.Models;

public class CreateTaskDto
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(255, ErrorMessage = "Title must be at most 255 characters.")]
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; } = "pending";

    [JsonPropertyName("priority")]
    public string? Priority { get; set; } = "medium";

    [JsonPropertyName("category")]
    public string? Category { get; set; } = "General";

    [JsonPropertyName("due_date")]
    public string? DueDate { get; set; }
}
