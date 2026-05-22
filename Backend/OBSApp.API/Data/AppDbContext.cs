using Microsoft.EntityFrameworkCore;
using OBSApp.API.Models;

namespace OBSApp.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Ogrenci> Ogrenciler { get; set; }
    }
}