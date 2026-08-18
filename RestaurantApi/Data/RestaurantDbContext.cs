using Microsoft.EntityFrameworkCore;
using RestaurantApi.Models;

namespace RestaurantApi.Data;

public class RestaurantDbContext : DbContext
{
    public RestaurantDbContext(DbContextOptions<RestaurantDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Restaurant> Restaurants { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Dish> Dishes { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Restaurant>()
            .HasOne(r => r.Owner)
            .WithMany(u => u.Restaurants)
            .HasForeignKey(r => r.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Dish>()
            .HasOne(d => d.Restaurant)
            .WithMany(r => r.Dishes)
            .HasForeignKey(d => d.RestaurantId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Dish>()
            .HasOne(d => d.Category)
            .WithMany(c => c.Dishes)
            .HasForeignKey(d => d.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.Client)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.Restaurant)
            .WithMany(r => r.Orders)
            .HasForeignKey(o => o.RestaurantId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Dish)
            .WithMany(d => d.OrderItems)
            .HasForeignKey(oi => oi.DishId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Pizza" },
            new Category { Id = 2, Name = "Burger" },
            new Category { Id = 3, Name = "Boisson" },
            new Category { Id = 4, Name = "Dessert" },
            new Category { Id = 5, Name = "Africain" }
        );
    }
}