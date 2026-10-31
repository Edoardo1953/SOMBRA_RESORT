import os, json
import openpyxl
from datetime import datetime

def clean_val(v):
    if isinstance(v, datetime):
        return v.strftime('%Y-%m-%d')
    return v

# --- 1. LUXEMBOURG BANK TRANSACTIONS ---
wb_conta = openpyxl.load_workbook('uploads/CONTA Sombra Resort Sàrl.xlsx', data_only=True)

# Olky Pay
ws_o = wb_conta['OLKYPAY']
olkypay_txs = []
for r in range(6, ws_o.max_row+1):
    nr = ws_o.cell(r, 2).value
    desc = ws_o.cell(r, 3).value
    ordinante = ws_o.cell(r, 4).value
    socio = ws_o.cell(r, 5).value
    beneficiario = ws_o.cell(r, 6).value
    d_compt = ws_o.cell(r, 7).value
    d_val = ws_o.cell(r, 8).value
    tot = ws_o.cell(r, 9).value
    solde = ws_o.cell(r, 10).value
    if (desc and str(desc).strip()) or tot is not None:
        amt = float(tot) if tot is not None else 0.0
        bal = float(solde) if solde is not None else 0.0
        date_str = clean_val(d_compt) or clean_val(d_val) or '2021-10-11'
        olkypay_txs.append({
            'id': f'OLK-{len(olkypay_txs)+1:03d}',
            'nr': nr or (len(olkypay_txs)+1),
            'desc': str(desc or '').strip(),
            'ordinante': str(ordinante or '').strip(),
            'socio': str(socio or '').strip(),
            'beneficiario': str(beneficiario or '').strip(),
            'date': str(date_str)[:10],
            'amount': round(amt, 2),
            'balance': round(bal, 2),
            'bank': 'olky'
        })

# Revolut
ws_r = wb_conta['Conto REVOLUT']
revolut_txs = []
for r in range(6, ws_r.max_row+1):
    nr = ws_r.cell(r, 2).value
    desc = ws_r.cell(r, 3).value
    ordinante = ws_r.cell(r, 4).value
    socio = ws_r.cell(r, 5).value
    beneficiario = ws_r.cell(r, 6).value
    d_compt = ws_r.cell(r, 7).value
    d_val = ws_r.cell(r, 8).value
    tot = ws_r.cell(r, 9).value
    solde = ws_r.cell(r, 10).value
    if (desc and str(desc).strip()) or tot is not None:
        amt = float(tot) if tot is not None else 0.0
        bal = float(solde) if solde is not None else 0.0
        date_str = clean_val(d_compt) or clean_val(d_val) or '2026-03-04'
        revolut_txs.append({
            'id': f'REV-{len(revolut_txs)+1:03d}',
            'nr': nr or (len(revolut_txs)+1),
            'desc': str(desc or '').strip(),
            'ordinante': str(ordinante or '').strip(),
            'socio': str(socio or '').strip(),
            'beneficiario': str(beneficiario or '').strip(),
            'date': str(date_str)[:10],
            'amount': round(amt, 2),
            'balance': round(bal, 2),
            'bank': 'revolut'
        })

# --- 2. BANCO DO BRASIL TRANSACTIONS ---
wb_bb = openpyxl.load_workbook('uploads/Partecipazione/Sombra Resort conta Banco Brasil.xlsx', data_only=True)
ws_bb_cc = wb_bb['Conta corrente']
bb_cc_txs = []
for r in range(6, ws_bb_cc.max_row+1):
    nr = ws_bb_cc.cell(r, 1).value
    dt = ws_bb_cc.cell(r, 2).value
    yr = ws_bb_cc.cell(r, 3).value
    desc = ws_bb_cc.cell(r, 4).value
    eu = ws_bb_cc.cell(r, 5).value
    cat = ws_bb_cc.cell(r, 6).value
    tipo = ws_bb_cc.cell(r, 7).value
    sogg = ws_bb_cc.cell(r, 8).value
    tot = ws_bb_cc.cell(r, 9).value
    solde = ws_bb_cc.cell(r, 10).value
    if (desc and str(desc).strip()) or tot is not None:
        amt = float(tot) if tot is not None else 0.0
        bal = float(solde) if solde is not None else 0.0
        date_str = clean_val(dt) or f'{yr}-01-01'
        bb_cc_txs.append({
            'id': f'BB-{len(bb_cc_txs)+1:03d}',
            'nr': nr or (len(bb_cc_txs)+1),
            'desc': str(desc or '').strip(),
            'categoria': str(cat or '').strip(),
            'tipo': str(tipo or '').strip(),
            'soggetto': str(sogg or '').strip(),
            'date': str(date_str)[:10],
            'amount': round(amt, 2),
            'balance': round(bal, 2),
            'bank': 'bb_brasil',
            'currency': 'BRL'
        })

