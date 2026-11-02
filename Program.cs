using CafeLandingPage.Data;

// Find the directory containing wwwroot by searching current directory and parents of AppContext.BaseDirectory
string contentRoot = Directory.GetCurrentDirectory();

if (!Directory.Exists(Path.Combine(contentRoot, "wwwroot")))
{
    var searchDir = new DirectoryInfo(AppContext.BaseDirectory);
    while (searchDir != null && !Directory.Exists(Path.Combine(searchDir.FullName, "wwwroot")))
    {
        searchDir = searchDir.Parent;
    }

    if (searchDir != null)
    {
        contentRoot = searchDir.FullName;
    }
    else
    {
        contentRoot = AppContext.BaseDirectory;
    }
}

var webRoot = Path.Combine(contentRoot, "wwwroot");

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = contentRoot,
    WebRootPath = webRoot
});

// Default to http://localhost:5000 if not specified by ASPNETCORE_URLS
if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ASPNETCORE_URLS")))
{
    builder.WebHost.UseUrls("http://localhost:5000");
}

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "Brew Haven Cafe & Roastery API",
        Version = "v1",
        Description = "ASP.NET Core REST API for Cafe landing page, online ordering, reservations, and customer storage in SQLite."
    });
});

// Configure SQLite Database Service
builder.Services.AddSingleton<CafeDatabase>();

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Auto-create SQLite database schema and seed initial data
try
{
    var database = app.Services.GetRequiredService<CafeDatabase>();
    await database.InitializeDatabaseAsync();
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred while initializing the SQLite database.");
}

// Enable Swagger UI (accessible at /swagger)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Brew Haven Cafe API v1");
    c.RoutePrefix = "swagger";
});

// Serve static frontend from wwwroot (index.html, css, js, images)
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();

// Fallback to index.html for non-API routes
app.MapFallbackToFile("index.html");

// Automatically launch default browser on startup
app.Lifetime.ApplicationStarted.Register(() =>
{
    try
    {
        var targetUrl = "http://localhost:5000/";
        System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
        {
            FileName = targetUrl,
            UseShellExecute = true
        });
    }
    catch
    {
        // Handled for environments without shell execute
    }
});

app.Run();
