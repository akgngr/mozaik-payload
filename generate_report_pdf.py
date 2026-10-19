#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generates a polished client-facing PDF audit report for Erstehilfe Google Ads & GA4.
"""

def generate_pdf(output_path):
    page_w, page_h = 595, 842  # A4 size in points
    
    def clean_latin(text):
        replacements = {
            'ğ': 'g', 'Ğ': 'G',
            'ş': 's', 'Ş': 'S',
            'ı': 'i', 'İ': 'I',
            '’': "'", '‘': "'", '“': '"', '”': '"',
            '–': '-', '—': '-', '…': '...'
        }
        for k, v in replacements.items():
            text = text.replace(k, v)
        return text

    pages_commands = []
    current_page_cmds = []

    def new_page():
        nonlocal current_page_cmds
        if current_page_cmds:
            pages_commands.append("\n".join(current_page_cmds))
            current_page_cmds = []

    def draw_rect(x, y, w, h, r, g, b, fill=True, stroke=False):
        current_page_cmds.append(f"{r:.3f} {g:.3f} {b:.3f} rg")
        if stroke:
            current_page_cmds.append(f"{r*0.7:.3f} {g*0.7:.3f} {b*0.7:.3f} RG")
            current_page_cmds.append(f"0.5 w")
            current_page_cmds.append(f"{x:.1f} {y:.1f} {w:.1f} {h:.1f} re B")
        else:
            current_page_cmds.append(f"{x:.1f} {y:.1f} {w:.1f} {h:.1f} re f")

    def draw_line(x1, y1, x2, y2, r=0.8, g=0.8, b=0.8, w=1):
        current_page_cmds.append(f"{r:.3f} {g:.3f} {b:.3f} RG")
        current_page_cmds.append(f"{w} w")
        current_page_cmds.append(f"{x1:.1f} {y1:.1f} m {x2:.1f} {y2:.1f} l S")

    def draw_text(x, y, text, size=10, font="F1", r=0.1, g=0.1, b=0.1):
        txt = clean_latin(str(text))
        txt = txt.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        current_page_cmds.append(f"BT /{font} {size} Tf {r:.3f} {g:.3f} {b:.3f} rg {x:.1f} {y:.1f} Td ({txt}) Tj ET")

    # ==================== PAGE 1 ====================
    draw_rect(0, 752, 595, 90, 0.08, 0.18, 0.36)
    draw_rect(0, 747, 595, 5, 0.95, 0.60, 0.07)
    
    draw_text(40, 805, "MUSTERI HESAP DENETIM & IYILESTIRME RAPORU", size=10, font="F2", r=0.95, g=0.75, b=0.2)
    draw_text(40, 775, "Erstehilfe - Google Ads & GA4 Denetim Tablosu", size=17, font="F2", r=1, g=1, b=1)
    draw_text(40, 757, "Analiz Donemi: Son 30 Gun | Hesap ID: 866-355-2364 | Statu: Musteri Onayi Bekleniyor", size=8.5, font="F1", r=0.85, g=0.9, b=0.95)

    y = 715
    draw_text(40, y, "1. MEVCUT HESAP BILANCOSU (SON 30 GUNLUK PERFORMANS)", size=11, font="F2", r=0.08, g=0.18, b=0.36)
    draw_line(40, y - 5, 555, y - 5, r=0.8, g=0.85, b=0.9, w=1.5)
    
    y -= 25
    kpis = [
        ("Toplam Harcama", "4.903,24 EUR", "PMax: %80 | Search: %20", 0.95, 0.95, 0.97),
        ("Toplam Donusum", "175,5 Donusum", "GA4: 155 Satis (Purchase)", 0.95, 0.97, 0.95),
        ("Ortalama CPA", "27,93 EUR", "Search: 24 EUR | PMax: 29 EUR", 0.97, 0.96, 0.94),
        ("Google Ads ROAS", "1,49x", "Search: 1,92x | PMax: 1,38x", 0.94, 0.97, 0.98),
    ]
    box_w = 115
    for i, (title, val, sub, br, bg, bb) in enumerate(kpis):
        bx = 40 + i * (box_w + 6)
        draw_rect(bx, y - 42, box_w, 48, br, bg, bb, fill=True, stroke=True)
        draw_text(bx + 8, y - 6, title, size=8, font="F1", r=0.4, g=0.4, b=0.4)
        draw_text(bx + 8, y - 22, val, size=11, font="F2", r=0.1, g=0.15, b=0.3)
        draw_text(bx + 8, y - 36, sub, size=6.5, font="F1", r=0.3, g=0.5, b=0.3)

    y -= 65
    draw_text(40, y, "2. TESPIT EDILEN HESAP SORUNLARI & IYILESTIRME TABLOSU", size=11, font="F2", r=0.08, g=0.18, b=0.36)
    draw_text(355, y, "*Onay alindiktan sonra devreye alinacaktir", size=7.5, font="F1", r=0.6, g=0.2, b=0.2)
    draw_line(40, y - 5, 555, y - 5, r=0.8, g=0.85, b=0.9, w=1.5)

    y -= 22
    headers = [
        ("No", 25),
        ("Tespit Edilen Sorun", 120),
        ("Mevcut Durum / Metrik", 125),
        ("Olumsuz Etki", 115),
        ("Onerilen Cozum & Aksiyon", 130)
    ]
    draw_rect(40, y - 6, 515, 20, 0.12, 0.23, 0.44)
    cx = 45
    for htitle, hw in headers:
        draw_text(cx, y, htitle, size=8, font="F2", r=1, g=1, b=1)
        cx += hw

    y -= 14

    problems = [
        (
            "1",
            "Cografi Hedefleme",
            "Search harcamasinin %63'u (625 EUR)",
            "Hamburg, Munih, Berlin ve",
            "Konum ayari 'Presence Only' yapilacak.",
            "Sizintisi",
            "'Area of Interest' olarak harcandi.",
            "yurtdisindan bosa tiklama alindi.",
            "Yalnizca Hannover & cevre 20km hedeflenecek."
        ),
        (
            "2",
            "Butce Dengesizligi",
            "Butcenin %80'i (3.907 EUR) PMax'te.",
            "Yuksek verimli Search bileseni",
            "Search butcesi %20'den %45'e cikarilacak.",
            "& Search Kisiti",
            "Search CPA'si 24 EUR, PMax ise 29 EUR.",
            "daralirken, PMax butceyi tuketiyor.",
            "PMax Target CPA 26 EUR ile limitlenecek."
        ),
        (
            "3",
            "Eksik Anahtar",
            "Search'te yalnizca 2 kelime tanimli.",
            "Ehliyet (Fuhrerschein) ve sirket",
            "4 yeni reklam grubu acilacak: Fuhrerschein,",
            "Kelime Yapisi",
            "Yuksek donusumlu aramalar karsilanmiyor.",
            "talepleri kontrolsuzce PMax'e kayiyor.",
            "Termine, Betriebliche Ersthelfer, English."
        ),
        (
            "4",
            "Masaustu (Desktop)",
            "Mobilde CPA 21-28 EUR iken,",
            "Masaustu tiklamalari rezervasyona",
            "Search'te Desktop teklif ayarlamasi",
            "Yuksek CPA Zarari",
            "Masaustunde CPA 39-41 EUR (%80 pahali).",
            "donusmuyor, maliyeti sisiriyor.",
            "-%25 dusurulecek, butce mobile kaydirilacak."
        ),
        (
            "5",
            "Negatif Kelime",
            "Search terimlerinde baska sehirler",
            "Ilkisiz kullanicilar tiklama basina",
            "Hesap genelinde Negatif Liste kurulacak.",
            "Eksikligi",
            "(Nienburg, Leer vb.) ve rakipler var.",
            "2,50 EUR gereksiz maliyet uretiyor.",
            "Uzak sehirler ve bilgi aramalari engellenecek."
        ),
        (
            "6",
            "Tiklama - Oturum",
            "Ads 1.948 tiklama bildirirken,",
            "Kullanici davranisi izlenemiyor,",
            "Cookie banner (Consent Mode v2) ve mobil",
            "Kaybi (%71 Fark)",
            "GA4'te sadece 558 oturum gorunuyor.",
            "mobil acilista kayiplar yasaniyor.",
            "acilis hizi teknik olarak incelenecek."
        )
    ]

    for idx, (pnum, ptitle1, pmet1, peff1, psol1, ptitle2, pmet2, peff2, psol2) in enumerate(problems):
        row_bg = (0.98, 0.98, 0.99) if idx % 2 == 0 else (0.94, 0.95, 0.97)
        draw_rect(40, y - 28, 515, 36, row_bg[0], row_bg[1], row_bg[2], fill=True, stroke=True)
        
        cx = 45
        draw_text(cx, y - 2, pnum, size=8, font="F2", r=0.1, g=0.2, b=0.4)
        cx += 25
        draw_text(cx, y - 2, ptitle1, size=8, font="F2", r=0.1, g=0.2, b=0.4)
        cx += 120
        draw_text(cx, y - 2, pmet1, size=7.2, font="F1", r=0.2, g=0.2, b=0.2)
        cx += 125
        draw_text(cx, y - 2, peff1, size=7.2, font="F1", r=0.6, g=0.1, b=0.1)
        cx += 115
        draw_text(cx, y - 2, psol1, size=7.2, font="F2", r=0.1, g=0.4, b=0.2)

        cx = 45 + 25
        draw_text(cx, y - 14, ptitle2, size=8, font="F2", r=0.1, g=0.2, b=0.4)
        cx += 120
        draw_text(cx, y - 14, pmet2, size=7.2, font="F1", r=0.2, g=0.2, b=0.2)
        cx += 125
        draw_text(cx, y - 14, peff2, size=7.2, font="F1", r=0.6, g=0.1, b=0.1)
        cx += 115
        draw_text(cx, y - 14, psol2, size=7.2, font="F1", r=0.1, g=0.4, b=0.2)

        y -= 42

    draw_line(40, 35, 555, 35, r=0.8, g=0.8, b=0.8, w=0.5)
    draw_text(40, 22, "Erstehilfe | Gizli & Ozel Musteri Raporu", size=8, font="F1", r=0.5, g=0.5, b=0.5)
    draw_text(500, 22, "Sayfa 1 / 2", size=8, font="F1", r=0.5, g=0.5, b=0.5)

    # ==================== PAGE 2 ====================
    new_page()

    draw_rect(0, 782, 595, 60, 0.08, 0.18, 0.36)
    draw_rect(0, 777, 595, 5, 0.95, 0.60, 0.07)
    draw_text(40, 808, "AYLIK BUTCE OPTIMIZASYON PLANI & AKSİYON YOL HARITASI", size=13, font="F2", r=1, g=1, b=1)
    draw_text(40, 792, "Onerilen Aylik Butce Dagitimi, Beklenen Kazanclar ve Musteri Onayi", size=8.5, font="F1", r=0.85, g=0.9, b=0.95)

    y = 745
    draw_text(40, y, "3. ONERILEN AYLIK BUTCE TAHSIS VE OPTIMIZASYON MODELI", size=11, font="F2", r=0.08, g=0.18, b=0.36)
    draw_line(40, y - 5, 555, y - 5, r=0.8, g=0.85, b=0.9, w=1.5)

    y -= 22
    b_headers = [("Kampanya / Kanal", 145), ("Mevcut Butce", 90), ("Onerilen Butce", 95), ("Hedef CPA", 85), ("Stratejik Odak", 100)]
    draw_rect(40, y - 6, 515, 20, 0.12, 0.23, 0.44)
    bx = 45
    for btitle, bw in b_headers:
        draw_text(bx, y, btitle, size=8, font="F2", r=1, g=1, b=1)
        bx += bw

    y -= 14
    budget_rows = [
        ("Google Search (Arama)", "996 EUR (%20)", "2.250 EUR (%47)", "20 - 22 EUR", "Ehliyet + Hafta Sonu + Kurumsal", 0.95, 0.98, 0.95),
        ("Performance Max (PMax)", "3.907 EUR (%80)", "2.000 EUR (%42)", "25 - 26 EUR", "Yalnizca Yuksek Donusen Kanallar", 0.98, 0.98, 0.99),
        ("Yeniden Pazarlama / Test", "0 EUR (%0)", "500 EUR (%11)", "16 - 18 EUR", "Tarih Secip Almayanlar (Retargeting)", 0.95, 0.98, 0.95),
        ("TOPLAM AYLIK BUTCE", "4.903 EUR", "4.750 EUR", "21 - 23 EUR", "+%25-35 Daha Fazla Rezervasyon", 0.92, 0.94, 0.97)
    ]

    for b_c, b_cur, b_prop, b_cpa, b_note, br, bg, bb in budget_rows:
        is_total = "TOPLAM" in b_c
        draw_rect(40, y - 20, 515, 24, br, bg, bb, fill=True, stroke=True)
        cx = 45
        draw_text(cx, y - 4, b_c, size=8, font="F2" if is_total else "F2", r=0.1, g=0.2, b=0.4 if not is_total else 0.1)
        cx += 145
        draw_text(cx, y - 4, b_cur, size=8, font="F1", r=0.3, g=0.3, b=0.3)
        cx += 90
        draw_text(cx, y - 4, b_prop, size=8, font="F2", r=0.1, g=0.45, b=0.15)
        cx += 95
        draw_text(cx, y - 4, b_cpa, size=8, font="F1", r=0.2, g=0.2, b=0.2)
        cx += 85
        draw_text(cx, y - 4, b_note, size=7.5, font="F1", r=0.3, g=0.3, b=0.3)
        y -= 28

    y -= 10
    draw_rect(40, y - 55, 515, 60, 0.93, 0.97, 0.94, fill=True, stroke=True)
    draw_text(50, y - 10, "BEKLENEN FINANSAL VE OPERASYONEL KAZANCLAR:", size=8.5, font="F2", r=0.1, g=0.5, b=0.2)
    draw_text(50, y - 24, "- Ayni reklam butcesiyle aylik rezervasyon hacmi 175 adetten 215 - 230 adede yukselecektir.", size=8, font="F1", r=0.15, g=0.3, b=0.15)
    draw_text(50, y - 37, "- Ortalama Rezervasyon Basi Maliyet (CPA) 27,93 EUR seviyesinden 21,50 EUR seviyesine gerileyecektir.", size=8, font="F1", r=0.15, g=0.3, b=0.15)
    draw_text(50, y - 50, "- Sehir disina ve masaustunde bos yere giden tahmini 800 - 1.000 EUR/ay reklam butcesi israftan kurtarilacaktir.", size=8, font="F1", r=0.15, g=0.3, b=0.15)

    y -= 75
    draw_text(40, y, "4. ADIM ADIM UYGULAMA PLANI (MUSTERI ONAYI SONRASI)", size=11, font="F2", r=0.08, g=0.18, b=0.36)
    draw_line(40, y - 5, 555, y - 5, r=0.8, g=0.85, b=0.9, w=1.5)

    y -= 20
    phases = [
        ("FAZ 1: ACIL KORUMA (1. Gun)", "Konum ayarini 'Presence Only' yapma, negatif anahtar kelime listesini ekleme, Desktop teklif kirmasi (-%25).", 0.98, 0.94, 0.94, 0.6, 0.1, 0.1),
        ("FAZ 2: BUTCE & ARAMA YENILENMESI (1. Hafta)", "Search butcesini artirma, 4 yeni tematik reklam grubu ekleme (Fuhrerschein, Termine, Sirket, English), PMax tCPA kilitleme.", 0.98, 0.97, 0.93, 0.7, 0.4, 0.0),
        ("FAZ 3: TEKNIK & HUNNEL IYILESTIRMESI (2. Hafta)", "Consent Mode v2 entegrasyonu, mobil rezervasyon takvimindeki %50 drop-off iyilestirmesi (hizli odeme entegrasyonu).", 0.94, 0.96, 0.98, 0.1, 0.3, 0.6)
    ]
    for p_title, p_desc, p_br, p_bg, p_bb, p_tr, p_tg, p_tb in phases:
        draw_rect(40, y - 22, 515, 26, p_br, p_bg, p_bb, fill=True, stroke=True)
        draw_text(48, y - 8, p_title, size=8, font="F2", r=p_tr, g=p_tg, b=p_tb)
        draw_text(48, y - 19, p_desc, size=7.2, font="F1", r=0.2, g=0.2, b=0.2)
        y -= 31

    y -= 15
    draw_text(40, y, "5. MUSTERI ONAY BEYANI", size=11, font="F2", r=0.08, g=0.18, b=0.36)
    draw_line(40, y - 5, 555, y - 5, r=0.8, g=0.85, b=0.9, w=1.5)

    y -= 15
    draw_rect(40, y - 60, 515, 65, 0.97, 0.97, 0.98, fill=True, stroke=True)
    draw_text(50, y - 10, "Yukarida belirtilen hesap denetim bulgulari, butce tahsis modeli ve iyilestirme plani tarafimca incelenmistir.", size=8, font="F1", r=0.2, g=0.2, b=0.2)
    draw_text(50, y - 22, "[  ] Faz 1, Faz 2 ve Faz 3 kapsamindaki tum optimizasyonlarin baslatilmasini onayliyorum.", size=8, font="F2", r=0.1, g=0.2, b=0.4)
    draw_text(50, y - 34, "[  ] Yalnizca acil guvenlik ve negatif kelime duzenlemelerinin (Faz 1) yapilmasini onayliyorum.", size=8, font="F1", r=0.3, g=0.3, b=0.3)
    
    draw_text(50, y - 52, "Yetkili Isim / Imza: ____________________________________    Tarih: ____ / ____ / 2026", size=8, font="F2", r=0.2, g=0.2, b=0.2)

    draw_line(40, 35, 555, 35, r=0.8, g=0.8, b=0.8, w=0.5)
    draw_text(40, 22, "Erstehilfe | Gizli & Ozel Musteri Raporu", size=8, font="F1", r=0.5, g=0.5, b=0.5)
    draw_text(500, 22, "Sayfa 2 / 2", size=8, font="F1", r=0.5, g=0.5, b=0.5)

    new_page()
    
    pdf_lines = ["%PDF-1.4", "%\xe2\xe3\xcf\xd3"]
    offsets = []

    def add_obj(body):
        offsets.append(sum(len(l.encode("latin1")) + 1 for l in pdf_lines))
        num = len(offsets)
        pdf_lines.append(f"{num} 0 obj\n{body}\nendobj")
        return num

    num_pages = len(pages_commands)
    font1_id = 3
    font2_id = 4
    
    page_ids = []
    content_ids = []
    
    cur_id = 5
    for _ in range(num_pages):
        page_ids.append(cur_id)
        content_ids.append(cur_id + 1)
        cur_id += 2

    add_obj("<< /Type /Catalog /Pages 2 0 R >>")
    kids_str = " ".join(f"{pid} 0 R" for pid in page_ids)
    add_obj(f"<< /Type /Pages /Kids [{kids_str}] /Count {num_pages} >>")
    add_obj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    add_obj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")

    for i in range(num_pages):
        pid = page_ids[i]
        cid = content_ids[i]
        stream_data = pages_commands[i]
        stream_len = len(stream_data.encode("latin1"))
        
        add_obj(f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents {cid} 0 R >>")
        add_obj(f"<< /Length {stream_len} >>\nstream\n{stream_data}\nendstream")

    xref_pos = sum(len(l.encode("latin1")) + 1 for l in pdf_lines)
    pdf_lines.append("xref")
    pdf_lines.append(f"0 {len(offsets) + 1}")
    pdf_lines.append("0000000000 65535 f ")
    for off in offsets:
        pdf_lines.append(f"{off:010d} 00000 n ")
    pdf_lines.append(f"trailer\n<< /Size {len(offsets) + 1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF")

    with open(output_path, "wb") as f:
        f.write("\n".join(pdf_lines).encode("latin1"))
    print(f"PDF successfully created at: {output_path}")

if __name__ == "__main__":
    out = "/Users/akgngr/httpd/mosaikruesselsheim/erstehilfe_google_ads_musteri_raporu.pdf"
    generate_pdf(out)