# --- 3. PARTNERS & VILLAS ---
# Official 15,000 shares breakdown
partners_data = [
    {
        "id": "SH-01",
        "nr": 1,
        "name": "OLIVEIRA DA COSTA Christine Anne",
        "type": "Personne Physique",
        "rcs": "-",
        "shares": 659,
        "par_value": 659.00,
        "pct": 4.3933,
        "villa": "Villa A",
        "residence": "2B rue d'Ehlerange, Mondercange",
        "country": "Luxembourg",
        "bo": "Christine Oliveira Da Costa",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#84cc16"
    },
    {
        "id": "SH-02",
        "nr": 2,
        "name": "LIESEN Jens",
        "type": "Personne Physique",
        "rcs": "-",
        "shares": 659,
        "par_value": 659.00,
        "pct": 4.3933,
        "villa": "Villa A",
        "residence": "2B rue d'Ehlerange, Mondercange",
        "country": "Luxembourg",
        "bo": "Jens Liesen",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#a855f7"
    },
    {
        "id": "SH-03",
        "nr": 3,
        "name": "VIGNOLLE Gabriel Alexander",
        "type": "Personne Physique",
        "rcs": "-",
        "shares": 600,
        "par_value": 600.00,
        "pct": 4.0000,
        "villa": "Villa B",
        "residence": "Vienne",
        "country": "Autriche",
        "bo": "Gabriel Alexander Vignolle",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#3b82f6"
    },
    {
        "id": "SH-04",
        "nr": 4,
        "name": "VIGNOLLE Matteo Dominik",
        "type": "Personne Physique",
        "rcs": "-",
        "shares": 600,
        "par_value": 600.00,
        "pct": 4.0000,
        "villa": "Villa B",
        "residence": "Amsterdam",
        "country": "Pays-Bas",
        "bo": "Matteo Dominik Vignolle",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#6366f1"
    },
    {
        "id": "SH-05",
        "nr": 5,
        "name": "VIGNOLLE Giorgio",
        "type": "Personne Physique",
        "rcs": "-",
        "shares": 372,
        "par_value": 372.00,
        "pct": 2.4800,
        "villa": "Villa B",
        "residence": "56 rue de Beggen, Luxembourg",
        "country": "Luxembourg",
        "bo": "Giorgio Vignolle",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#eab308"
    },
    {
        "id": "SH-06",
        "nr": 6,
        "name": "COFRE LUXEMBOURG WIND S.A.",
        "type": "Société Anonyme",
        "rcs": "B 187520",
        "shares": 2036,
        "par_value": 2036.00,
        "pct": 13.5733,
        "villa": "Villa C",
        "residence": "17 rue Beaumont, Luxembourg",
        "country": "Luxembourg",
        "bo": "Baguanier Henri (100%)",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#0284c7"
    },
    {
        "id": "SH-07",
        "nr": 7,
        "name": "LAMBERT Ingrid Monique Yvonne",
        "type": "Personne Physique",
        "rcs": "-",
        "shares": 763,
        "par_value": 763.00,
        "pct": 5.0867,
        "villa": "Villa D",
        "residence": "27 rue de Neuort, Hobscheid",
        "country": "Luxembourg",
        "bo": "Ingrid Lambert",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#14b8a6"
    },
    {
        "id": "SH-08",
        "nr": 8,
        "name": "RAGGI Giancarlo",
        "type": "Personne Physique",
        "rcs": "-",
        "shares": 749,
        "par_value": 749.00,
        "pct": 4.9933,
        "villa": "Villa D",
        "residence": "Luxembourg",
        "country": "Luxembourg",
        "bo": "Giancarlo Raggi",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#f97316"
    },
    {
        "id": "SH-09",
        "nr": 9,
        "name": "TUBIA Enrico",
        "type": "Personne Physique",
        "rcs": "-",
        "shares": 1452,
        "par_value": 1452.00,
        "pct": 9.6800,
        "villa": "Villa E",
        "residence": "Hong Kong",
        "country": "Hong Kong",
        "bo": "Enrico Tubia",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#06b6d4"
    },
    {
        "id": "SH-10",
        "nr": 10,
        "name": "TUBIA Silvia",
        "type": "Personne Physique",
        "rcs": "-",
        "shares": 1452,
        "par_value": 1452.00,
        "pct": 9.6800,
        "villa": "Villa F",
        "residence": "Luxembourg",
        "country": "Luxembourg",
        "bo": "Silvia Tubia",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#ec4899"
    },
    {
        "id": "SH-11",
        "nr": 11,
        "name": "NEW LIFE S.à r.l.",
        "type": "Société Sàrl",
        "rcs": "B 17790",
        "shares": 135,
        "par_value": 135.00,
        "pct": 0.9000,
        "villa": "Villa F",
        "residence": "Strassen, Luxembourg",
        "country": "Luxembourg",
        "bo": "Edoardo Tubia",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#10b981",
        "shares_history": "135 parts de la Villa F (Casa F) détenues par NEW LIFE Sàrl (Bénéficiaire Effectif / UBO : Edoardo Tubia)."
    },
    {
        "id": "SH-12",
        "nr": 12,
        "name": "HEMAWITI Susik",
        "type": "Personne Physique",
        "rcs": "-",
        "shares": 1796,
        "par_value": 1796.00,
        "pct": 11.9733,
        "villa": "Villa G",
        "residence": "Bantul D.I. Yogyakarta",
        "country": "Indonésie",
        "bo": "Susik Hemawiti",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#f59e0b"
    },
    {
        "id": "SH-13",
        "nr": 13,
        "name": "NEW LIFE S.à r.l.",
        "type": "Société Sàrl",
        "rcs": "B 17790",
        "shares": 2245,
        "par_value": 2245.00,
        "pct": 14.9667,
        "villa": "Villa H",
        "residence": "Strassen, Luxembourg",
        "country": "Luxembourg",
        "bo": "Edoardo Tubia",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#10b981",
        "shares_history": "2.245 parts de la Villa H + 135 parts de la Villa F = 2.380 parts au total (15,8667% du capital social de Sombra Resort Sàrl)"
    },
    {
        "id": "SH-14",
        "nr": 14,
        "name": "BARBANCEY Michel",
        "type": "Personne Physique",
        "rcs": "-",
        "shares": 1482,
        "par_value": 1482.00,
        "pct": 9.8800,
        "villa": "Villa I",
        "residence": "9 rue Bernard Haal, Luxembourg",
        "country": "Luxembourg",
        "bo": "Michel Barbancey",
        "kyc_status": "Conforme",
        "pep": "Non",
        "color": "#8b5cf6"
    }
]
# 9 Villas grouping
villas_data = [
    { "id": "VILLA-A", "name": "Villa A", "shares": 1318, "pct": 8.7867, "owners": ["Christine Oliveira Da Costa (659)", "Jens Liesen (659)"], "desc": "Villa de luxe 2 suites, jardin privatif et terrasse solarium" },
    { "id": "VILLA-B", "name": "Villa B", "shares": 1572, "pct": 10.4800, "owners": ["Gabriel Vignolle (600)", "Matteo Vignolle (600)", "Giorgio Vignolle (372)"], "desc": "Villa de prestige 3 chambres avec piscine et véranda tropicale" },
    { "id": "VILLA-C", "name": "Villa C", "shares": 2036, "pct": 13.5733, "owners": ["Cofre Luxembourg Wind S.A. (2.036)"], "desc": "Villa Master Grand Confort avec vue panoramique" },
    { "id": "VILLA-D", "name": "Villa D", "shares": 1512, "pct": 10.0800, "owners": ["Ingrid Lambert (763)", "Giancarlo Raggi (749)"], "desc": "Villa duplex de style contemporain et jardin zen" },
    { "id": "VILLA-E", "name": "Villa E", "shares": 1452, "pct": 9.6800, "owners": ["Enrico Tubia (1.452)"], "desc": "Villa haut standing avec intégration paysagère naturelle" },
    { "id": "VILLA-F", "name": "Villa F", "shares": 1587, "pct": 10.5800, "owners": ["Silvia Tubia (1.452)", "NEW LIFE Sàrl (135)"], "desc": "Villa familiale spacieuse avec terrasse en deck bois" },
    { "id": "VILLA-G", "name": "Villa G", "shares": 1796, "pct": 11.9733, "owners": ["Susik Hemawiti (1.796)"], "desc": "Villa tropicale de style balinais avec bassin privatif" },
    { "id": "VILLA-H", "name": "Villa H", "shares": 2245, "pct": 14.9667, "owners": ["NEW LIFE Sàrl (2.245)"], "desc": "Villa Signature de grand luxe avec suite principale majestueuse" },
    { "id": "VILLA-I", "name": "Villa I", "shares": 1482, "pct": 9.8800, "owners": ["Michel Barbancey (1.482)"], "desc": "Villa d'architecte avec salon ouvert sur la canopée" }
]

