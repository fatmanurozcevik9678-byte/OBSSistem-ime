"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * MÜOS (Merkezi Üniversite Otomasyon Sistemi) 
 * Sanal Sunucu ve Veri Yönetim Katmanı (sunucu.js)
 */
var UNIVERSITE_AD = "Isparta Uygulamalı Bilimler Üniversitesi"; // ── 1. SANAL VERİTABANI BAŞLATMA (INITIALIZATION) ──

function sunucuVeritabaniniKur() {
  // 1. Öğrenci Havuzu Yoksa Oluştur (Toplam: 500 Öğrenci)
  if (!localStorage.getItem('MÜOS_Sunucu_Ogrenciler')) {
    var havuzListesi = []; // ISUBÜ Ana Öğrencileri (İlk 3 Elit Kayıt)

    havuzListesi.push({
      no: 1001,
      tamAd: "Ahmet Yılmaz",
      bolum: "Bilgisayar Programcılığı",
      sinif: "1. Sınıf",
      gno: "3.24",
      devam: 4,
      aktif: true,
      uni: UNIVERSITE_AD
    });
    havuzListesi.push({
      no: 1002,
      tamAd: "Ayşe Demir",
      bolum: "Bilgisayar Programcılığı",
      sinif: "2. Sınıf",
      gno: "2.85",
      devam: 12,
      aktif: true,
      uni: UNIVERSITE_AD
    });
    havuzListesi.push({
      no: 1003,
      tamAd: "Mehmet Çelik",
      bolum: "Bilgisayar Programcılığı",
      sinif: "1. Sınıf",
      gno: "1.90",
      devam: 2,
      aktif: true,
      uni: UNIVERSITE_AD
    }); // ISUBÜ Havuzunu 80 kişiye tamamla

    for (var i = 4; i <= 80; i++) {
      havuzListesi.push({
        no: 1000 + i,
        tamAd: "ISUB\xDC \xD6\u011Frencisi ".concat(i),
        bolum: i % 2 === 0 ? "Bilgisayar Programcılığı" : "Mekatronik",
        sinif: i % 3 === 0 ? "2. Sınıf" : "1. Sınıf",
        gno: (2.00 + i * 0.02 % 2).toFixed(2),
        devam: Math.floor(Math.random() * 15),
        aktif: true,
        uni: UNIVERSITE_AD
      });
    } // Diğer 7 Üniversiteye 420 Havuz Öğrencisi Dağıt (Her birine 60 öğrenci)


    var digerUniler = ["Süleyman Demirel Üniversitesi", "Akdeniz Üniversitesi", "Ege Üniversitesi", "Dokuz Eylül Üniversitesi", "Anadolu Üniversitesi", "Pamukkale Üniversitesi", "Mehmet Akif Ersoy Üniversitesi"];

    for (var _i = 1; _i <= 420; _i++) {
      var secilenUni = digerUniler[_i % digerUniler.length];
      havuzListesi.push({
        no: 3000 + _i,
        tamAd: "Havuz \xD6\u011Frencisi ".concat(_i),
        bolum: "Farklı Bölüm",
        sinif: "1. Sınıf",
        gno: "2.50",
        devam: 0,
        aktif: true,
        uni: secilenUni
      });
    }

    localStorage.setItem('MÜOS_Sunucu_Ogrenciler', JSON.stringify(havuzListesi));
  } // 2. Akademik Kadro (Hocalar) Yoksa Oluştur


  if (!localStorage.getItem('MÜOS_Sunucu_Ogretmenler')) {
    var varsayilanHocalar = [{
      no: 2001,
      ad: "Mehmet",
      soyad: "DEMİR",
      unvan: "Doç. Dr.",
      bolum: "Bilgisayar Programcılığı",
      uni: UNIVERSITE_AD,
      sifre: "hoca123"
    }, {
      no: 2002,
      ad: "Selin",
      soyad: "KAYA",
      unvan: "Dr. Öğr. Üyesi",
      bolum: "Mekatronik",
      uni: UNIVERSITE_AD,
      sifre: "hoca123"
    }];
    localStorage.setItem('MÜOS_Sunucu_Ogretmenler', JSON.stringify(varsayilanHocalar));
  }
} // Sunucuyu ilk açılışta tetikle


sunucuVeritabaniniKur(); // ── 2. SUNUCU API METOTLARI (DATA ACCESS OBJECT) ──

