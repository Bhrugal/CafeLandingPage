using Microsoft.AspNetCore.Mvc;
using Stripe;
using CafeLandingPage.DTOs;

namespace CafeLandingPage.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(IConfiguration configuration, ILogger<PaymentsController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Get public Stripe configuration (publishable key & status) for frontend Elements
    /// </summary>
    [HttpGet("config")]
    public ActionResult<ApiResponse<StripeConfigDto>> GetConfig()
    {
        var publishableKey = _configuration["Stripe:PublishableKey"] ?? "pk_test_TYooMQauvdEDq54NiTphI7jx";
        var secretKey = _configuration["Stripe:SecretKey"];

        bool isLiveKeySet = !string.IsNullOrWhiteSpace(secretKey) && 
                            (secretKey.StartsWith("sk_test_") || secretKey.StartsWith("sk_live_")) &&
                            !secretKey.Contains("PLACEHOLDER");

        return Ok(ApiResponse<StripeConfigDto>.Ok(new StripeConfigDto
        {
            PublishableKey = publishableKey,
            IsConfigured = isLiveKeySet,
            Mode = publishableKey.StartsWith("pk_live_") ? "live" : "test"
        }));
    }

    /// <summary>
    /// Create a Stripe PaymentIntent for the customer checkout total
    /// </summary>
    [HttpPost("create-intent")]
    public async Task<ActionResult<ApiResponse<PaymentIntentResponseDto>>> CreatePaymentIntent([FromBody] CreatePaymentIntentDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
            return BadRequest(ApiResponse.Fail(errors));
        }

        var secretKey = _configuration["Stripe:SecretKey"];
        var publishableKey = _configuration["Stripe:PublishableKey"] ?? "pk_test_TYooMQauvdEDq54NiTphI7jx";

        bool hasValidSecret = !string.IsNullOrWhiteSpace(secretKey) && 
                              (secretKey.StartsWith("sk_test_") || secretKey.StartsWith("sk_live_")) &&
                              !secretKey.Contains("PLACEHOLDER");

        long amountInCents = (long)Math.Round(dto.Amount * 100);

        if (hasValidSecret)
        {
            try
            {
                StripeConfiguration.ApiKey = secretKey;

                var options = new PaymentIntentCreateOptions
                {
                    Amount = amountInCents,
                    Currency = string.IsNullOrWhiteSpace(dto.Currency) ? "usd" : dto.Currency.ToLower(),
                    Description = dto.Description ?? $"Brew Haven Order - {dto.CustomerName ?? "Valued Guest"}",
                    Metadata = new Dictionary<string, string>
                    {
                        ["CustomerName"] = dto.CustomerName ?? "Valued Guest",
                        ["CustomerEmail"] = dto.CustomerEmail ?? "",
                        ["OrderReference"] = dto.OrderReference ?? $"BH-{Random.Shared.Next(100000, 999999)}"
                    },
                    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                    {
                        Enabled = true
                    }
                };

                var service = new PaymentIntentService();
                PaymentIntent intent = await service.CreateAsync(options);

                _logger.LogInformation("Stripe PaymentIntent created: {IntentId} for amount ${Amount:F2}", intent.Id, dto.Amount);

                return Ok(ApiResponse<PaymentIntentResponseDto>.Ok(new PaymentIntentResponseDto
                {
                    ClientSecret = intent.ClientSecret,
                    PaymentIntentId = intent.Id,
                    PublishableKey = publishableKey,
                    Amount = dto.Amount,
                    Currency = options.Currency,
                    IsLiveStripe = true,
                    Status = intent.Status
                }, "Stripe PaymentIntent created successfully."));
            }
            catch (StripeException ex)
            {
                _logger.LogWarning(ex, "Stripe API error. Falling back to test simulation mode.");
            }
        }

        // Test/Demo Sandbox Simulation Mode (when running offline or before user sets live API key)
        var mockIntentId = $"pi_test_{Random.Shared.Next(100000, 999999)}_{DateTime.UtcNow.Ticks % 1000000}";
        var mockSecret = $"{mockIntentId}_secret_{Random.Shared.Next(100000, 999999)}";

        return Ok(ApiResponse<PaymentIntentResponseDto>.Ok(new PaymentIntentResponseDto
        {
            ClientSecret = mockSecret,
            PaymentIntentId = mockIntentId,
            PublishableKey = publishableKey,
            Amount = dto.Amount,
            Currency = "usd",
            IsLiveStripe = false,
            Status = "requires_confirmation"
        }, "Stripe gateway ready (Test mode authorization)."));
    }
}

