using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Exam1.Entities;
using Exam1.Middleware;
using MediatR;
using FluentValidation;
using Exam1.Behaviors;
using Exam1.Logging;
using Microsoft.OpenApi.Models;
using Exam1.Services;
using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Set QuestPDF License
QuestPDF.Settings.License = LicenseType.Community;

// Add Serilog
SerilogConfig.ConfigureSerilog();
builder.Host.UseSerilog();

// Add MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// Add FluentValidation
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

// Add DbContext
builder.Services.AddDbContext<Exam1Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServerDB")));

// Add Services
builder.Services.AddScoped<PdfReportService>();

// Add Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Exam1 API", Version = "v1" });
});

// Add Controllers
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod() // Izinkan semua method (GET, POST, dll.)
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Use Error Handling Middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

// Enable Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Exam1 API V1");
        c.RoutePrefix = "swagger"; // URL untuk mengakses Swagger UI
    });
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();