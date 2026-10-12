using System.Text.Json.Serialization;

namespace TaskManagementApp.Api.Models;

public class ApiResponse<T>
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("message")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Message { get; set; }

    [JsonPropertyName("count")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Count { get; set; }

    [JsonPropertyName("data")]
    public T? Data { get; set; }

    [JsonPropertyName("error")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Error { get; set; }

    [JsonPropertyName("errors")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string>? Errors { get; set; }

    public static ApiResponse<T> Ok(T? data, string? message = null, int? count = null)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Count = count,
            Data = data
        };
    }

    public static ApiResponse<T> Fail(string error, List<string>? errors = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Error = error,
            Errors = errors
        };
    }
}
