USE OBSAppDb;
GO
SET NOCOUNT ON;
DECLARE @i INT = 1001;
DECLARE @RastgeleUni INT;
DECLARE @RastgeleGpa FLOAT;
DECLARE @RastgeleBolum INT;
DECLARE @UniAdi NVARCHAR(150);
DECLARE @BolumAdi NVARCHAR(100);
WHILE @i <= 1500
BEGIN
    SET @RastgeleBolum = FLOOR(RAND() * 4) + 1;
    SET @BolumAdi = CASE @RastgeleBolum
        WHEN 1 THEN N'Bilgisayar Programcılığı'
        WHEN 2 THEN N'Yazılım Mühendisliği'
        WHEN 3 THEN N'Yönetim Bilişim Sistemleri'
        WHEN 4 THEN N'Elektrik-Elektronik Mühendisliği'
    END;
    IF @i <= 1080
    BEGIN
        SET @UniAdi = N'Nova Teknik Üniversitesi';
        SET @RastgeleGpa = ROUND(2.00 + (RAND() * 2.00), 2);
    END
    ELSE
    BEGIN
        SET @RastgeleUni = FLOOR(RAND() * 7) + 1;
        SET @UniAdi = CASE @RastgeleUni
            WHEN 1 THEN N'Gökova Bilim ve Teknoloji Üniversitesi'
            WHEN 2 THEN N'Alp Er Tunga Vakıf Üniversitesi'
            WHEN 3 THEN N'Anka Akıllı Sistemler Üniversitesi'
            WHEN 4 THEN N'Piri Reis Siber Bilimler Üniversitesi'
            WHEN 5 THEN N'Kuzey Işıkları Akademik Portalı'
            WHEN 6 THEN N'Avrasya Dijital Dönüşüm Üniversitesi'
            WHEN 7 THEN N'Atlas İleri Teknoloji Üniversitesi'
        END;
        SET @RastgeleGpa = ROUND(1.50 + (RAND() * 2.50), 2);
    END
    INSERT INTO Ogrenciler (OgrenciNo, Ad, Soyad, Sinif, Gpa, Bolum, KazandigiUniversite, Sifre)
    VALUES (
        CAST(@i AS NVARCHAR(50)),
        N'ÖğrenciAd_' + CAST(@i AS NVARCHAR(50)),
        N'Soyad_' + CAST(@i AS NVARCHAR(50)),
        FLOOR(RAND() * 4) + 1,
        @RastgeleGpa,
        @BolumAdi,
        @UniAdi,
        N'1234'
    );
    SET @i = @i + 1;
END;
SELECT COUNT(*) AS ToplamOgrenci FROM Ogrenciler;
GO