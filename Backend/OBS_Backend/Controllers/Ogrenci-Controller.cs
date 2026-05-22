using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OBS_Backend.Data;
using OBS_Backend.Models;

namespace OBS_Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OgrenciController : ControllerBase
{
    private readonly AppDbContext _context;
    public OgrenciController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var ogrenciler = await _context.Ogrenciler.ToListAsync();
        return Ok(ogrenciler);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ogrenci = await _context.Ogrenciler.FindAsync(id);
        return ogrenci == null ? NotFound() : Ok(ogrenci);
    }
}