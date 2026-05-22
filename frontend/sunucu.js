/**
 * MÜOS (Merkezi Üniversite Otomasyon Sistemi) 
 * Sanal Sunucu ve Veri Yönetim Katmanı (sunucu.js)
 */

const UNIVERSITE_AD = "Isparta Uygulamalı Bilimler Üniversitesi";

// ── 1. SANAL VERİTABANI BAŞLATMA (INITIALIZATION) ──
function sunucuVeritabaniniKur() {
    // 1. Öğrenci Havuzu Yoksa Oluştur (Toplam: 500 Öğrenci)
    if (!localStorage.getItem('MÜOS_Sunucu_Ogrenciler')) {
        let havuzListesi = [];
        
        // ISUBÜ Ana Öğrencileri (İlk 3 Elit Kayıt)
        havuzListesi.push({ no: 1001, tamAd: "Ahmet Yılmaz", bolum: "Bilgisayar Programcılığı", sinif: "1. Sınıf", gno: "3.24", devam: 4, aktif: true, uni: UNIVERSITE_AD });
        havuzListesi.push({ no: 1002, tamAd: "Ayşe Demir", bolum: "Bilgisayar Programcılığı", sinif: "2. Sınıf", gno: "2.85", devam: 12, aktif: true, uni: UNIVERSITE_AD });
        havuzListesi.push({ no: 1003, tamAd: "Mehmet Çelik", bolum: "Bilgisayar Programcılığı", sinif: "1. Sınıf", gno: "1.90", devam: 2, aktif: true, uni: UNIVERSITE_AD });

        // ISUBÜ Havuzunu 80 kişiye tamamla
        for (let i = 4; i <= 80; i++) {
            havuzListesi.push({
                no: 1000 + i,
                tamAd: `ISUBÜ Öğrencisi ${i}`,
                bolum: i % 2 === 0 ? "Bilgisayar Programcılığı" : "Mekatronik",
                sinif: i % 3 === 0 ? "2. Sınıf" : "1. Sınıf",
                gno: (2.00 + (i * 0.02) % 2).toFixed(2),
                devam: Math.floor(Math.random() * 15),
                aktif: true,
                uni: UNIVERSITE_AD
            });
        }

        // Diğer 7 Üniversiteye 420 Havuz Öğrencisi Dağıt (Her birine 60 öğrenci)
        const digerUniler = [
            "Süleyman Demirel Üniversitesi", "Akdeniz Üniversitesi", "Ege Üniversitesi", 
            "Dokuz Eylül Üniversitesi", "Anadolu Üniversitesi", "Pamukkale Üniversitesi", "Mehmet Akif Ersoy Üniversitesi"
        ];

        for (let i = 1; i <= 420; i++) {
            let secilenUni = digerUniler[i % digerUniler.length];
            havuzListesi.push({
                no: 3000 + i,
                tamAd: `Havuz Öğrencisi ${i}`,
                bolum: "Farklı Bölüm",
                sinif: "1. Sınıf",
                gno: "2.50",
                devam: 0,
                aktif: true,
                uni: secilenUni
            });
        }
        localStorage.setItem('MÜOS_Sunucu_Ogrenciler', JSON.stringify(havuzListesi));
    }

    // 2. Akademik Kadro (Hocalar) Yoksa Oluştur
    if (!localStorage.getItem('MÜOS_Sunucu_Ogretmenler')) {
        const varsayilanHocalar = [
            { no: 2001, ad: "Mehmet", soyad: "DEMİR", unvan: "Doç. Dr.", bolum: "Bilgisayar Programcılığı", uni: UNIVERSITE_AD, sifre: "hoca123" },
            { no: 2002, ad: "Selin", soyad: "KAYA", unvan: "Dr. Öğr. Üyesi", bolum: "Mekatronik", uni: UNIVERSITE_AD, sifre: "hoca123" }
        ];
        localStorage.setItem('MÜOS_Sunucu_Ogretmenler', JSON.stringify(varsayilanHocalar));
    }
}

// Sunucuyu ilk açılışta tetikle
sunucuVeritabaniniKur();


