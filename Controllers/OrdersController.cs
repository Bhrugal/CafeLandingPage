using Microsoft.AspNetCore.Mvc;
using Dapper;
using CafeLandingPage.Data;
using CafeLandingPage.DTOs;
using CafeLandingPage.Models;

namespace CafeLandingPage.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly CafeDatabase _database;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(CafeDatabase database, ILogger<OrdersController> logger)
    {
        _database = database;
        _logger = logger;
    }

    /// <summary>
    /// Place a new customer order and save to SQLite database
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<OrderResponseDto>>> CreateOrder([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid)
        {
            var errors = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
            return BadRequest(ApiResponse.Fail(errors));
        }

        if (dto.Items == null || dto.Items.Count == 0)
        {
            return BadRequest(ApiResponse.Fail("Order must contain at least one item."));
        }

        try
        {
            using var connection = _database.CreateConnection();
            connection.Open();

            var now = DateTime.UtcNow.ToString("o");
            var phoneClean = dto.CustomerPhone.Trim();

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
                    FullName = dto.CustomerName.Trim(),
                    Phone = phoneClean,
                    Email = dto.CustomerEmail?.Trim(),
                    CreatedAt = now
                });
            }
            else
            {
                customerId = customer.Id;
                // Update customer name/email if changed
                await connection.ExecuteAsync(
                    "UPDATE Customers SET FullName = @FullName, Email = COALESCE(@Email, Email) WHERE Id = @Id;",
                    new { FullName = dto.CustomerName.Trim(), Email = dto.CustomerEmail?.Trim(), Id = customerId });
            }

            // 2. Calculate Order Totals
            decimal subtotal = dto.Items.Sum(i => i.UnitPrice * i.Quantity);
            decimal discount = 0;

            if (!string.IsNullOrWhiteSpace(dto.PromoCode) && 
                dto.PromoCode.Trim().Equals("HAVEN10", StringComparison.OrdinalIgnoreCase))
            {
                discount = Math.Round(subtotal * 0.10m, 2);
            }

            decimal taxable = Math.Max(0, subtotal - discount);
            decimal tax = Math.Round(taxable * 0.05m, 2);
            decimal grandTotal = taxable + tax;

            // 3. Generate unique order reference
            string orderRef;
            int existingCount;
            do
            {
                orderRef = $"BH-{Random.Shared.Next(100000, 999999)}";
                existingCount = await connection.ExecuteScalarAsync<int>(
                    "SELECT COUNT(*) FROM Orders WHERE OrderReference = @OrderRef;",
                    new { OrderRef = orderRef });
            }
            while (existingCount > 0);

            // 4. Insert Order
            var insertOrderSql = @"
                INSERT INTO Orders (OrderReference, CustomerId, CustomerName, CustomerPhone, DiningOption, PickupTimeOrTable, SpecialNotes, PaymentMethod, Subtotal, Discount, Tax, TotalAmount, Status, CreatedAt)
                VALUES (@OrderReference, @CustomerId, @CustomerName, @CustomerPhone, @DiningOption, @PickupTimeOrTable, @SpecialNotes, @PaymentMethod, @Subtotal, @Discount, @Tax, @TotalAmount, @Status, @CreatedAt);
                SELECT last_insert_rowid();
            ";

            var orderId = await connection.ExecuteScalarAsync<int>(insertOrderSql, new
            {
                OrderReference = orderRef,
                CustomerId = customerId,
                CustomerName = dto.CustomerName.Trim(),
                CustomerPhone = phoneClean,
                DiningOption = dto.DiningOption.ToLowerInvariant(),
                PickupTimeOrTable = dto.PickupTimeOrTable?.Trim() ?? "ASAP",
                SpecialNotes = dto.SpecialNotes?.Trim(),
                PaymentMethod = dto.PaymentMethod,
                Subtotal = (double)subtotal,
                Discount = (double)discount,
                Tax = (double)tax,
                TotalAmount = (double)grandTotal,
                Status = "Pending",
                CreatedAt = now
            });

            // 5. Insert Order Items
            var insertItemSql = @"
                INSERT INTO OrderItems (OrderId, MenuItemId, ItemName, ImageUrl, UnitPrice, Quantity, CustomDetails, LineTotal)
                VALUES (@OrderId, @MenuItemId, @ItemName, @ImageUrl, @UnitPrice, @Quantity, @CustomDetails, @LineTotal);
            ";

            var itemsToInsert = dto.Items.Select(item => new
            {
                OrderId = orderId,
                MenuItemId = item.MenuItemId,
                ItemName = item.ItemName.Trim(),
                ImageUrl = item.ImageUrl,
                UnitPrice = (double)item.UnitPrice,
                Quantity = item.Quantity,
                CustomDetails = item.CustomDetails ?? "Standard",
                LineTotal = (double)Math.Round(item.UnitPrice * item.Quantity, 2)
            });

            await connection.ExecuteAsync(insertItemSql, itemsToInsert);

            _logger.LogInformation("Order {OrderRef} created successfully for {Name}", orderRef, dto.CustomerName);

            var responseDto = new OrderResponseDto
            {
                Id = orderId,
                OrderReference = orderRef,
                CustomerName = dto.CustomerName.Trim(),
                CustomerPhone = phoneClean,
                DiningOption = dto.DiningOption,
                PickupTimeOrTable = dto.PickupTimeOrTable ?? "ASAP",
                SpecialNotes = dto.SpecialNotes,
                PaymentMethod = dto.PaymentMethod,
                Subtotal = subtotal,
                Discount = discount,
                Tax = tax,
                TotalAmount = grandTotal,
                Status = "Pending",
                CreatedAt = DateTime.Parse(now),
                Items = dto.Items.Select(i => new OrderItemDto
                {
                    MenuItemId = i.MenuItemId,
                    ItemName = i.ItemName,
                    ImageUrl = i.ImageUrl,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity,
                    CustomDetails = i.CustomDetails ?? "Standard",
                    LineTotal = Math.Round(i.UnitPrice * i.Quantity, 2)
                }).ToList()
            };

            return CreatedAtAction(nameof(GetOrderByReference), new { reference = orderRef }, 
                ApiResponse<OrderResponseDto>.Ok(responseDto, "Order placed and stored successfully!"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing order placement");
            return StatusCode(500, ApiResponse.Fail("An internal error occurred while saving your order. Please try again."));
        }
    }

    /// <summary>
    /// Retrieve all recent orders stored in the database
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<OrderResponseDto>>>> GetAllOrders([FromQuery] int limit = 50)
    {
        using var connection = _database.CreateConnection();

        var orders = (await connection.QueryAsync<Order>(
            "SELECT * FROM Orders ORDER BY CreatedAt DESC LIMIT @Limit;",
            new { Limit = limit })).ToList();

        if (orders.Count == 0)
        {
            return Ok(ApiResponse<List<OrderResponseDto>>.Ok(new List<OrderResponseDto>()));
        }

        var orderIds = orders.Select(o => o.Id).ToList();
        var items = (await connection.QueryAsync<OrderItem>(
            "SELECT * FROM OrderItems WHERE OrderId IN @Ids;",
            new { Ids = orderIds })).ToList();

        var result = orders.Select(o => new OrderResponseDto
        {
            Id = o.Id,
            OrderReference = o.OrderReference,
            CustomerName = o.CustomerName,
            CustomerPhone = o.CustomerPhone,
            DiningOption = o.DiningOption,
            PickupTimeOrTable = o.PickupTimeOrTable,
            SpecialNotes = o.SpecialNotes,
            PaymentMethod = o.PaymentMethod,
            Subtotal = o.Subtotal,
            Discount = o.Discount,
            Tax = o.Tax,
            TotalAmount = o.TotalAmount,
            Status = o.Status,
            CreatedAt = o.CreatedAt,
            Items = items.Where(i => i.OrderId == o.Id).Select(i => new OrderItemDto
            {
                Id = i.Id,
                MenuItemId = i.MenuItemId,
                ItemName = i.ItemName,
                ImageUrl = i.ImageUrl,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
                CustomDetails = i.CustomDetails,
                LineTotal = i.LineTotal
            }).ToList()
        }).ToList();

        return Ok(ApiResponse<List<OrderResponseDto>>.Ok(result));
    }

    /// <summary>
    /// Retrieve single order details by reference code (e.g. BH-123456)
    /// </summary>
    [HttpGet("{reference}")]
    public async Task<ActionResult<ApiResponse<OrderResponseDto>>> GetOrderByReference(string reference)
    {
        using var connection = _database.CreateConnection();

        var order = await connection.QueryFirstOrDefaultAsync<Order>(
            "SELECT * FROM Orders WHERE LOWER(OrderReference) = @Ref;",
            new { Ref = reference.Trim().ToLower() });

        if (order == null)
        {
            return NotFound(ApiResponse.Fail($"Order '{reference}' was not found."));
        }

        var items = (await connection.QueryAsync<OrderItem>(
            "SELECT * FROM OrderItems WHERE OrderId = @OrderId;",
            new { OrderId = order.Id })).ToList();

        var dto = new OrderResponseDto
        {
            Id = order.Id,
            OrderReference = order.OrderReference,
            CustomerName = order.CustomerName,
            CustomerPhone = order.CustomerPhone,
            DiningOption = order.DiningOption,
            PickupTimeOrTable = order.PickupTimeOrTable,
            SpecialNotes = order.SpecialNotes,
            PaymentMethod = order.PaymentMethod,
            Subtotal = order.Subtotal,
            Discount = order.Discount,
            Tax = order.Tax,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            CreatedAt = order.CreatedAt,
            Items = items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                MenuItemId = i.MenuItemId,
                ItemName = i.ItemName,
                ImageUrl = i.ImageUrl,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
                CustomDetails = i.CustomDetails,
                LineTotal = i.LineTotal
            }).ToList()
        };

        return Ok(ApiResponse<OrderResponseDto>.Ok(dto));
    }

    /// <summary>
    /// Update order status (Pending -> Brewing -> Ready -> Completed)
    /// </summary>
    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<ApiResponse>> UpdateOrderStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        using var connection = _database.CreateConnection();

        var rows = await connection.ExecuteAsync(
            "UPDATE Orders SET Status = @Status WHERE Id = @Id;",
            new { Status = dto.Status, Id = id });

        if (rows == 0)
        {
            return NotFound(ApiResponse.Fail("Order not found."));
        }

        return Ok(ApiResponse.SuccessResult($"Order status updated to '{dto.Status}'"));
    }
}

public class UpdateStatusDto
{
    public string Status { get; set; } = "Ready";
}
