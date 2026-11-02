using Microsoft.AspNetCore.Mvc;
using Dapper;
using CafeLandingPage.Data;
using CafeLandingPage.DTOs;
using CafeLandingPage.Models;

namespace CafeLandingPage.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly CafeDatabase _database;

    public CustomersController(CafeDatabase database)
    {
        _database = database;
    }

    /// <summary>
    /// Retrieve all registered customers and their order/reservation counts
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse>> GetAllCustomers()
    {
        using var connection = _database.CreateConnection();

        var sql = @"
            SELECT 
                c.Id, 
                c.FullName, 
                c.Phone, 
                c.Email, 
                c.CreatedAt,
                (SELECT COUNT(*) FROM Orders o WHERE o.CustomerId = c.Id) AS TotalOrders,
                (SELECT COUNT(*) FROM Reservations r WHERE r.CustomerId = c.Id) AS TotalReservations
            FROM Customers c
            ORDER BY c.CreatedAt DESC;
        ";

        var customers = await connection.QueryAsync(sql);
        return Ok(ApiResponse.SuccessResult("Customers retrieved successfully", customers));
    }

    /// <summary>
    /// Retrieve single customer profile and order history by phone number
    /// </summary>
    [HttpGet("{phone}")]
    public async Task<ActionResult<ApiResponse>> GetCustomerByPhone(string phone)
    {
        using var connection = _database.CreateConnection();

        var customer = await connection.QueryFirstOrDefaultAsync<Customer>(
            "SELECT * FROM Customers WHERE Phone = @Phone;",
            new { Phone = phone.Trim() });

        if (customer == null)
        {
            return NotFound(ApiResponse.Fail($"Customer with phone '{phone}' was not found."));
        }

        var orders = await connection.QueryAsync<Order>(
            "SELECT * FROM Orders WHERE CustomerId = @CustomerId ORDER BY CreatedAt DESC;",
            new { CustomerId = customer.Id });

        var reservations = await connection.QueryAsync<Reservation>(
            "SELECT * FROM Reservations WHERE CustomerId = @CustomerId ORDER BY CreatedAt DESC;",
            new { CustomerId = customer.Id });

        var result = new
        {
            customer.Id,
            customer.FullName,
            customer.Phone,
            customer.Email,
            customer.CreatedAt,
            Orders = orders,
            Reservations = reservations
        };

        return Ok(ApiResponse.SuccessResult("Customer profile found", result));
    }
}
