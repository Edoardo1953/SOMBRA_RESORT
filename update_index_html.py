with open('index.html', 'w', encoding='utf-8') as f:
    f.write('''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SOMBRA RESORT Sàrl - Holding de Participations</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Stylesheet -->
    <link rel="stylesheet" href="style.css?v=20261023d">
    <!-- Auth Guard -->
    <script src="auth.js?v=20261023"></script>
    <link rel="shortcut icon" href="brand_assets/favicon.ico?v=palma" type="image/x-icon">
    <link rel="apple-touch-icon" href="brand_assets/apple-touch-icon.png?v=palma">
</head>
<body>
    <div class="app-container">
        <!-- Sidebar Navigation -->
        <aside class="sidebar glass-panel">
            <div class="logo-container">
                <a href="index.html" style="text-decoration: none; display: flex; flex-direction: column; align-items: center;">
                    <img src="brand_assets/sombra_resort_symbol_cropped.png?v=palma" alt="Logo Sombra Resort" class="logo-img" style="border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.4); width: 68px; height: 68px;">
                    <div class="logo-title" style="letter-spacing: 2px; margin-top: 8px;">SOMBRA RESORT</div>
                    <div class="logo-subtitle">Holding Sàrl • Lux</div>
                </a>
            </div>

            <nav class="nav-menu">
                <!-- AREA SOCIÉTÉ -->
                <div class="nav-section-title" data-i18n="nav_section_societe">AREA SOCIÉTÉ</div>
                <div class="nav-item-container" data-page="index.html">
                    <a href="index.html" class="nav-item active">
                        <i class="fa-solid fa-chart-pie text-emerald"></i>
                        <span data-i18n="nav_societe">La Société</span>
                    </a>
                    <button type="button" class="nav-eye-toggle-btn nav-eye-active" title="Visible Utilisateur" onclick="togglePageVisibility('index.html', event)">
                        <i class="fa-solid fa-eye" style="color: #10b981;"></i>
                    </button>
                </div>
                <div class="nav-item-container" data-page="partecipazioni.html">
                    <a href="partecipazioni.html" class="nav-item">
                        <i class="fa-solid fa-umbrella-beach text-amber"></i>
                        <span data-i18n="nav_partecipazioni">Participation Sombra (Brésil)</span>
                    </a>
                    <button type="button" class="nav-eye-toggle-btn nav-eye-active" title="Visible Utilisateur" onclick="togglePageVisibility('partecipazioni.html', event)">
                        <i class="fa-solid fa-eye" style="color: #10b981;"></i>
                    </button>
                </div>

                <!-- AREA FINANCES -->
                <div class="nav-section-title" data-i18n="nav_section_finances">AREA FINANCES</div>
                <div class="nav-item-container" data-page="contabilita.html">
                    <a href="contabilita.html" class="nav-item">
                        <i class="fa-solid fa-book-bookmark text-blue"></i>
                        <span data-i18n="nav_contabilita">Comptabilité PCN</span>
                    </a>
                    <button type="button" class="nav-eye-toggle-btn nav-eye-active" title="Visible Utilisateur" onclick="togglePageVisibility('contabilita.html', event)">
                        <i class="fa-solid fa-eye" style="color: #10b981;"></i>
                    </button>
                </div>
                <div class="nav-item-container" data-page="banca.html">
                    <a href="banca.html" class="nav-item">
                        <i class="fa-solid fa-building-columns text-cyan"></i>
                        <span data-i18n="nav_banca">Comptes Bancaires</span>
                    </a>
                    <button type="button" class="nav-eye-toggle-btn nav-eye-active" title="Visible Utilisateur" onclick="togglePageVisibility('banca.html', event)">
                        <i class="fa-solid fa-eye" style="color: #10b981;"></i>
                    </button>
                </div>
                <div class="nav-item-container" data-page="ammortamenti.html">
                    <a href="ammortamenti.html" class="nav-item">
                        <i class="fa-solid fa-calculator text-emerald"></i>
                        <span data-i18n="nav_ammortamenti">Amortissements</span>
                    </a>
                    <button type="button" class="nav-eye-toggle-btn nav-eye-active" title="Visible Utilisateur" onclick="togglePageVisibility('ammortamenti.html', event)">
                        <i class="fa-solid fa-eye" style="color: #10b981;"></i>
                    </button>
                </div>

                <!-- AREA DOCUMENTATION -->
                <div class="nav-section-title" data-i18n="nav_section_documentation">AREA DOCUMENTATION</div>
                <div class="nav-item-container" data-page="aml.html">
                    <a href="aml.html" class="nav-item">
                        <i class="fa-solid fa-shield-halved text-emerald"></i>
                        <span data-i18n="nav_aml">Conformité AML</span>
                    </a>
                    <button type="button" class="nav-eye-toggle-btn nav-eye-active" title="Visible Utilisateur" onclick="togglePageVisibility('aml.html', event)">
                        <i class="fa-solid fa-eye" style="color: #10b981;"></i>
                    </button>
                </div>
                <div class="nav-item-container" data-page="documenti.html">
                    <a href="documenti.html" class="nav-item">
                        <i class="fa-solid fa-folder-open text-amber"></i>
                        <span data-i18n="nav_documenti">Documents & Archives</span>
                    </a>
                    <button type="button" class="nav-eye-toggle-btn nav-eye-active" title="Visible Utilisateur" onclick="togglePageVisibility('documenti.html', event)">
                        <i class="fa-solid fa-eye" style="color: #10b981;"></i>
                    </button>
                </div>
            </nav>

            <div class="sidebar-footer">
                <div class="footer-meta">
                    <span data-i18n="last_update">Mise à jour :</span>
                    <strong id="sidebar-updated-at">23/10/2026</strong>
                </div>
                <button class="btn btn-secondary btn-block" style="margin-top: 10px;" onclick="openUsersModal()">
                    <i class="fa-solid fa-users-gear"></i> Sécurité & Accès
                </button>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="main-content">
            <!-- Header Topbar -->
            <header class="topbar glass-panel">
                <div class="topbar-left">
                    <button id="sidebar-toggle-btn" class="sidebar-toggle-btn" title="Menu (Échap)">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                    <div class="page-title-box">
                        <div class="page-subtitle" data-i18n="header_holding_subtitle">Société Holding de Participations - Luxembourg</div>
                        <h1 class="page-title">SOMBRA E AGUA FRESCA RESORT S.à r.l.</h1>
                    </div>
                </div>

                <div class="topbar-right">
                    <!-- Improved Flag Language Selector -->
                    <div class="lang-selector">
                        <button class="lang-btn active" data-lang="fr" onclick="setLanguage('fr')" title="Français">
                            <img src="https://flagcdn.com/w40/fr.png" alt="FR">
                        </button>
                        <button class="lang-btn" data-lang="it" onclick="setLanguage('it')" title="Italiano">
                            <img src="https://flagcdn.com/w40/it.png" alt="IT">
                        </button>
                        <button class="lang-btn" data-lang="pt" onclick="setLanguage('pt')" title="Português">
                            <img src="https://flagcdn.com/w40/br.png" alt="PT">
                        </button>
                        <button class="lang-btn" data-lang="en" onclick="setLanguage('en')" title="English">
                            <img src="https://flagcdn.com/w40/gb.png" alt="EN">
                        </button>
                    </div>

                    <!-- Improved Light / Dark Theme Button -->
                    <button class="theme-toggle-btn" id="theme-toggle-btn" onclick="toggleTheme()" title="Basculer Mode Clair/Sombre">
                        <i class="fa-solid fa-moon"></i>
                    </button>

                    <!-- User status -->
                    <div id="header-user-display" class="user-badge" style="cursor: pointer;" onclick="openUsersModal()"></div>

                    <!-- Logout -->
                    <button class="btn btn-secondary btn-sm" onclick="logoutUser()">
                        <i class="fa-solid fa-power-off text-rose"></i>
                    </button>
                </div>
            </header>

            <!-- KPI Dashboard Summary Cards -->
            <div class="kpi-grid">
                <div class="kpi-card glass-panel">
                    <div class="kpi-icon-wrap bg-emerald-glow">
                        <i class="fa-solid fa-landmark text-emerald"></i>
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-label" data-i18n="stats_capital">Capital Social Souscrit</div>
                        <div class="kpi-value text-emerald">15.000,00 €</div>
                        <div class="kpi-sub">15.000 parts de 1,00 € • 100% Libéré</div>
                    </div>
                </div>

                <div class="kpi-card glass-panel">
                    <div class="kpi-icon-wrap bg-blue-glow">
                        <i class="fa-solid fa-hotel text-cyan"></i>
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-label" data-i18n="stats_villas">Villas Détenues (Attribuées)</div>
                        <div class="kpi-value text-cyan">9 Villas</div>
                        <div class="kpi-sub">Villas A à I • Sombra Resort Brasil</div>
                    </div>
                </div>

                <div class="kpi-card glass-panel">
                    <div class="kpi-icon-wrap bg-amber-glow">
                        <i class="fa-solid fa-building-flag text-amber"></i>
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-label" data-i18n="stats_filiale">Participation Filiale Brésil</div>
                        <div class="kpi-value text-amber">100,00 %</div>
                        <div class="kpi-sub">Sombra Resort Brasil Ltda • R$ 3,00M</div>
                    </div>
                </div>

                <div class="kpi-card glass-panel">
                    <div class="kpi-icon-wrap bg-purple-glow">
                        <i class="fa-solid fa-file-invoice-dollar text-emerald"></i>
                    </div>
                    <div class="kpi-content">
                        <div class="kpi-label" data-i18n="stats_actif">Total Actif du Bilan PCN</div>
                        <div class="kpi-value text-emerald">1.135.851,14 €</div>
                        <div class="kpi-sub">Immob. financières 1.004.968,24 €</div>
                    </div>
                </div>
            </div>

            <!-- MAIN SECTION: Side by Side Cap Table (Left) and Charts (Right) -->
            <div class="societe-main-grid">
                <!-- LEFT COLUMN: Cap Table -->
                <div class="glass-panel" style="padding: 1.25rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
                        <div>
                            <h2 style="font-size: 1.15rem; color: var(--text-main);" data-i18n="cap_table_title">Registre des Associés & Cap Table</h2>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">15.000 parts sociales (15.000 €) • 9 villas attribuées</div>
                        </div>

                        <div style="display: flex; gap: 6px;">
                            <button id="tab-btn-partners" class="btn btn-secondary active" style="padding: 0.35rem 0.65rem; font-size: 12px;" onclick="switchCapTableView('partners')">
                                <i class="fa-solid fa-user-group"></i> Associés (13)
                            </button>
                            <button id="tab-btn-villas" class="btn btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 12px;" onclick="switchCapTableView('villas')">
                                <i class="fa-solid fa-hotel"></i> Villas (9)
                            </button>
                        </div>
                    </div>

                    <!-- Table View: Partners (Tight layout without wasted space) -->
                    <div id="partners-table-container" class="table-responsive">
                        <table class="data-table table-tight">
                            <thead>
                                <tr>
                                    <th style="width: 30px;" class="text-center">#</th>
                                    <th>Associé / Entité</th>
                                    <th class="text-center" style="width: 95px;">Villa</th>
                                    <th class="text-right" style="width: 70px;">Parts</th>
                                    <th class="text-right" style="width: 75px;">Détention</th>
                                    <th class="text-right" style="width: 80px;">Valeur</th>
                                    <th class="text-center" style="width: 75px;">KYC</th>
                                </tr>
                            </thead>
                            <tbody id="partners-table-body"></tbody>
                            <tfoot id="partners-table-total"></tfoot>
                        </table>
                    </div>

                    <!-- Table View: Villas -->
                    <div id="villas-table-container" class="table-responsive" style="display: none;">
                        <table class="data-table table-tight">
                            <thead>
                                <tr>
                                    <th style="width: 80px;" class="text-center">Villa</th>
                                    <th>Propriétaire(s) Associé(s)</th>
                                    <th class="text-right" style="width: 90px;">Parts Total</th>
                                    <th class="text-right" style="width: 85px;">% Capital</th>
                                    <th class="text-center" style="width: 80px;">Statut</th>
                                </tr>
                            </thead>
                            <tbody id="villas-table-body"></tbody>
                        </table>
                    </div>
                </div>

                <!-- RIGHT COLUMN: The Two Donut Charts Stacked -->
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <!-- Donut Chart 1: Par Associé -->
                    <div class="glass-panel" style="padding: 1.15rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <h3 style="font-size: 0.95rem; color: var(--text-main); font-weight: 700;">
                                <i class="fa-solid fa-chart-pie text-emerald"></i> Répartition par Associé
                            </h3>
                            <span class="badge badge-emerald" style="font-size: 10px;">13 Associés</span>
                        </div>
                        <div style="position: relative; height: 260px;">
                            <canvas id="capTableDonutChart"></canvas>
                        </div>
                    </div>

                    <!-- Donut Chart 2: Par Villa -->
                    <div class="glass-panel" style="padding: 1.15rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <h3 style="font-size: 0.95rem; color: var(--text-main); font-weight: 700;">
                                <i class="fa-solid fa-house-chimney text-cyan"></i> Répartition des 9 Villas
                            </h3>
                            <span class="badge badge-blue" style="font-size: 10px;">9 Villas Attribuées</span>
                        </div>
                        <div style="position: relative; height: 260px;">
                            <canvas id="villasDonutChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- LOWER SECTION: Fiche d'Identité Juridique & Filiale Détenue (Moved below the table & charts) -->
            <div style="display: grid; grid-template-columns: 1.55fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                <!-- Fiche d'Identité Juridique -->
                <div class="glass-panel" style="padding: 1.5rem;">
                    <div class="section-header" style="margin-bottom: 1rem;">
                        <h2 style="font-size: 1.15rem; color: var(--text-main);"><i class="fa-solid fa-id-card text-emerald"></i> Fiche d'Identité Juridique</h2>
                        <span class="badge badge-emerald">SOPARFI LUXEMBOURG</span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
                        <div><strong style="color: var(--text-muted);">Dénomination :</strong> <span style="font-weight: 600; color: var(--text-main);">SOMBRA E AGUA FRESCA RESORT S.à r.l.</span></div>
                        <div><strong style="color: var(--text-muted);">Forme Juridique :</strong> <span>Société à responsabilité limitée</span></div>
                        <div><strong style="color: var(--text-muted);">RCS Luxembourg :</strong> <span class="badge badge-blue">B 263.295</span></div>
                        <div><strong style="color: var(--text-muted);">Matricule National :</strong> <span>2021 2400 671</span></div>
                        <div><strong style="color: var(--text-muted);">Date de Constitution :</strong> <span>20/12/2021 (Immat. 14/01/2022)</span></div>
                        <div><strong style="color: var(--text-muted);">Code NACE :</strong> <span>64.202 - Soparfi</span></div>
                        <div style="grid-column: span 2;"><strong style="color: var(--text-muted);">Siège Social :</strong> <span>17, rue Beaumont, L-1219 Luxembourg</span></div>
                        <div style="grid-column: span 2;"><strong style="color: var(--text-muted);">Conseil de Gérance :</strong> <span style="color: #34d399; font-weight: 600;">TUBIA Edoardo</span> & <span style="color: #38bdf8; font-weight: 600;">VIGNOLLE Giorgio</span> (Gérants)</div>
                    </div>

                    <div style="margin-top: 1.25rem; display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn btn-secondary" onclick="openSchemaSocietarioModal()">
                            <i class="fa-solid fa-sitemap text-emerald"></i> Organigramme Détention Luxembourg / Brésil
                        </button>
                        <a href="documenti.html" class="btn btn-secondary">
                            <i class="fa-solid fa-file-lines text-cyan"></i> Voir Acte & RCS
                        </a>
                    </div>
                </div>

                <!-- Filiale Détenue -->
                <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div class="section-header" style="margin-bottom: 0.75rem;">
                            <h2 style="font-size: 1.15rem; color: var(--text-main);"><i class="fa-solid fa-building-circle-check text-amber"></i> Filiale Détenue</h2>
                            <span class="badge badge-amber">100% Détenue</span>
                        </div>
                        <div style="font-weight: 700; color: #fbbf24; font-size: 14px; margin-bottom: 4px;">SOMBRA RESORT BRASIL LTDA</div>
                        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">CNPJ : 43.730.206/0001-80 • JUCERN 24200911503</div>
                        <div style="font-size: 12.5px; line-height: 1.6; color: var(--text-main);">
                            Actif d'hospitality haut standing à <strong>Praia de Pipa</strong> (Tibau do Sul, RN). 
                            Capital souscrit par la holding : <strong>R$ 3.000.525,45</strong>. 
                            Complexe résidentiel comprenant 9 villas attribuées aux associés.
                        </div>
                    </div>
                    <div style="margin-top: 1rem;">
                        <a href="partecipazioni.html" class="btn btn-primary btn-block">
                            <i class="fa-solid fa-arrow-right"></i> Consulter la Filiale Brésil
                        </a>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Modal: Corporate Organigramme Full Screen -->
    <div id="schemaSocietarioModal" class="modal-backdrop" style="display: none;">
        <div class="modal-card glass-panel" style="max-width: 900px; width: 95%;">
            <div class="modal-header">
                <h3><i class="fa-solid fa-sitemap text-emerald"></i> Schéma Corporatif & Détention Internationale</h3>
                <button class="btn-icon" onclick="closeSchemaSocietarioModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="modal-body" style="padding: 1.5rem; text-align: center;">
                <div style="background: rgba(16, 185, 129, 0.1); border: 2px solid #10b981; border-radius: 12px; padding: 1.25rem; display: inline-block; min-width: 380px;">
                    <div style="font-size: 11px; color: #34d399; font-weight: 700;">HOLDING LUXEMBOURGEOISE (SOPARFI)</div>
                    <div style="font-size: 16px; font-weight: 800; color: #fff; margin: 4px 0;">SOMBRA E AGUA FRESCA RESORT S.à r.l.</div>
                    <div style="font-size: 12px; color: #94a3b8;">RCS Luxembourg B 263.295 • Capital : 15.000,00 €</div>
                    <div style="font-size: 11px; color: #38bdf8; margin-top: 4px;">13 Associés • 9 Villas Résidentielles Détenues</div>
                </div>

                <div style="font-size: 26px; color: #fbbf24; margin: 12px 0;">
                    <i class="fa-solid fa-arrow-down"></i>
                    <div style="font-size: 12px; font-weight: 700; color: #fbbf24;">DÉTENTION DIRECTE 100,00 %</div>
                </div>

                <div style="background: rgba(245, 158, 11, 0.1); border: 2px solid #f59e0b; border-radius: 12px; padding: 1.25rem; display: inline-block; min-width: 380px;">
                    <div style="font-size: 11px; color: #fbbf24; font-weight: 700;">FILIALE OPÉRATIONNELLE (BRÉSIL)</div>
                    <div style="font-size: 16px; font-weight: 800; color: #fff; margin: 4px 0;">SOMBRA RESORT BRASIL SOCIEDADE UNIPESSOAL LTDA</div>
                    <div style="font-size: 12px; color: #94a3b8;">CNPJ : 43.730.206/0001-80 • JUCERN 24200911503</div>
                    <div style="font-size: 12px; color: #34d399; margin-top: 4px;">Capital Subscrito Estrangeiro : R$ 3.000.525,45</div>
                </div>

                <div style="margin-top: 2rem; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 1rem; text-align: left; font-size: 12.5px; color: #94a3b8;">
                    <strong><i class="fa-solid fa-circle-info text-cyan"></i> Notes de gouvernance :</strong>
                    <ul style="margin-top: 6px; padding-left: 1.25rem; line-height: 1.6;">
                        <li>La société luxembourgeoise Sombra e Agua Fresca Resort Sàrl détient 100% des quotas de la société brésilienne.</li>
                        <li>Les 15.000 parts du capital luxembourgeois confèrent un droit d'usage et une attribution exclusive sur les 9 villas du resort.</li>
                        <li>Gérance conjointe assurée par Edoardo Tubia et Giorgio Vignolle.</li>
                    </ul>
                </div>
            </div>
            <div class="modal-footer" style="padding: 1rem 1.5rem; text-align: right; border-top: 1px solid var(--border-color);">
                <button class="btn btn-secondary" onclick="closeSchemaSocietarioModal()">Fermer</button>
            </div>
        </div>
    </div>

    <!-- Core Scripts -->
    <script src="data.js?v=20261023"></script>
    <script src="i18n.js?v=20261023"></script>
    <script src="app.js?v=20261023"></script>
</body>
</html>
''')
print("index.html rewritten successfully!")
