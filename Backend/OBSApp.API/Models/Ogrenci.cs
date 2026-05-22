namespace OBSApp.API.Models
{
    public class Ogrenci
    {
        public int Id { get; set; }
        public string OgrenciNo { get; set; } = string.Empty;
        public string Ad { get; set; } = string.Empty;
        public string Soyad { get; set; } = string.Empty;
        public string Sifre { get; set; } = string.Empty;
        public string Bolum { get; set; } = string.Empty;
        public string Sinif { get; set; } = string.Empty;
        public double Gno { get; set; }
        public int Devam { get; set; }
        public bool Aktif { get; set; }
        public string Uni { get; set; } = string.Empty;
        public string KazandigiUniversite { get; set; } = string.Empty;
    }
}