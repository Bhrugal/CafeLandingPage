using Microsoft.AspNetCore.Mvc;
using Dapper;
using CafeLandingPage.Data;
using CafeLandingPage.DTOs;
using CafeLandingPage.Models;

namespace CafeLandingPage.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
    private readonly CafeDatabase _database;
    private readonly ILogger<ReservationsController> _logger;

    public ReservationsController(CafeDatabase database, ILogger<ReservationsController> logger)
    {
        _database = database;
        _logger = logger;
    }

    /// <summary>
    /// Book a table and save reservation to SQLite database
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ReservationResponseDto>>> CreateReservation([FromBody] CreateReservationDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
            return BadRequest(ApiResponse.Fail(errors));
        }

        try
        {
            using var connection = _database.CreateConnection();
            connection.Open();

            var now = DateTime.UtcNow.ToString("o");
            var phoneClean = dto.Phone.Trim();

            // 1. Locate or create customer record
            var customer = await connection.QueryFirstOrDefaultAsync<Customer>(
                "SELECT * FROM Customers WHERE Phone = @Phone;",
                new { Phone = phoneClean });

            int customerId;
            if (customer == null)
            {
                var insertCustomerSql = @"
                    INSERT INTO Customers (FullName, Phone, Email, CreatedAt)
                    VALUES (@FullName, @Phone, @Email, @CreatedAt);
                    SELECT last_insert_rowid();
                ";
                customerId = await connection.ExecuteScalarAsync<int>(insertCustomerSql, new
                {
                    FullName = dto.GuestName.Trim(),
                    Phone = phoneClean,
                    Email = dto.Email.Trim(),
                    CreatedAt = now
                });
            }
            else
            {
                customerId = customer.Id;
            }

            // 2. Generate unique reservation reference code
            string refCode;
            int existing;
            do
            {
                refCode = $"RES-{Random.Shared.Next(1000, 9999)}";
                existing = await connection.ExecuteScalarAsync<int>(
                    "SELECT COUNT(*) FROM Reservations WHERE ReferenceCode = @RefCode;",
                    new { RefCode = refCode });
            }
            while (existing > 0);

            // 3. Insert reservation
            var insertReservationSql = @"
                INSERT INTO Reservations (ReferenceCode, CustomerId, GuestName, Email, Phone, PartySize, ReservationDate, ReservationTime, SeatingZone, SpecialNotes, PaymentMethod, PaymentStatus, TotalAmount, Status, CreatedAt)
                VALUES (@ReferenceCode, @CustomerId, @GuestName, @Email, @Phone, @PartySize, @ReservationDate, @ReservationTime, @SeatingZone, @SpecialNotes, @PaymentMethod, @PaymentStatus, @TotalAmount, @Status, @CreatedAt);
                SELECT last_insert_rowid();
            ";

            var reservationId = await connection.ExecuteScalarAsync<int>(insertReservationSql, new
            {
                ReferenceCode = refCode,
                CustomerId = customerId,
                GuestName = dto.GuestName.Trim(),
                Email = dto.Email.Trim(),
                Phone = phoneClean,
                PartySize = dto.PartySize,
                ReservationDate = dto.ReservationDate.Trim(),
                ReservationTime = dto.ReservationTime.Trim(),
                SeatingZone = dto.SeatingZone.Trim(),
                SpecialNotes = dto.SpecialNotes?.Trim(),
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = "Confirmed",
                TotalAmount = 0.0,
                Status = "Confirmed",
                CreatedAt = now
            });

            _logger.LogInformation("Reservation {RefCode} confirmed for {GuestName}", refCode, dto.GuestName);

            var responseDto = new ReservationResponseDto
            {
                Id = reservationId,
                ReferenceCode = refCode,
                GuestName = dto.GuestName.Trim(),
                Email = dto.Email.Trim(),
                Phone = phoneClean,
                PartySize = dto.PartySize,
                ReservationDate = dto.ReservationDate.Trim(),
                ReservationTime = dto.ReservationTime.Trim(),
                SeatingZone = dto.SeatingZone.Trim(),
                SpecialNotes = dto.SpecialNotes,
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = "Confirmed",
                TotalAmount = 0.0m,
                Status = "Confirmed",
                CreatedAt = DateTime.Parse(now)
            };

            return CreatedAtAction(nameof(GetReservationByCode), new { code = refCode }, 
                ApiResponse<ReservationResponseDto>.Ok(responseDto, "Table reserved and saved successfully!"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating reservation");
            return StatusCode(500, ApiResponse.Fail("Unable to process table reservation at this time."));
        }
    }

    /// <summary>
    /// Retrieve all reservations
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ReservationResponseDto>>>> GetAllReservations([FromQuery] int limit = 50)
    {
        using var connection = _database.CreateConnection();

        var list = (await connection.QueryAsync<ReservationResponseDto>(
            "SELECT * FROM Reservations ORDER BY CreatedAt DESC LIMIT @Limit;",
            new { Limit = limit })).ToList();

        return Ok(ApiResponse<List<ReservationResponseDto>>.Ok(list));
    }

    /// <summary>
    /// Retrieve reservation by confirmation code (e.g. RES-1234)
    /// </summary>
    [HttpGet("{code}")]
    public async Task<ActionResult<ApiResponse<ReservationResponseDto>>> GetReservationByCode(string code)
    {
        using var connection = _database.CreateConnection();

        var res = await connection.QueryFirstOrDefaultAsync<ReservationResponseDto>(
            "SELECT * FROM Reservations WHERE LOWER(ReferenceCode) = @Code;",
            new { Code = code.Trim().ToLower() });

        if (res == null)
        {
            return NotFound(ApiResponse.Fail($"Reservation with code '{code}' was not found."));
        }

        return Ok(ApiResponse<ReservationResponseDto>.Ok(res));
    }
}
