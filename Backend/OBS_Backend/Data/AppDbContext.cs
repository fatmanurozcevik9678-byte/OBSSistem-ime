using Microsoft.EntityFrameworkCore;
using OBS_Backend.Models;

namespace OBS_Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<Ogrenci> Ogrenciler { get; set; }
}