// ── 2. SUNUCU API METOTLARI (DATA ACCESS OBJECT) ──
const SunucuAPI = {
    // Tüm merkezi havuzu getir (500 kişi)
    tumOgrencileriGetir: function() {
        return JSON.parse(localStorage.getItem('MÜOS_Sunucu_Ogrenciler')) || [];
    },

    // Sadece bizim üniversitenin öğrencilerini süz (ISUBÜ -> 80 kişi)
    uniOgrencileriniGetir: function(uniAdi = UNIVERSITE_AD) {
        return this.tumOgrencileriGetir().filter(o => o.uni === uniAdi);
    },

    // Yeni öğrenci kaydet (Numara çakışma kontrolü ile)
    ogrenciEkle: function(yeniOgr) {
        let ogrenciler = this.tumOgrencileriGetir();
        if (ogrenciler.some(o => o.no === yeniOgr.no)) {
            return { basarili: false, mesaj: "Hata: Bu öğrenci numarası sistemde zaten var!" };
        }
        ogrenciler.push(yeniOgr);
        localStorage.setItem('MÜOS_Sunucu_Ogrenciler', JSON.stringify(ogrenciler));
        return { basarili: true, mesaj: "Öğrenci başarıyla merkezi sunucuya kaydedildi." };
    },

    // Not/Devamsızlık Güncelleme (Hocaların kullanması için)
    ogrenciGuncelle: function(ogrNo, yeniVeriler) {
        let ogrenciler = this.tumOgrencileriGetir();
        let indeks = ogrenciler.findIndex(o => o.no === parseInt(ogrNo));
        if (indeks !== -1) {
            ogrenciler[indeks] = { ...ogrenciler[indeks], ...yeniVeriler };
            localStorage.setItem('MÜOS_Sunucu_Ogrenciler', JSON.stringify(ogrenciler));
            return true;
        }
        return false;
    },

    // Tüm akademisyenleri getir
    tumHocalariGetir: function() {
        return JSON.parse(localStorage.getItem('MÜOS_Sunucu_Ogretmenler')) || [];
    },

    // ── MERKEZİ OTURUM YÖNETİMİ (KİMLİK DOĞRULAMA) ──
    girisYap: function(kullaniciNo, sifre, rol) {
        // A- MEMUR GİRİŞİ (Öğrenci İşleri)
        if (rol === "memur") {
            if (kullaniciNo === "admin" && sifre === "1234") {
                sessionStorage.setItem('obs_user', JSON.stringify({ rol: "memur", ad: "Merkez Memur", uni: UNIVERSITE_AD }));
                return { basarili: true, yonlendir: "ogrenci-isleri.html" };
            }
        } 
        // B- HOCA GİRİŞİ (Akademik Panel)
        else if (rol === "hoca") {
            let hocalar = this.tumHocalariGetir();
            let hoca = hocalar.find(h => h.no === parseInt(kullaniciNo) && h.sifre === sifre);
            if (hoca) {
                sessionStorage.setItem('obs_user', JSON.stringify({ rol: "hoca", ad: `${hoca.unvan} ${hoca.ad} ${hoca.soyad}`, bolum: hoca.bolum, uni: hoca.uni }));
                return { basarili: true, yonlendir: "hoca.html" };
            }
        } 
        // C- ÖĞRENCİ GİRİŞİ (Öğrenci Paneli)
        else if (rol === "ogrenci") {
            let ogrenciler = this.uniOgrencileriniGetir(); // Sadece bizim okulun öğrencileri girebilir
            let ogrenci = ogrenciler.find(o => o.no === parseInt(kullaniciNo));
            
            // Öğrenci şifresi varsayılan olarak okul numarasıdır
            if (ogrenci && sifre === String(ogrenci.no)) {
                sessionStorage.setItem('obs_user', JSON.stringify({ rol: "ogrenci", no: ogrenci.no, ad: ogrenci.tamAd, uni: ogrenci.uni }));
                return { basarili: true, yonlendir: "ogrenci-panel.html" };
            }
        }
        return { basarili: false, mesaj: "Hatalı kullanıcı adı, numara veya şifre!" };
    }
};  

