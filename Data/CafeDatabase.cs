using System.Data;
using Microsoft.Data.Sqlite;
using Dapper;

namespace CafeLandingPage.Data;

public class CafeDatabase
{
    private readonly string _connectionString;
    private readonly ILogger<CafeDatabase> _logger;

    public CafeDatabase(IConfiguration configuration, ILogger<CafeDatabase> logger, IHostEnvironment env)
    {
        var rawConn = configuration.GetConnectionString("DefaultConnection") 
            ?? "Data Source=CafeHaven.db";

        if (rawConn.StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))
        {
            var dbFileName = rawConn.Substring("Data Source=".Length).Trim();
            if (!Path.IsPathRooted(dbFileName))
            {
                var fullDbPath = Path.Combine(env.ContentRootPath, dbFileName);
                _connectionString = $"Data Source={fullDbPath}";
            }
            else
            {
                _connectionString = rawConn;
            }
        }
        else
        {
            _connectionString = rawConn;
        }

        _logger = logger;
    }

    public IDbConnection CreateConnection() => new SqliteConnection(_connectionString);

    public async Task InitializeDatabaseAsync()
    {
        using var connection = CreateConnection();
        connection.Open();

        var sql = @"
            PRAGMA journal_mode = WAL;

            CREATE TABLE IF NOT EXISTS Customers (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                FullName TEXT NOT NULL,
                Phone TEXT NOT NULL,
                Email TEXT,
                CreatedAt TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_customers_phone ON Customers(Phone);

            CREATE TABLE IF NOT EXISTS Orders (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                OrderReference TEXT NOT NULL UNIQUE,
                CustomerId INTEGER,
                CustomerName TEXT NOT NULL,
                CustomerPhone TEXT NOT NULL,
                DiningOption TEXT NOT NULL,
                PickupTimeOrTable TEXT NOT NULL,
                SpecialNotes TEXT,
                PaymentMethod TEXT NOT NULL,
                Subtotal REAL NOT NULL,
                Discount REAL NOT NULL,
                Tax REAL NOT NULL,
                TotalAmount REAL NOT NULL,
                Status TEXT NOT NULL,
                CreatedAt TEXT NOT NULL,
                FOREIGN KEY(CustomerId) REFERENCES Customers(Id) ON DELETE SET NULL
            );
            CREATE INDEX IF NOT EXISTS idx_orders_ref ON Orders(OrderReference);
            CREATE INDEX IF NOT EXISTS idx_orders_created ON Orders(CreatedAt DESC);

            CREATE TABLE IF NOT EXISTS OrderItems (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                OrderId INTEGER NOT NULL,
                MenuItemId INTEGER NOT NULL,
                ItemName TEXT NOT NULL,
                ImageUrl TEXT,
                UnitPrice REAL NOT NULL,
                Quantity INTEGER NOT NULL,
                CustomDetails TEXT,
                LineTotal REAL NOT NULL,
                FOREIGN KEY(OrderId) REFERENCES Orders(Id) ON DELETE CASCADE
            );
            CREATE INDEX IF NOT EXISTS idx_order_items_order ON OrderItems(OrderId);

            CREATE TABLE IF NOT EXISTS Reservations (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                ReferenceCode TEXT NOT NULL UNIQUE,
                CustomerId INTEGER,
                GuestName TEXT NOT NULL,
                Email TEXT NOT NULL,
                Phone TEXT NOT NULL,
                PartySize INTEGER NOT NULL,
                ReservationDate TEXT NOT NULL,
                ReservationTime TEXT NOT NULL,
                SeatingZone TEXT NOT NULL,
                SpecialNotes TEXT,
                Status TEXT NOT NULL,
                CreatedAt TEXT NOT NULL,
                FOREIGN KEY(CustomerId) REFERENCES Customers(Id) ON DELETE SET NULL
            );
            CREATE INDEX IF NOT EXISTS idx_reservations_code ON Reservations(ReferenceCode);

            CREATE TABLE IF NOT EXISTS NewsletterSubscribers (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Email TEXT NOT NULL UNIQUE,
                SubscribedAt TEXT NOT NULL
            );
        ";

        await connection.ExecuteAsync(sql);

        // Check if database needs sample seed data
        var customerCount = await connection.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Customers;");
        if (customerCount == 0)
        {
            var now = DateTime.UtcNow.ToString("o");

            // Insert sample customer
            var insertCustomerSql = @"
                INSERT INTO Customers (FullName, Phone, Email, CreatedAt)
                VALUES (@FullName, @Phone, @Email, @CreatedAt);
                SELECT last_insert_rowid();
            ";

            var customerId = await connection.ExecuteScalarAsync<int>(insertCustomerSql, new
            {
                FullName = "Elena Rostova",
                Phone = "+61 400 123 456",
                Email = "elena.rostova@example.com",
                CreatedAt = now
            });

            // Insert sample order
            var insertOrderSql = @"
                INSERT INTO Orders (OrderReference, CustomerId, CustomerName, CustomerPhone, DiningOption, PickupTimeOrTable, SpecialNotes, PaymentMethod, Subtotal, Discount, Tax, TotalAmount, Status, CreatedAt)
                VALUES (@OrderReference, @CustomerId, @CustomerName, @CustomerPhone, @DiningOption, @PickupTimeOrTable, @SpecialNotes, @PaymentMethod, @Subtotal, @Discount, @Tax, @TotalAmount, @Status, @CreatedAt);
                SELECT last_insert_rowid();
            ";

            var orderId = await connection.ExecuteScalarAsync<int>(insertOrderSql, new
            {
                OrderReference = "BH-782194",
                CustomerId = customerId,
                CustomerName = "Elena Rostova",
                CustomerPhone = "+61 400 123 456",
                DiningOption = "takeaway",
                PickupTimeOrTable = "ASAP (15-20 mins)",
                SpecialNotes = "Extra hot with cinnamon dust",
                PaymentMethod = "Pay at Pickup Counter",
                Subtotal = 10.30,
                Discount = 1.03,
                Tax = 0.46,
                TotalAmount = 9.73,
                Status = "Brewing",
                CreatedAt = now
            });

            // Insert sample order items
            var insertItemSql = @"
                INSERT INTO OrderItems (OrderId, MenuItemId, ItemName, ImageUrl, UnitPrice, Quantity, CustomDetails, LineTotal)
                VALUES (@OrderId, @MenuItemId, @ItemName, @ImageUrl, @UnitPrice, @Quantity, @CustomDetails, @LineTotal);
            ";

            await connection.ExecuteAsync(insertItemSql, new[]
            {
                new
                {
                    OrderId = orderId,
                    MenuItemId = 1,
                    ItemName = "Hazelnut Velvet Flat White",
                    ImageUrl = "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80",
                    UnitPrice = 5.80,
                    Quantity = 1,
                    CustomDetails = "Regular (12oz) • Whole Milk • 100% Standard",
                    LineTotal = 5.80
                },
                new
                {
                    OrderId = orderId,
                    MenuItemId = 4,
                    ItemName = "Artisan Butter Croissant",
                    ImageUrl = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
                    UnitPrice = 4.50,
                    Quantity = 1,
                    CustomDetails = "Warm & Toasted • French Butter",
                    LineTotal = 4.50
                }
            });

            // Insert sample reservation
            var insertResSql = @"
                INSERT INTO Reservations (ReferenceCode, CustomerId, GuestName, Email, Phone, PartySize, ReservationDate, ReservationTime, SeatingZone, SpecialNotes, Status, CreatedAt)
                VALUES (@ReferenceCode, @CustomerId, @GuestName, @Email, @Phone, @PartySize, @ReservationDate, @ReservationTime, @SeatingZone, @SpecialNotes, @Status, @CreatedAt);
            ";

            await connection.ExecuteAsync(insertResSql, new
            {
                ReferenceCode = "RES-8392",
                CustomerId = customerId,
                GuestName = "Elena Rostova",
                Email = "elena.rostova@example.com",
                Phone = "+61 400 123 456",
                PartySize = 2,
                ReservationDate = DateTime.UtcNow.AddDays(1).ToString("yyyy-MM-dd"),
                ReservationTime = "10:00 AM",
                SeatingZone = "Window Bar",
                SpecialNotes = "Quiet area preferred",
                Status = "Confirmed",
                CreatedAt = now
            });

            _logger.LogInformation("Cafe Haven SQLite database initialized and seeded successfully.");
        }
    }
}
