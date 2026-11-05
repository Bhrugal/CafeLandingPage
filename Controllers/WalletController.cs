using Microsoft.AspNetCore.Mvc;
using Dapper;
using CafeLandingPage.Data;
using CafeLandingPage.DTOs;
using CafeLandingPage.Models;

namespace CafeLandingPage.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WalletController : ControllerBase
{
    private readonly CafeDatabase _database;
    private readonly ILogger<WalletController> _logger;

    public WalletController(CafeDatabase database, ILogger<WalletController> logger)
    {
        _database = database;
        _logger = logger;
    }

    /// <summary>
    /// Get customer Haven Wallet balance and recent transaction history by phone number
    /// </summary>
    [HttpGet("{phone}")]
    public async Task<ActionResult<ApiResponse<CustomerWalletDto>>> GetWallet(string phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
        {
            return BadRequest(ApiResponse.Fail("Phone number is required."));
        }

        try
        {
            using var connection = _database.CreateConnection();
            var phoneClean = phone.Trim();

            var customer = await connection.QueryFirstOrDefaultAsync<Customer>(
                "SELECT * FROM Customers WHERE Phone = @Phone;",
                new { Phone = phoneClean });

            if (customer == null)
            {
                // Return a starter wallet for prospective guests with initial welcome bonus
                return Ok(ApiResponse<CustomerWalletDto>.Ok(new CustomerWalletDto
                {
                    CustomerId = 0,
                    CustomerName = "Valued Guest",
                    CustomerPhone = phoneClean,
                    WalletBalance = 25.00m,
                    RecentTransactions = new List<WalletTransactionDto>
                    {
                        new()
                        {
                            TransactionRef = "PROMO-WELCOME",
                            Type = "PROMOTION",
                            Amount = 25.00m,
                            BalanceAfter = 25.00m,
                            Description = "Haven Welcome Gift Credit (Ready to use)",
                            CreatedAt = DateTime.UtcNow
                        }
                    }
                }, "Welcome to Brew Haven Wallet! $25.00 complimentary welcome credit ready."));
            }

            var transactions = (await connection.QueryAsync<WalletTransaction>(
                "SELECT * FROM WalletTransactions WHERE CustomerId = @CustomerId ORDER BY CreatedAt DESC LIMIT 15;",
                new { CustomerId = customer.Id })).ToList();

            var dto = new CustomerWalletDto
            {
                CustomerId = customer.Id,
                CustomerName = customer.FullName,
                CustomerPhone = customer.Phone,
                WalletBalance = customer.WalletBalance,
                RecentTransactions = transactions.Select(t => new WalletTransactionDto
                {
                    TransactionRef = t.TransactionRef,
                    Type = t.Type,
                    Amount = t.Amount,
                    BalanceAfter = t.BalanceAfter,
                    Description = t.Description,
                    CreatedAt = t.CreatedAt
                }).ToList()
            };

            return Ok(ApiResponse<CustomerWalletDto>.Ok(dto));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching wallet for phone: {Phone}", phone);
            return StatusCode(500, ApiResponse.Fail("Unable to retrieve wallet balance."));
        }
    }

    /// <summary>
    /// Top up customer Haven Wallet balance
    /// </summary>
    [HttpPost("topup")]
    public async Task<ActionResult<ApiResponse<CustomerWalletDto>>> TopUpWallet([FromBody] TopupWalletDto dto)
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

            // Locate or create customer
            var customer = await connection.QueryFirstOrDefaultAsync<Customer>(
                "SELECT * FROM Customers WHERE Phone = @Phone;",
                new { Phone = phoneClean });

            int customerId;
            decimal currentBalance;
            string customerName = dto.CustomerName?.Trim() ?? "Valued Guest";

            if (customer == null)
            {
                var insertSql = @"
                    INSERT INTO Customers (FullName, Phone, Email, WalletBalance, CreatedAt)
                    VALUES (@FullName, @Phone, @Email, @WalletBalance, @CreatedAt);
                    SELECT last_insert_rowid();
                ";
                // New customers receive $25.00 welcome gift bonus + topup amount
                const decimal welcomeBonus = 25.00m;
                currentBalance = welcomeBonus + dto.Amount;

                customerId = await connection.ExecuteScalarAsync<int>(insertSql, new
                {
                    FullName = customerName,
                    Phone = phoneClean,
                    Email = (string?)null,
                    WalletBalance = (double)currentBalance,
                    CreatedAt = now
                });

                // Record welcome bonus transaction in ledger
                var insertWelcomeTxSql = @"
                    INSERT INTO WalletTransactions (CustomerId, TransactionRef, Type, Amount, BalanceAfter, Description, CreatedAt)
                    VALUES (@CustomerId, @TransactionRef, @Type, @Amount, @BalanceAfter, @Description, @CreatedAt);
                ";
                await connection.ExecuteAsync(insertWelcomeTxSql, new
                {
                    CustomerId = customerId,
                    TransactionRef = "PROMO-WELCOME",
                    Type = "PROMOTION",
                    Amount = (double)welcomeBonus,
                    BalanceAfter = (double)welcomeBonus,
                    Description = "Haven Welcome Gift Credit",
                    CreatedAt = now
                });
            }
            else
            {
                customerId = customer.Id;
                customerName = customer.FullName;
                currentBalance = customer.WalletBalance + dto.Amount;

                await connection.ExecuteAsync(
                    "UPDATE Customers SET WalletBalance = @NewBalance WHERE Id = @Id;",
                    new { NewBalance = (double)currentBalance, Id = customerId });
            }

            // Generate transaction reference
            var txnRef = $"WAL-TOP-{Random.Shared.Next(100000, 999999)}";

            var insertTxSql = @"
                INSERT INTO WalletTransactions (CustomerId, TransactionRef, Type, Amount, BalanceAfter, Description, CreatedAt)
                VALUES (@CustomerId, @TransactionRef, @Type, @Amount, @BalanceAfter, @Description, @CreatedAt);
            ";

            await connection.ExecuteAsync(insertTxSql, new
            {
                CustomerId = customerId,
                TransactionRef = txnRef,
                Type = "TOPUP",
                Amount = (double)dto.Amount,
                BalanceAfter = (double)currentBalance,
                Description = $"Haven Wallet Top-up (+${dto.Amount:F2})",
                CreatedAt = now
            });

            _logger.LogInformation("Customer {Phone} topped up wallet by ${Amount:F2}. New balance: ${Balance:F2}",
                phoneClean, dto.Amount, currentBalance);

            var walletDto = new CustomerWalletDto
            {
                CustomerId = customerId,
                CustomerName = customerName,
                CustomerPhone = phoneClean,
                WalletBalance = currentBalance,
                RecentTransactions = new List<WalletTransactionDto>
                {
                    new()
                    {
                        TransactionRef = txnRef,
                        Type = "TOPUP",
                        Amount = dto.Amount,
                        BalanceAfter = currentBalance,
                        Description = $"Haven Wallet Top-up (+${dto.Amount:F2})",
                        CreatedAt = DateTime.Parse(now)
                    }
                }
            };

            return Ok(ApiResponse<CustomerWalletDto>.Ok(walletDto, $"Successfully added ${dto.Amount:F2} to your Haven Wallet! New Balance: ${currentBalance:F2}"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing wallet top-up");
            return StatusCode(500, ApiResponse.Fail("Unable to process wallet top-up. Please try again."));
        }
    }
}
