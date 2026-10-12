using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using TaskManagementApp.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Configure port 5000 to seamlessly match the React Vite dev proxy
builder.WebHost.UseUrls("http://localhost:5000");

// Configure SQLite DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=tasks.db";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// Configure CORS for Vite React client
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure Controllers with camelCase JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "TaskFlow REST API (.NET 8)",
        Version = "v1",
        Description = "ASP.NET Core Web API with SQLite persistence for Task Management App"
    });
});

var app = builder.Build();

// Auto-migrate / Ensure SQLite schema exists and seed sample tasks on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    db.SeedInitialData();
}

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskFlow API v1");
    });
}

// Global request logger
app.Use(async (context, next) =>
{
    var start = DateTime.UtcNow;
    await next();
    var duration = (DateTime.UtcNow - start).TotalMilliseconds;
    Console.WriteLine($"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] {context.Request.Method} {context.Request.Path} {context.Response.StatusCode} - {duration:0.0}ms");
});

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

Console.WriteLine("===============================================");
Console.WriteLine("🚀 TaskFlow .NET 8 Web API is running!");
Console.WriteLine("📡 URL: http://localhost:5000");
Console.WriteLine("🩺 Health check: http://localhost:5000/api/health");
Console.WriteLine("📋 Swagger Docs: http://localhost:5000/swagger");
Console.WriteLine("===============================================");

app.Run();
