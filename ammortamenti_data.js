/**
 * SOMBRA_RESORT - Immobilisations Financières & Amortissements
 * Société : SOMBRA E AGUA FRESCA RESORT S.à r.l. (Luxembourg, RCS B263295)
 */

window.SOMBRA_RESORT_AMORT = {
  "assets": [
    {
      "id": "AST-PART-01",
      "category_code": "2330010",
      "category_name": "233 - IMMOBILISATIONS FINANCIÈRES",
      "subcategory": "2330010 - Participations - Sombra Resort Brasil Ltda",
      "name": "Participation de Contrôle 100% Sombra Resort Brasil Sociedade Unipessoal Ltda",
      "supplier": "Junta Comercial do Estado do Rio Grande do Norte (JUCERN)",
      "invoice_ref": "CNPJ 43.730.206/0001-80 • JUCERN 24200911503",
      "acquisition_date": "2021-09-30",
      "end_date": "Indéterminée",
      "initial_value": 1004968.24,
      "vat_amount": 0.0,
      "total_value": 1004968.24,
      "method": "Test de Dépréciation Annuel (Impairment - Non Amortissable)",
      "duration_years": 0,
      "annual_rate": 0.0,
      "status": "Actif Clé (Non Déprécié)",
      "note": "Représente l'intégralité du capital de la filiale brésilienne détenant les actifs hôteliers à Praia de Pipa (Ativo Total R$ 5.298.710,03 au 31/12/2025)",
      "schedule": [
        { "year": 2021, "val_debut": 1004968.24, "annuite": 0.0, "cumul": 0.0, "vnc": 1004968.24 },
        { "year": 2022, "val_debut": 1004968.24, "annuite": 0.0, "cumul": 0.0, "vnc": 1004968.24 },
        { "year": 2023, "val_debut": 1004968.24, "annuite": 0.0, "cumul": 0.0, "vnc": 1004968.24 },
        { "year": 2024, "val_debut": 1004968.24, "annuite": 0.0, "cumul": 0.0, "vnc": 1004968.24 },
        { "year": 2025, "val_debut": 1004968.24, "annuite": 0.0, "cumul": 0.0, "vnc": 1004968.24 },
        { "year": 2026, "val_debut": 1004968.24, "annuite": 0.0, "cumul": 0.0, "vnc": 1004968.24 }
      ]
    },
    {
      "id": "AST-FRAIS-01",
      "category_code": "203",
      "category_name": "203 - FRAIS DE CONSTITUTION ET DE TRANSFERT",
      "subcategory": "203000 - Frais d'Établissement & Actes Notariés",
      "name": "Étude Notariale - Transfert du Siège & Refonte Statutaire 2021",
      "supplier": "Notaire à Luxembourg",
      "invoice_ref": "Acte N° 2021-12-20",
      "acquisition_date": "2021-12-20",
      "end_date": "2026-12-19",
      "initial_value": 3500.00,
      "vat_amount": 595.00,
      "total_value": 4095.00,
      "method": "Linéaire (PCN 20% l'an)",
      "duration_years": 5,
      "annual_rate": 20.0,
      "status": "En cours d'amortissement (Dernière année)",
      "note": "Amortissement fiscal linéaire sur 5 exercices conformes à la loi comptable luxembourgeoise",
      "schedule": [
        { "year": 2021, "val_debut": 3500.00, "annuite": 100.00, "cumul": 100.00, "vnc": 3400.00 },
        { "year": 2022, "val_debut": 3400.00, "annuite": 700.00, "cumul": 800.00, "vnc": 2700.00 },
        { "year": 2023, "val_debut": 2700.00, "annuite": 700.00, "cumul": 1500.00, "vnc": 2000.00 },
        { "year": 2024, "val_debut": 2000.00, "annuite": 700.00, "cumul": 2200.00, "vnc": 1300.00 },
        { "year": 2025, "val_debut": 1300.00, "annuite": 700.00, "cumul": 2900.00, "vnc": 600.00 },
        { "year": 2026, "val_debut": 600.00, "annuite": 600.00, "cumul": 3500.00, "vnc": 0.00 }
      ]
    }
  ],
  "brazil_assets_summary": [
    {
      "name": "Imobilizado & Infraestrutura Resort Pipa",
      "val_brl": 3200000.00,
      "deprec_rate": "4% l'an (Edificações)",
      "status": "Exploité par la filiale brésilienne"
    },
    {
      "name": "Mobiliário, Equipamentos & Climatisation Villas",
      "val_brl": 450000.00,
      "deprec_rate": "10% l'an (Móveis e Utensílios)",
      "status": "En service"
    }
  ]
};
