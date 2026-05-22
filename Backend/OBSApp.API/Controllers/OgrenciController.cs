using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OBSApp.API.Data;
using OBSApp.API.Models;
using System.Security.Cryptography;
using System.Text;

namespace OBSApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OgrenciController : ControllerBase
    {
        private readonly AppDbContext _context;
        public OgrenciController(AppDbContext context) => _context = context;

        // Şifre hashleme metodu
        private string HashSifre(string sifre)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(sifre));
                return Convert.ToHexString(bytes);
            }
        }

        // 1. TÜM ÖĞRENCİLERİ LİSTELEME
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ogrenciler = await _context.Ogrenciler.ToListAsync();
            return Ok(ogrenciler);
        }

        // 2. ID'YE GÖRE ÖĞRENCİ BULMA
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ogrenci = await _context.Ogrenciler.FindAsync(id);
            return ogrenci == null ? NotFound() : Ok(ogrenci);
        }

        // 3. YENİ ÖĞRENCİ KAYDETME (Şifre hash'lenir)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Ogrenci ogrenci)
        {
            // Şifreyi hash'le
            ogrenci.Sifre = HashSifre(ogrenci.Sifre);
            
            _context.Ogrenciler.Add(ogrenci);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = ogrenci.Id }, ogrenci);
        }

        // 4. GENEL GİRİŞ YAPMA (LOGIN) METODU - HASH KONTROLLÜ
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Tip))
                return BadRequest(new { message = "Giriş tipi (tip) belirtilmelidir!" });

            // ÖĞRENCİ GİRİŞİ (HASH KONTROLLÜ)
            if (request.Tip == "ogrenci")
            {
                string hashliSifre = HashSifre(request.Sifre);
                
                var ogrenci = await _context.Ogrenciler
                    .FirstOrDefaultAsync(x => x.OgrenciNo == request.No.ToString() && x.Sifre == hashliSifre);

                if (ogrenci == null)
                    return BadRequest(new { message = "Öğrenci numarası veya şifre hatalı!" });

                return Ok(new
                {
                    message = "Giriş başarılı",
                    rol = "ogrenci",
                    no = ogrenci.OgrenciNo,
                    ad = ogrenci.Ad,
                    soyad = ogrenci.Soyad,
                    bolum = ogrenci.Bolum ?? "Bilgisayar Programcılığı",
                    sinif = "1. Sınıf"
                });
            }

            // ÖĞRETMEN GİRİŞİ
            if (request.Tip == "ogretmen")
            {
                // Öğretmen şifresi hash'li değilse burada hash'le
                string hashliSifre = HashSifre("5678");
                
                if (HashSifre(request.Sifre) == hashliSifre && request.No >= 2001 && request.No <= 2008)
                {
                    return Ok(new
                    {
                        message = "Giriş başarılı",
                        rol = "hoca",
                        no = request.No,
                        ad = "Mehmet",
                        soyad = "DEMİR",
                        unvan = "Doç. Dr."
                    });
                }
                return BadRequest(new { message = "Öğretmen numarası veya şifre hatalı!" });
            }

            // ÖĞRENCİ İŞLERİ GİRİŞİ
            if (request.Tip == "isler")
            {
                string hashliSifre = HashSifre("4567");
                
                if (HashSifre(request.Sifre) == hashliSifre && request.No >= 3001 && request.No <= 3004)
                {
                    return Ok(new
                    {
                        message = "Giriş başarılı",
                        rol = "memur",
                        no = request.No,
                        ad = "Memur",
                        soyad = "YILMAZ"
                    });
                }
                return BadRequest(new { message = "Öğrenci İşleri bilgileri hatalı!" });
            }

            return BadRequest(new { message = "Geçersiz giriş tipi!" });
        }
    }

    public class LoginRequest
    {
        public int No { get; set; }
        public string Sifre { get; set; }
        public string Tip { get; set; }
    }
}