# --- 4. OFFICIAL DOCUMENTS CATALOG ---
documents_data = [
    {
        "id": "DOC-01",
        "title": "RCS - Sombra Resort 01.2026.pdf",
        "category": "Certificati",
        "description": "Extrait officiel du Registre de Commerce et des Sociétés (RCS B263295) émis le 21/01/2026",
        "date": "21/01/2026",
        "reference": "RCSL-B263295-202601",
        "file_path": "uploads/Documenti/RCS - Sombra Resort 01.2026.pdf",
        "file_type": "pdf",
        "file_size": "390 KB",
        "status": "Officiel Actif",
        "status_color": "emerald"
    },
    {
        "id": "DOC-02",
        "title": "ACTE de transfer du Siège 2021.pdf",
        "category": "Statuti",
        "description": "Acte notarié de transfert de siège au 17 rue Beaumont Luxembourg et statuts coordonnés (36 pages)",
        "date": "20/12/2021",
        "reference": "NOT-2021-LUX-36P",
        "file_path": "uploads/Documenti/ACTE de transfer du Siege 2021.pdf",
        "file_type": "pdf",
        "file_size": "2.05 MB",
        "status": "Acté Notaire",
        "status_color": "emerald"
    },
    {
        "id": "DOC-03",
        "title": "Sombra Resort - RBE Extrait 04.2025.pdf",
        "category": "Certificati",
        "description": "Extrait officiel du Registre des Bénéficiaires Effectifs (RBE) Luxembourg",
        "date": "07/04/2025",
        "reference": "RBE-LUX-202504",
        "file_path": "uploads/Documenti/Sombra Resort - RBE Extrait 04.2025.pdf",
        "file_type": "pdf",
        "file_size": "47 KB",
        "status": "Conforme RBE",
        "status_color": "emerald"
    },
    {
        "id": "DOC-04",
        "title": "Bilan et P&P détaillés (comparatif) 31122025 v2.pdf",
        "category": "Bilanci",
        "description": "Bilan officiel abrégé et Compte de Profits et Pertes comparatif 2025 vs 2024 certifié PCN",
        "date": "14/07/2026",
        "reference": "BIL-PCN-2025-V2",
        "file_path": "uploads/Documenti/SOMBRA E AGUA FRESCA RESORT SARL - Bilan et PP detailles (comparatif) 31122025 v2.pdf",
        "file_type": "pdf",
        "file_size": "102 KB",
        "status": "Déposé / Certifié",
        "status_color": "emerald"
    },
    {
        "id": "DOC-05",
        "title": "Grand-livre (History Report) 31122025 v2.pdf",
        "category": "Bilanci",
        "description": "Grand-livre général complet des écritures comptables 2025 PCN (8 pages)",
        "date": "14/07/2026",
        "reference": "GL-2025-PCN-HIST",
        "file_path": "uploads/Documenti/SOMBRA E AGUA FRESCA RESORT SARL - Grand-livre (History Report) 31122025 v2.pdf",
        "file_type": "pdf",
        "file_size": "96 KB",
        "status": "Complet",
        "status_color": "blue"
    },
    {
        "id": "DOC-06",
        "title": "SOMBRA RESORT company scheme 2026.xlsx",
        "category": "Statuti",
        "description": "Schéma de détention, répartition des 15.000 parts, cap table et attribution des 9 villas",
        "date": "14/07/2026",
        "reference": "SCH-2026-VILLAS",
        "file_path": "uploads/Documenti/SOMBRA RESORT company scheme 2026.xlsx",
        "file_type": "xlsx",
        "file_size": "45 KB",
        "status": "Référentiel",
        "status_color": "emerald"
    },
    {
        "id": "DOC-07",
        "title": "CONTA Sombra Resort Sàrl.xlsx",
        "category": "Trésorerie",
        "description": "Grand livre bancaire complet Olky Pay & Revolut, relevés, écritures comptables et cessions",
        "date": "23/10/2026",
        "reference": "XLS-CONTA-LUX-2026",
        "file_path": "uploads/CONTA Sombra Resort Sarl.xlsx",
        "file_type": "xlsx",
        "file_size": "175 KB",
        "status": "Opérationnel",
        "status_color": "emerald"
    },
    {
        "id": "DOC-08",
        "title": "CNPJ 2021 - Sombra Resort Brasil.pdf",
        "category": "Partecipazione",
        "description": "Cartão CNPJ 43.730.206/0001-80 da Sombra Resort Brasil Sociedade Unipessoal Ltda na Receita Federal",
        "date": "02/10/2021",
        "reference": "CNPJ-43730206",
        "file_path": "uploads/Partecipazione/CNPJ 2021.pdf",
        "file_type": "pdf",
        "file_size": "129 KB",
        "status": "Actif RFB",
        "status_color": "emerald"
    },
    {
        "id": "DOC-09",
        "title": "CONTRATO REGISTRATO - Sombra Resort Brasil Ltda.pdf",
        "category": "Partecipazione",
        "description": "Contrato Social Constitutivo e alterações registradas na JUCERN (Inscrição 24200911503)",
        "date": "02/10/2021",
        "reference": "JUCERN-24200911503",
        "file_path": "uploads/Partecipazione/CONTRATO REGISTRATO.pdf",
        "file_type": "pdf",
        "file_size": "5.85 MB",
        "status": "Registrado JUCERN",
        "status_color": "emerald"
    },
    {
        "id": "DOC-10",
        "title": "BALANÇO PATRIMONIAL 2025 - SOMBRA RESORT_ASSINADO.pdf",
        "category": "Partecipazione",
        "description": "Balanço Patrimonial ao 31/12/2025 assinado pelo Contador e Administrador (Ativo R$ 5,29M)",
        "date": "14/07/2026",
        "reference": "BAL-BR-2025-ASS",
        "file_path": "uploads/Partecipazione/BALANCO PATRIMONIAL 2025 - SOMBRA RESORT_ASSINADO.pdf",
        "file_type": "pdf",
        "file_size": "119 KB",
        "status": "Assinado",
        "status_color": "emerald"
    },
    {
        "id": "DOC-11",
        "title": "DRE 2025 - SOMBRA RESORT_ASSINADO.pdf",
        "category": "Partecipazione",
        "description": "Demonstração do Resultado do Exercício (DRE) 2025 assinado da filiale brasileira",
        "date": "13/07/2026",
        "reference": "DRE-BR-2025-ASS",
        "file_path": "uploads/Partecipazione/DRE 2025 - SOMBRA RESORT_ASSINADO.pdf",
        "file_type": "pdf",
        "file_size": "109 KB",
        "status": "Assinado",
        "status_color": "emerald"
    },
    {
        "id": "DOC-12",
        "title": "153.22 I_P CONTRATO POUSADA SOMBRA E AGUA FRESCA.pdf",
        "category": "Partecipazione",
        "description": "Instrumento Particular de Contrato de Exploração e Operação com Pousada Sombra e Água Fresca",
        "date": "09/05/2023",
        "reference": "CONT-POUSADA-153.22",
        "file_path": "uploads/Partecipazione/153.22 I_P CONTRATO POUSADA SOMBRA E AGUA FRESCA.pdf",
        "file_type": "pdf",
        "file_size": "1.07 MB",
        "status": "Contrat Actif",
        "status_color": "emerald"
    },
    {
        "id": "DOC-13",
        "title": "Sombra Resort conta Banco Brasil.xlsx",
        "category": "Partecipazione",
        "description": "Extratos bancários consolidados Banco do Brasil C/C 48649-3 e Conto Investimentos",
        "date": "13/10/2026",
        "reference": "XLS-BB-48649-3",
        "file_path": "uploads/Partecipazione/Sombra Resort conta Banco Brasil.xlsx",
        "file_type": "xlsx",
        "file_size": "152 KB",
        "status": "Auditée",
        "status_color": "emerald"
    },
    {
        "id": "DOC-14",
        "title": "ADITIVO 02 - CONTRATO SOCIAL CONSOLIDADO (2026).pdf",
        "category": "Partecipazione",
        "description": "Alteração e Consolidação do Contrato Social: Admissão de Edoardo Tubia como Administrador não sócio ao lado de Ricardo Pimentel Portela de Moraes (gestão com poderes isolados)",
        "date": "08/10/2026",
        "reference": "JUCERN-ADITIVO-02-2026",
        "file_path": "uploads/Partecipazione/ADITIVO 02 - CONTRATO SOCIAL CONSOLIDADO (2026).pdf",
        "file_type": "pdf",
        "file_size": "956 KB",
        "status": "Assinado / JUCERN",
        "status_color": "emerald"
    },
    {
        "id": "DOC-15",
        "title": "ADITIVO 02 - Traduzione Ufficiale Italiano.html",
        "category": "Partecipazione",
        "description": "Traduzione integrale e asseverata in lingua italiana dell'Aditivo 02 e Contratto Sociale Consolidato di Sombra Resort Brasil Ltda",
        "date": "08/10/2026",
        "reference": "TRAD-IT-ADITIVO-02",
        "file_path": "uploads/Partecipazione/ADITIVO 02 - Traduzione Ufficiale Italiano.html",
        "file_type": "html",
        "file_size": "14 KB",
        "status": "Traduzione Ufficiale",
        "status_color": "emerald"
    }
]

