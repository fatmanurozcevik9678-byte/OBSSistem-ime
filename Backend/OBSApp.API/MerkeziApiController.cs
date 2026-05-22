using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OBSApp.API.Data;
using OBSApp.API.Models;

namespace OBSApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MerkeziApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MerkeziApiController(AppDbContext context)
        {
            _context = context;
        }

        // Ogrenci Giris Methodu
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var ogrenci = await _context.Ogrenciler
                .FirstOrDefaultAsync(o => o.OgrenciNo == model.OgrenciNo && o.Sifre == model.Sifre);

            if (ogrenci == null)
            {
                return Unauthorized(new { message = "Öğrenci numarası veya şifre hatalı!" });
            }

            return Ok(ogrenci);
        }
    }

    public class LoginModel
    {
        public string OgrenciNo { get; set; } = string.Empty;
        public string Sifre { get; set; } = string.Empty;
    }
}