var SunucuAPI = {
  // Tüm merkezi havuzu getir (500 kişi)
  tumOgrencileriGetir: function tumOgrencileriGetir() {
    return JSON.parse(localStorage.getItem('MÜOS_Sunucu_Ogrenciler')) || [];
  },
  // Sadece bizim üniversitenin öğrencilerini süz (ISUBÜ -> 80 kişi)
  uniOgrencileriniGetir: function uniOgrencileriniGetir() {
    var uniAdi = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : UNIVERSITE_AD;
    return this.tumOgrencileriGetir().filter(function (o) {
      return o.uni === uniAdi;
    });
  },
  // Yeni öğrenci kaydet (Numara çakışma kontrolü ile)
  ogrenciEkle: function ogrenciEkle(yeniOgr) {
    var ogrenciler = this.tumOgrencileriGetir();

    if (ogrenciler.some(function (o) {
      return o.no === yeniOgr.no;
    })) {
      return {
        basarili: false,
        mesaj: "Hata: Bu öğrenci numarası sistemde zaten var!"
      };
    }

    ogrenciler.push(yeniOgr);
    localStorage.setItem('MÜOS_Sunucu_Ogrenciler', JSON.stringify(ogrenciler));
    return {
      basarili: true,
      mesaj: "Öğrenci başarıyla merkezi sunucuya kaydedildi."
    };
  },
  // Not/Devamsızlık Güncelleme (Hocaların kullanması için)
  ogrenciGuncelle: function ogrenciGuncelle(ogrNo, yeniVeriler) {
    var ogrenciler = this.tumOgrencileriGetir();
    var indeks = ogrenciler.findIndex(function (o) {
      return o.no === parseInt(ogrNo);
    });

    if (indeks !== -1) {
      ogrenciler[indeks] = _objectSpread({}, ogrenciler[indeks], {}, yeniVeriler);
      localStorage.setItem('MÜOS_Sunucu_Ogrenciler', JSON.stringify(ogrenciler));
      return true;
    }

    return false;
  },
  // Tüm akademisyenleri getir
  tumHocalariGetir: function tumHocalariGetir() {
    return JSON.parse(localStorage.getItem('MÜOS_Sunucu_Ogretmenler')) || [];
  },
  // ── MERKEZİ OTURUM YÖNETİMİ (KİMLİK DOĞRULAMA) ──
  girisYap: function girisYap(kullaniciNo, sifre, rol) {
    // A- MEMUR GİRİŞİ (Öğrenci İşleri)
    if (rol === "memur") {
      if (kullaniciNo === "admin" && sifre === "1234") {
        sessionStorage.setItem('obs_user', JSON.stringify({
          rol: "memur",
          ad: "Merkez Memur",
          uni: UNIVERSITE_AD
        }));
        return {
          basarili: true,
          yonlendir: "ogrenci-isleri.html"
        };
      }
    } // B- HOCA GİRİŞİ (Akademik Panel)
    else if (rol === "hoca") {
        var hocalar = this.tumHocalariGetir();
        var hoca = hocalar.find(function (h) {
          return h.no === parseInt(kullaniciNo) && h.sifre === sifre;
        });

        if (hoca) {
          sessionStorage.setItem('obs_user', JSON.stringify({
            rol: "hoca",
            ad: "".concat(hoca.unvan, " ").concat(hoca.ad, " ").concat(hoca.soyad),
            bolum: hoca.bolum,
            uni: hoca.uni
          }));
          return {
            basarili: true,
            yonlendir: "hoca.html"
          };
        }
      } // C- ÖĞRENCİ GİRİŞİ (Öğrenci Paneli)
      else if (rol === "ogrenci") {
          var ogrenciler = this.uniOgrencileriniGetir(); // Sadece bizim okulun öğrencileri girebilir

          var ogrenci = ogrenciler.find(function (o) {
            return o.no === parseInt(kullaniciNo);
          }); // Öğrenci şifresi varsayılan olarak okul numarasıdır

          if (ogrenci && sifre === String(ogrenci.no)) {
            sessionStorage.setItem('obs_user', JSON.stringify({
              rol: "ogrenci",
              no: ogrenci.no,
              ad: ogrenci.tamAd,
              uni: ogrenci.uni
            }));
            return {
              basarili: true,
              yonlendir: "ogrenci-panel.html"
            };
          }
        }

    return {
      basarili: false,
      mesaj: "Hatalı kullanıcı adı, numara veya şifre!"
    };
  }
};
//# sourceMappingURL=sunucu.dev.js.map
