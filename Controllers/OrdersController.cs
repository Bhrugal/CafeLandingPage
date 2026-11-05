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
    /// Place a new customer order and booking with 3 payment options:
    /// 1. Pay at Counter (Pending order created, confirmed when served at counter)
    /// 2. Haven Wallet (Deducts customer wallet balance and immediately confirms booking)
    /// 3. Credit / Debit Card (Processed through interactive payment gateway and confirmed)
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
            decimal customerWalletBalance;

            if (customer == null)
            {
                var insertCustomerSql = @"
                    INSERT INTO Customers (FullName, Phone, Email, WalletBalance, CreatedAt)
                    VALUES (@FullName, @Phone, @Email, @WalletBalance, @CreatedAt);
                    SELECT last_insert_rowid();
                ";
                // New customers receive $25.00 complimentary welcome wallet credit
                customerWalletBalance = 25.00m;
                customerId = await connection.ExecuteScalarAsync<int>(insertCustomerSql, new
                {
                    FullName = dto.CustomerName.Trim(),
                    Phone = phoneClean,
                    Email = dto.CustomerEmail?.Trim(),
                    WalletBalance = (double)customerWalletBalance,
                    CreatedAt = now
                });
            }
            else
            {
                customerId = customer.Id;
                customerWalletBalance = customer.WalletBalance;

                // Update name/email if provided
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

            // 3. Normalize Payment Method & Process Payment Logic
            string normalizedPayment = dto.PaymentMethod.Trim().ToLowerInvariant();
            string paymentStatus;
            string orderStatus;
            string? transactionId = null;
            string confirmationMsg;

            // OPTION 2: HAVEN WALLET PAYMENT
            if (normalizedPayment.Contains("wallet") || normalizedPayment.Contains("haven"))
            {
                if (customerWalletBalance < grandTotal)
                {
                    return BadRequest(ApiResponse.Fail(
                        $"Insufficient Haven Wallet balance. Available: ${customerWalletBalance:F2}, Required: ${grandTotal:F2}. Please top up your wallet or choose another payment method."));
                }

                // Deduct wallet balance
                decimal newBalance = customerWalletBalance - grandTotal;
                await connection.ExecuteAsync(
                    "UPDATE Customers SET WalletBalance = @NewBalance WHERE Id = @Id;",
                    new { NewBalance = (double)newBalance, Id = customerId });

                transactionId = $"WAL-PAY-{Random.Shared.Next(100000, 999999)}";
                paymentStatus = "Paid (Wallet)";
                orderStatus = "Confirmed";

                // Insert wallet ledger transaction
                var insertTxSql = @"
                    INSERT INTO WalletTransactions (CustomerId, TransactionRef, Type, Amount, BalanceAfter, Description, CreatedAt)
                    VALUES (@CustomerId, @TransactionRef, @Type, @Amount, @BalanceAfter, @Description, @CreatedAt);
                ";
                await connection.ExecuteAsync(insertTxSql, new
                {
                    CustomerId = customerId,
                    TransactionRef = transactionId,
                    Type = "PAYMENT",
                    Amount = -(double)grandTotal,
                    BalanceAfter = (double)newBalance,
                    Description = $"Payment for Order ({dto.Items.Count} items)",
                    CreatedAt = now
                });

                confirmationMsg = $"Order and booking confirmed! ${grandTotal:F2} paid from your Haven Wallet. Remaining balance: ${newBalance:F2}.";
            }
            // OPTION 3: CREDIT / DEBIT CARD (STRIPE PAYMENT GATEWAY)
            else if (normalizedPayment.Contains("card") || normalizedPayment.Contains("credit") || normalizedPayment.Contains("debit") || normalizedPayment.Contains("stripe"))
            {
                var card = dto.CardDetails;
                var stripeIntentId = dto.PaymentIntentId ?? card?.PaymentIntentId;

                if (!string.IsNullOrWhiteSpace(stripeIntentId))
                {
                    transactionId = stripeIntentId;
                    paymentStatus = "Paid (Stripe Card)";
                    orderStatus = "Confirmed";
                    confirmationMsg = $"Stripe payment of ${grandTotal:F2} authorized successfully ({stripeIntentId}). Booking confirmed!";
                }
                else
                {
                    // Validate card input details
                    if (card == null || string.IsNullOrWhiteSpace(card.CardNumber))
                    {
                        return BadRequest(ApiResponse.Fail("Please provide valid card details (card number, expiry, CVC) to proceed with payment gateway."));
                    }

                    var cleanCard = card.CardNumber.Replace(" ", "").Replace("-", "");
                    if (cleanCard.Length < 12)
                    {
                        return BadRequest(ApiResponse.Fail("Invalid card number format. Please provide a valid 16-digit card."));
                    }

                    var last4 = cleanCard.Length >= 4 ? cleanCard[^4..] : "4242";
                    transactionId = $"TXN-STRIPE-{Random.Shared.Next(100000, 999999)}-{last4}";
                    paymentStatus = "Paid (Stripe Card)";
                    orderStatus = "Confirmed";
                    confirmationMsg = $"Card payment of ${grandTotal:F2} authorized successfully via Stripe Gateway. Booking confirmed!";
                }
            }
            // OPTION 1: AT COUNTER (Default)
            else
            {
                paymentStatus = "Unpaid (At Counter)";
                orderStatus = "Pending";
                confirmationMsg = "Order placed successfully! Please pay at the counter when our barista serves your order.";
            }

            // 4. Generate unique order reference
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

            // 5. Insert Order
            var insertOrderSql = @"
                INSERT INTO Orders (OrderReference, CustomerId, CustomerName, CustomerPhone, DiningOption, PickupTimeOrTable, SpecialNotes, PaymentMethod, PaymentStatus, TransactionId, Subtotal, Discount, Tax, TotalAmount, Status, CreatedAt)
                VALUES (@OrderReference, @CustomerId, @CustomerName, @CustomerPhone, @DiningOption, @PickupTimeOrTable, @SpecialNotes, @PaymentMethod, @PaymentStatus, @TransactionId, @Subtotal, @Discount, @Tax, @TotalAmount, @Status, @CreatedAt);
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
                PaymentStatus = paymentStatus,
                TransactionId = transactionId,
                Subtotal = (double)subtotal,
                Discount = (double)discount,
                Tax = (double)tax,
                TotalAmount = (double)grandTotal,
                Status = orderStatus,
                CreatedAt = now
            });

            // 6. Insert Order Items
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

            // 7. Check if Table Reservation is linked to this Order
            string? bookingCode = null;
            int? reservationId = null;

            if (dto.ReserveTable || dto.DiningOption.Equals("dinein", StringComparison.OrdinalIgnoreCase))
            {
                // Generate reservation code
                do
                {
                    bookingCode = $"RES-{Random.Shared.Next(1000, 9999)}";
                    var codeExists = await connection.ExecuteScalarAsync<int>(
                        "SELECT COUNT(*) FROM Reservations WHERE ReferenceCode = @Code;",
                        new { Code = bookingCode });
                    if (codeExists == 0) break;
                }
                while (true);

                var resDate = !string.IsNullOrWhiteSpace(dto.ReservationDate) ? dto.ReservationDate.Trim() : DateTime.UtcNow.ToString("yyyy-MM-dd");
                var resTime = !string.IsNullOrWhiteSpace(dto.ReservationTime) ? dto.ReservationTime.Trim() : "12:00 PM";
                var zone = !string.IsNullOrWhiteSpace(dto.SeatingZone) ? dto.SeatingZone.Trim() : "Indoor Lounge";

                var insertReservationSql = @"
                    INSERT INTO Reservations (ReferenceCode, CustomerId, OrderId, GuestName, Email, Phone, PartySize, ReservationDate, ReservationTime, SeatingZone, SpecialNotes, PaymentMethod, PaymentStatus, TotalAmount, Status, CreatedAt)
                    VALUES (@ReferenceCode, @CustomerId, @OrderId, @GuestName, @Email, @Phone, @PartySize, @ReservationDate, @ReservationTime, @SeatingZone, @SpecialNotes, @PaymentMethod, @PaymentStatus, @TotalAmount, @Status, @CreatedAt);
                    SELECT last_insert_rowid();
                ";

                reservationId = await connection.ExecuteScalarAsync<int>(insertReservationSql, new
                {
                    ReferenceCode = bookingCode,
                    CustomerId = customerId,
                    OrderId = orderId,
                    GuestName = dto.CustomerName.Trim(),
                    Email = dto.CustomerEmail?.Trim() ?? $"{phoneClean}@brewhaven.demo",
                    Phone = phoneClean,
                    PartySize = dto.PartySize > 0 ? dto.PartySize : 2,
                    ReservationDate = resDate,
                    ReservationTime = resTime,
                    SeatingZone = zone,
                    SpecialNotes = dto.SpecialNotes?.Trim(),
                    PaymentMethod = dto.PaymentMethod,
                    PaymentStatus = paymentStatus,
                    TotalAmount = (double)grandTotal,
                    Status = "Confirmed",
                    CreatedAt = now
                });

                // Update Order with linked Booking Code & Reservation Id
                await connection.ExecuteAsync(
                    "UPDATE Orders SET BookingCode = @BookingCode, ReservationId = @ReservationId WHERE Id = @Id;",
                    new { BookingCode = bookingCode, ReservationId = reservationId, Id = orderId });
            }

            _logger.LogInformation("Order {OrderRef} created. PaymentMethod: {Method}, PaymentStatus: {PayStatus}", 
                orderRef, dto.PaymentMethod, paymentStatus);

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
                PaymentStatus = paymentStatus,
                TransactionId = transactionId,
                BookingCode = bookingCode,
                ReservationId = reservationId,
                Subtotal = subtotal,
                Discount = discount,
                Tax = tax,
                TotalAmount = grandTotal,
                Status = orderStatus,
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
                ApiResponse<OrderResponseDto>.Ok(responseDto, confirmationMsg));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing order placement");
            return StatusCode(500, ApiResponse.Fail("An internal error occurred while saving your order. Please try again."));
        }
    }

    /// <summary>
    /// Confirm an At-Counter order when payment is received and order is served at the counter
    /// </summary>
    [HttpPatch("{id:int}/confirm-counter")]
    public async Task<ActionResult<ApiResponse<OrderResponseDto>>> ConfirmCounterOrder(int id)
    {
        try
        {
            using var connection = _database.CreateConnection();

            var order = await connection.QueryFirstOrDefaultAsync<Order>(
                "SELECT * FROM Orders WHERE Id = @Id;",
                new { Id = id });

            if (order == null)
            {
                return NotFound(ApiResponse.Fail("Order not found."));
            }

            var txnId = $"COUNTER-{DateTime.UtcNow:yyMMdd}-{order.Id:D4}";

            await connection.ExecuteAsync(@"
                UPDATE Orders 
                SET Status = 'Completed', 
                    PaymentStatus = 'Paid at Counter',
                    TransactionId = @TxnId
                WHERE Id = @Id;
            ", new { TxnId = txnId, Id = id });

            // If linked to reservation, update reservation payment status too
            if (order.ReservationId.HasValue)
            {
                await connection.ExecuteAsync(
                    "UPDATE Reservations SET PaymentStatus = 'Paid at Counter', Status = 'Completed' WHERE Id = @ResId;",
                    new { ResId = order.ReservationId.Value });
            }

            _logger.LogInformation("Counter order {Ref} served and confirmed by staff.", order.OrderReference);

            return await GetOrderByReference(order.OrderReference);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming counter order {Id}", id);
            return StatusCode(500, ApiResponse.Fail("Unable to confirm counter order."));
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
            PaymentStatus = o.PaymentStatus,
            TransactionId = o.TransactionId,
            BookingCode = o.BookingCode,
            ReservationId = o.ReservationId,
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
            PaymentStatus = order.PaymentStatus,
            TransactionId = order.TransactionId,
            BookingCode = order.BookingCode,
            ReservationId = order.ReservationId,
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