# --- 5. COMPOSITION OF DATA.JS ---
data_obj = {
    "company": {
        "name": "SOMBRA E AGUA FRESCA RESORT S.à r.l.",
        "short_name": "Sombra Resort Sàrl",
        "brand_name": "SOMBRA RESORT",
        "country": "Luxembourg",
        "form": "Société à responsabilité limitée (Holding de participations - Soparfi)",
        "share_capital": 15000.00,
        "share_capital_display": "15.000,00 € (15.000 parts de 1,00 €)",
        "shares_count": 15000,
        "share_par_value": 1.00,
        "rcs": "B 263.295",
        "matricule": "2021 2400 671",
        "tva": "LU 33694080",
        "nace": "64.202 - Sociétés de participation financière (Soparfi)",
        "constitution_date": "20/12/2021",
        "registration_date": "14/01/2022",
        "currency": "EUR (€)",
        "registered_office": "17, rue Beaumont, L-1219 Luxembourg",
        "gerance": "TUBIA Edoardo & VIGNOLLE Giorgio (Gérants)",
        "updated_at": "23/10/2026 15:30:00"
    },
    "subsidiary": {
        "name": "SOMBRA RESORT BRASIL SOCIEDADE UNIPESSOAL LTDA",
        "short_name": "Sombra Resort Brasil Ltda",
        "country": "Brésil",
        "cnpj": "43.730.206/0001-80",
        "jucern": "24200911503",
        "date_opening": "30/09/2021",
        "ownership_pct": 100.00,
        "capital_social_brl": 3000525.45,
        "capital_social_display": "R$ 3.000.525,45 (Capital Estrangeiro Totalmente Subscrito)",
        "address": "Avenida Engenheiro Roberto Freire, nº 1962, Loja 13, Condomínio Seaway Shopping, Bairro Capim Macio, Natal/RN, CEP 59.082-095",
        "resort_location": "Praia de Pipa, Tibau do Sul - RN, Brésil",
        "resort_name": "Sombra Resort Brasil (Condomínio)",
        "resort_villas_count": 10,
        "villas_attributed_holding": 9,
        "cnae_principal": "68.22-6-00 - Gestão e administração da propriedade imobiliária",
        "cnae_secondaires": "64.61-1-00 (Holdings), 64.63-8-00 (Participações), 68.10-2-01 (Compra e venda), 68.10-2-02 (Aluguel de imóveis próprios)",
        "sole_shareholder": "SOMBRA E AGUA FRESCA RESORT S.à r.l. (100%)",
        "administrator_brazil": "Ricardo Pimentel Portela de Moraes & Edoardo Tubia (Administradores não sócios com poderes isolados)",
        "administrators_list": ["Ricardo Pimentel Portela de Moraes", "Edoardo Tubia"],
        "partner_operator": "Hôtel Sombra e Água Fresca / Grupo Sombra",
        "bank_accounts_br": "Banco do Brasil - Agência 1066-9 (Goianinha), C/C 48649-3",
        "ativo_total_2025": 5298710.03,
        "ativo_total_2024": 5348180.83,
        "patrimonio_liquido_2025": 3967288.96,
        "patrimonio_liquido_2024": 4633908.26,
        "resultado_financeiro_2025": 135280.27
    },
    "bank_accounts": {
        "olky": {
            "id": "olky",
            "name": "Olky Pay",
            "institution": "Olky Payment Services S.A.",
            "type": "Compte Historique EUR (Clôturé 21/05/2026)",
            "iban": "LU66 6060 0020 0000 3953",
            "bic": "OLKI LUL1 XXX",
            "currency": "EUR",
            "balance_2024": 4229.46,
            "balance_2025": 10193.23,
            "balance_current": 0.00,
            "status": "Clôturé",
            "badge_color": "#64748b"
        },
        "revolut": {
            "id": "revolut",
            "name": "Revolut Business",
            "institution": "Revolut Bank UAB",
            "type": "Compte Opérationnel EUR (Actif)",
            "iban": "LT34 3250 0953 8055 9528",
            "bic": "REVO LT21",
            "currency": "EUR",
            "balance_2025": 0.00,
            "balance_current": 8508.43,
            "status": "Actif Principal",
            "badge_color": "#10b981"
        },
        "bb_brasil": {
            "id": "bb_brasil",
            "name": "Banco do Brasil",
            "institution": "Banco do Brasil S.A. (Ag. 1066-9 Goianinha)",
            "type": "Conta Corrente & Investimento R$",
            "iban": "C/C: 48649-3 • Agência 1066-9",
            "bic": "BRASBRRJRFN",
            "currency": "BRL",
            "balance_2024": 1600579.12,
            "balance_2025": 976766.78,
            "balance_current": 976766.78,
            "status": "Actif Filiale",
            "badge_color": "#f59e0b"
        }
    },
    "partners": partners_data,
    "villas": villas_data,
    "documents": documents_data,
    "transactions_olky": olkypay_txs,
    "transactions_revolut": revolut_txs,
    "transactions_bb": bb_cc_txs,
    "pcn_bilan_actif": [
        {
            "code": "C.III",
            "account": "2330010",
            "libelle": "Participations - Sombra Resort Brasil Sociedade Unipessoal Ltda",
            "val_2024": 1004968.24,
            "val_2025": 1004968.24,
            "val_2026": 1004968.24,
            "category": "Actif immobilisé / Immobilisations financières",
            "note": "100% du capital de la filiale brésilienne (R$ 3.000.525,45)"
        },
        {
            "code": "D.II.b",
            "account": "4228800",
            "libelle": "Autres créances diverses (> 1 an) - Avance Filiale Brésil",
            "val_2024": 130689.67,
            "val_2025": 120689.67,
            "val_2026": 120689.67,
            "category": "Actif circulant / Créances > 1 an",
            "note": "Prêt intercompany Sombra Resort Brasil (R$ 638.000 / 700.000)"
        },
        {
            "code": "D.IV",
            "account": "5131000",
            "libelle": "Avoirs en banques - Olky Pay Luxembourg",
            "val_2024": 4229.46,
            "val_2025": 10193.23,
            "val_2026": 0.00,
            "category": "Actif circulant / Trésorerie",
            "note": "Compte Olky Pay LU66 6060 0020 0000 3953"
        },
        {
            "code": "D.IV",
            "account": "5132000",
            "libelle": "Avoirs en banques - Revolut Business EUR",
            "val_2024": 0.00,
            "val_2025": 0.00,
            "val_2026": 8508.43,
            "category": "Actif circulant / Trésorerie",
            "note": "Compte Revolut Business LT34 3250 0953 8055 9528"
        }
    ],
    "pcn_bilan_passif": [
        {
            "code": "A.I",
            "account": "1010000",
            "libelle": "Capital souscrit (15.000 parts de 1,00 €)",
            "val_2024": 15000.00,
            "val_2025": 15000.00,
            "val_2026": 15000.00,
            "category": "Capitaux propres",
            "note": "Entièrement souscrit et libéré"
        },
        {
            "code": "A.IV",
            "account": "1381000",
            "libelle": "Autres réserves disponibles",
            "val_2024": 888.85,
            "val_2025": 888.85,
            "val_2026": 888.85,
            "category": "Capitaux propres",
            "note": "Réserve légale et statutaire"
        },
        {
            "code": "A.V",
            "account": "1412000",
            "libelle": "Résultats reportés (affectés)",
            "val_2024": -26215.34,
            "val_2025": -33256.74,
            "val_2026": -40298.14,
            "category": "Capitaux propres",
            "note": "Reports à nouveau cumulés des exercices précédents"
        },
        {
            "code": "A.VI",
            "account": "1420000",
            "libelle": "Résultat de l'exercice (Pertes)",
            "val_2024": -7041.40,
            "val_2025": -7061.23,
            "val_2026": -3500.00,
            "category": "Capitaux propres",
            "note": "Perte d'exploitation et impôt sur la fortune"
        },
        {
            "code": "C.a",
            "account": "4411200",
            "libelle": "Fournisseurs - Factures non parvenues (Fiduciaire)",
            "val_2024": 4655.00,
            "val_2025": 4680.00,
            "val_2026": 4680.00,
            "category": "Dettes <= 1 an",
            "note": "Honoraires comptables et fiscaux à payer"
        },
        {
            "code": "C.a",
            "account": "4712100",
            "libelle": "Dettes envers associés et actionnaires (Prêts d'associés)",
            "val_2024": 994910.59,
            "val_2025": 994910.59,
            "val_2026": 994910.59,
            "category": "Dettes <= 1 an",
            "note": "Comptes courants d'associés (ODC, LJ, VG, VGa, VM, RG, Li, TEn, TEd, TSi, HS, New Life, BM, CLW)"
        },
        {
            "code": "C.a",
            "account": "4718001",
            "libelle": "Autres dettes diverses - Edoardo Tubia",
            "val_2024": 27000.00,
            "val_2025": 30000.00,
            "val_2026": 30000.00,
            "category": "Dettes <= 1 an",
            "note": "Avance de fonds gérance"
        },
        {
            "code": "C.b",
            "account": "4728000",
            "libelle": "Autres dettes diverses (> 1 an)",
            "val_2024": 130689.67,
            "val_2025": 130689.67,
            "val_2026": 130689.67,
            "category": "Dettes > 1 an",
            "note": "Dettes financières à terme"
        }
    ],
    "pcn_pnl": [
        {
            "code": "6133300",
            "libelle": "Frais de comptes et commissions bancaires",
            "val_2024": -446.40,
            "val_2025": -376.83,
            "val_2026": -124.49,
            "category": "Frais bancaires"
        },
        {
            "code": "6134200",
            "libelle": "Honoraires comptables, fiscaux, d'audit et assimilés",
            "val_2024": -4640.00,
            "val_2025": -4705.00,
            "val_2026": -2320.00,
            "category": "Honoraires"
        },
        {
            "code": "6135000",
            "libelle": "Frais d'actes notariés et assimilés",
            "val_2024": 0.00,
            "val_2025": -24.40,
            "val_2026": 0.00,
            "category": "Frais légaux"
        },
        {
            "code": "6187000",
            "libelle": "Cotisations aux associations professionnelles (Chambre de Commerce)",
            "val_2024": -350.00,
            "val_2025": -350.00,
            "val_2026": -350.00,
            "category": "Cotisations"
        },
        {
            "code": "6811000",
            "libelle": "Impôt sur la Fortune (ACD - Soparfi)",
            "val_2024": -1605.00,
            "val_2025": -1605.00,
            "val_2026": -1605.00,
            "category": "Impôts"
        }
    ],
    "brazil_balanco": {
        "ativo_circulante_2025": 5278448.74,
        "ativo_circulante_2024": 5335550.12,
        "bb_investimentos_2025": 976766.78,
        "bb_investimentos_2024": 1591722.73,
        "outros_creditos_2025": 701156.51,
        "outros_creditos_2024": 134445.55,
        "passivo_intercompany_2025": 583947.11,
        "passivo_sombra_sarl_2025": 700000.00,
        "passivo_sombra_sarl_2024": 638000.00,
        "capital_social_brl": 3000525.45,
        "lucros_acumulados_2025": 966763.51,
        "lucros_acumulados_2024": 1633382.81,
        "patrimonio_liquido_2025": 3967288.96,
        "patrimonio_liquido_2024": 4633908.26
    }
}

content = "/**\n * SOMBRA_RESORT - Base de Données Centralisée\n * Société : SOMBRA E AGUA FRESCA RESORT S.à r.l. (Luxembourg, RCS B263295)\n * Filiale : SOMBRA RESORT BRASIL SOCIEDADE UNIPESSOAL LTDA (CNPJ 43.730.206/0001-80)\n */\n\nwindow.SOMBRA_RESORT_DATA = " + json.dumps(data_obj, indent=2, ensure_ascii=False) + ";\n"

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"data.js written successfully! Olky txs: {len(olkypay_txs)}, Revolut txs: {len(revolut_txs)}, BB txs: {len(bb_cc_txs)}")
