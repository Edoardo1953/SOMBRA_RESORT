# SOMBRA_RESORT — Plateforme de Gestion

Application web pour la société holding de participations luxembourgeoise **SOMBRA E AGUA FRESCA RESORT S.à r.l.** et sa filiale détenue à 100% au Brésil **SOMBRA RESORT BRASIL SOCIEDADE UNIPESSOAL LTDA**.

---

## 🏛️ Présentation de la Société Faîtière (Luxembourg)

- **Dénomination :** SOMBRA E AGUA FRESCA RESORT S.à r.l. (Marque : **SOMBRA RESORT**)
- **Forme :** Société à responsabilité limitée (Holding de participations - Soparfi)
- **Juridiction :** Luxembourg
- **Capital Social :** 15.000,00 € (entièrement souscrit et libéré, 15.000 parts de 1,00 €)
- **RCS Luxembourg :** B 263.295
- **Matricule Fiscal :** 2021 2400 671
- **Code NACE :** 64.202 (Sociétés de participation financière)
- **Date de Constitution :** 20/12/2021 (Immatriculation : 14/01/2022)
- **Siège Social :** 17, rue Beaumont, L-1219 Luxembourg
- **Gérance :** TUBIA Edoardo & VIGNOLLE Giorgio (Gérants)
- **Comptes Bancaires :**
  - **Olky Pay** (Luxembourg) : `LU66 6060 0020 0000 3953` (Historique clôturé le 21/05/2026)
  - **Revolut Business** (EUR) : `LT34 3250 0953 8055 9528` (Actif opérationnel)

---

## 🌴 Participation Étrangère Détenue à 100% (Brésil)

- **Filiale Détenue :** SOMBRA RESORT BRASIL SOCIEDADE UNIPESSOAL LTDA
- **CNPJ :** 43.730.206/0001-80
- **Junta Comercial (JUCERN) :** N° 24200911503 (30/09/2021)
- **Détention :** 100,00 % (Société Unipersonnelle détenue à 100% par la Sàrl luxembourgeoise)
- **Capital Subscrito Estrangeiro :** R$ 3.000.525,45
- **Administrateur au Brésil :** Edoardo Tubia
- **Actif d'Hospitality & Immobilier :** **Sombra Resort Brasil** (Praia de Pipa / Tibau do Sul, RN, Brésil)
  - 10 Villas résidentielles dont 9 villas attribuées aux actionnaires de la holding (Villas A à I).
  - Synergie et partenariat d'exploitation avec la prestigieuse *Pousada Sombra e Água Fresca*.
  - Compte opérationnel brésilien : **Banco do Brasil** (Ag. 1066-9 Goianinha, C/C 48649-3).
  - Ativo Total Balanço 2025 : R$ 5.298.710,03.

---

## 📊 Modules de l'Application

1. **La Société & Cap Table (`index.html`)**
   - Fiche d'identité juridique complète, gouvernance et immatriculations.
   - Cap Table interactive : double vue par associé (13 associés) et par villa (9 villas attribuées).
   - Donut charts Chart.js de la répartition du capital et des villas.
   - Modale plein écran de l'organigramme de détention internationale Luxembourg -> Brésil.

2. **Participation Sombra Resort Brasil (`partecipazioni.html`)**
   - Fiche détaillée de la filiale brésilienne, inscription à la Receita Federal.
   - Balanço Patrimonial & DRE 2024 vs 2025 comparatifs officiels signés.
   - Présentation du resort hôtelier et des villas à Praia de Pipa.

3. **Comptabilité PCN (`contabilita.html`)**
   - Bilan Actif (Classes 2 à 5) et Bilan Passif (Classes 1 à 4) selon le PCN Luxembourg.
   - Compte de Pertes & Profits abrégé (P&L) 2024 vs 2025 vs 2026 YTD.
   - Grand-Livre général des écritures.
   - Modale de Drilldown interactif par compte comptable (avec sous-comptes d'associés).
   - Export Excel instantané via SheetJS.

4. **Comptes Bancaires & Trésorerie (`banca.html`)**
   - Suivi multi-comptes Olky Pay, Revolut Business et Banco do Brasil.
   - Grand-livre complet de trésorerie avec filtres par banque, recherche en direct, et ajout de mouvements.
   - Export Excel du relevé de trésorerie.

5. **Amortissements & Immobilisations (`ammortamenti.html`)**
   - Suivi de la participation financière immobilisée (1.004.968,24 €).
   - Amortissement des frais de constitution et d'actes sur 5 exercices.

6. **Conformité AML / LBC-FT (`aml.html`)**
   - Registre KYC complet des 14 associés et bénéficiaires effectifs (UBO).
   - Simulateur interactif de score de risque selon la Loi du 12 novembre 2004 / CSSF / AED.
   - Fiches détaillées avec statut PEP, justificatifs d'identité et conformité RBE.

7. **Documents & Archives (`documenti.html`)**
   - Classement des actes notariés, extraits RCS/RBE, liasses fiscales, contrats brésiliens et balances.
   - Visionneuse PDF intégrée et téléchargement direct.
   - Module de téléversement sécurisé avec stockage IndexedDB.

8. **Sécurité & Contrôle d'Accès (`login.html` & `auth.js`)**
   - Gestion des rôles : Super Admin (TUBIA Edoardo), Fiduciaire Comptable, et Consultation Publique.
   - Système d'œil interactif vert/rouge pour piloter la visibilité des sections pour l'utilisateur standard.

---

## 🚀 Démarrage Rapide

Double-cliquer sur le fichier :
```
Avvia SOMBRA_RESORT.bat
```
Ou démarrer via Python :
```bash
python server.py
```
Puis ouvrir dans votre navigateur :
`http://localhost:8092/`
*(Port 8092 configuré pour fonctionner en parallèle avec l'autre application Watergarden sur 8089)*.
