# Nova Teknik Üniversitesi - Öğrenci Bilgi Sistemi (ÖBS)

Modern, dinamik ve kullanıcı dostu bir Öğrenci Bilgi Sistemi (ÖBS) arayüz projesidir. Frontend (Önyüz) teknolojileri kullanılarak geliştirilmiş olup, arka plan (backend) işlemleri geçici olarak `localStorage` ve `sessionStorage` ile simüle edilmiştir. 

## 🚀 Projenin Amacı ve Özellikleri

Bu proje, bir üniversite öğrencisinin, öğretim görevlisinin ve öğrenci işleri personelinin ihtiyaç duyacağı tüm işlemleri tek bir platformdan, şık bir arayüz ile yapabilmesini hedefler.

* **Farklı Rollerle Giriş:** Öğrenci, Öğretmen ve Öğrenci İşleri olmak üzere üç farklı rolle sisteme giriş yapılabilir.
* **Modern Kullanıcı Deneyimi:** Tamamen responsive (mobil uyumlu), pürüzsüz geçişlere sahip animasyonlu ve "Glassmorphism" detaylarına sahip güncel UI/UX standartlarına uygun bir tasarım.
* **Şifreleme Simülasyonu:** Güvenlik katmanı simülasyonu için istemci tarafında SHA-256 (Web Crypto API) hashleme mekanizması entegrasyonu.
* **Duyuru Yönetimi:** Kategorize edilmiş, modal yapılı ve güçlü görsel hiyerarşiye sahip duyuru sistemi.
* **Dinamik Modal Yapıları:** Şifremi unuttum özelliği ve duyuru okuma için tasarlanmış açılır form/bilgi pencereleri.

## 🛠️ Kullanılan Teknolojiler

* **HTML5:** Sayfa iskeleti ve semantik yapı.
* **CSS3:** Özel CSS değişkenleri (Custom Properties), Flexbox/Grid dizilimleri, animasyonlar (Keyframes) ve modern UI bileşenleri. Tasarımda herhangi bir dış framework (Bootstrap/Tailwind) kullanılmadan Pure/Vanilla CSS ile yapılmıştır.
* **JavaScript (ES6+):** Sayfa içi etkileşimler, dinamik liste render mekanizması (DOM manipülasyonu), asenkron şifreleme işlemleri (Async/Await) ve Web Crypto API.
* **Veri Depolama:** Tarayıcı tarafında `localStorage` (Kalıcı veritabanı simülasyonu) ve `sessionStorage` (Aktif oturum simülasyonu).
* **Fontlar ve İkonlar:** Google Fonts (DM Sans) ve FontAwesome 6.

## 📁 Proje Yapısı

Projeye ait başlıca sayfalar ve ekranlar:
* `index.html`: Sistemin ana giriş, şifre yenileme modülü ve duyurular ekranı.
* `ogrenci.html`: Öğrencilerin notlarını, gno'larını ve temel bilgilerini görebildiği panel.
* `ogretmen.html`: Öğretmenlerin derslerini ve öğrencilerini kontrol ettiği panel.
* `ogrenci-isleri.html`: İdari personelin öğrenci işlemlerini yaptığı genel yönetim paneli.
* Diğer alt sistemler: `ders-kayit.html`, `ders-programi.html`, `burs-basvuru.html`, `dashboard.html` vb.

## 💻 Kurulum ve Çalıştırma

Projede herhangi bir sunucu veya derleme (build) aracı kullanılmadığı için ekstra bir Node/Backend kurulumuna gerek yoktur:

1. Projeyi bilgisayarınıza indirin veya Github üzerinden klonlayın.
2. `frontend/index.html` dosyasını modern bir tarayıcıda (Chrome, Edge, Firefox, vb.) açın.
3. *Tavsiye:* Eğer VS Code kullanıyorsanız kodların en iyi şekilde işlenmesi için "Live Server" eklentisiyle çalıştırmanız önerilir.

## 🔑 Test Hesapları ve Varsayılan Şifreler

Projeyi test etmek için sisteme ilk açılışta tanımlanan aşağıdaki giriş bilgilerini kullanabilirsiniz:

### 1. Öğrenci Girişi
- **Öğrenci Numaraları:** `1001` ile `1080` arasında bir değer. (Örn: `1001`)
- **Şifre:** `1234`

### 2. Öğretmen Girişi
- **Öğretmen Numaraları:** `2001` veya `2002`
- **Şifre:** `5678`

### 3. Öğrenci İşleri (İdari Personel) Girişi
- **Numara:** `3001`
- **Şifre:** `4567`
