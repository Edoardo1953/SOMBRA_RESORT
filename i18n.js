/**
 * SOMBRA_RESORT - Internationalisation (i18n)
 * Langues : Français (FR), Italien (IT), Portugais (PT), Anglais (EN)
 */

const SR_I18N = {
    fr: {
        nav_section_societe: "AREA SOCIÉTÉ",
        nav_societe: "La Société",
        nav_partecipazioni: "Participation Sombra (Brésil)",
        nav_section_finances: "AREA FINANCES",
        nav_contabilita: "Comptabilité PCN",
        nav_banca: "Comptes Bancaires",
        nav_ammortamenti: "Amortissements",
        nav_section_documentation: "AREA DOCUMENTATION",
        nav_aml: "Conformité AML / LBC-FT",
        nav_documenti: "Documents & Archives",
        nav_media: "Photos & Vidéos",
        last_update: "Mise à jour :",
        header_holding_subtitle: "Société Holding de Participations - Luxembourg",
        holding_tagline: "SOMBRA E AGUA FRESCA RESORT S.à r.l. • RCS Luxembourg B 263.295",
        btn_logout: "Déconnexion",
        btn_close: "Fermer",
        btn_save: "Enregistrer",
        btn_cancel: "Annuler",
        btn_download: "Télécharger",
        btn_download_excel: "Télécharger Excel",
        btn_view: "Consulter",
        btn_add: "Ajouter",
        btn_search: "Rechercher",
        btn_filter: "Filtrer",
        cap_table_title: "Registre des Associés & Cap Table",
        villas_title: "Attribution des 9 Villas Résidentielles",
        stats_capital: "Capital Social Souscrit",
        stats_shares: "Parts Sociales",
        stats_filiale: "Détention Filiale Brésil",
        stats_villas: "Villas Détenues",
        stats_actif: "Total Bilan Actif (PCN)",
        stats_tresorerie: "Trésorerie Disponible",
        tab_partners: "Vue par Associé (13 Associés)",
        tab_villas: "Vue par Villa (9 Villas)",
        tab_organigramme: "Organigramme Groupe",

        // Navigation sous-pages Participation Brésil
        part_subpage_title: "Sections Filiale Brésil :",
        part_tab_scheda: "1. Fiche Société & Banques (Banco do Brasil)",
        part_tab_bilancio: "2. Bilan (Balanço Patrimonial)",
        part_tab_dre: "3. Compte de Résultat (DRE)",

        // Cartes KPI Filiale Brésil
        part_kpi_capital_label: "Capital Souscrit Étranger",
        part_kpi_capital_sub: "Totalement souscrit par Sombra Sàrl Lux",
        part_kpi_ativo_label: "Actif Total (Bilan 2025)",
        part_kpi_ativo_sub: "Placements financiers R$ 976.766,78",
        part_kpi_pl_label: "Capitaux Propres 2025",
        part_kpi_pl_sub: "Capital + Bénéfices R$ 966.763,51",
        part_kpi_res_label: "Résultat Financier (DRE 2025)",
        part_kpi_res_sub: "Rendements bruts de placements",

        // Fiche d'Identité de la Filiale Brésilienne
        part_fiche_title: "Fiche d'Identité de la Filiale Brésilienne",
        part_fiche_nom: "Nom de l'Entreprise :",
        part_fiche_cnpj: "CNPJ Matrice :",
        part_fiche_junta: "Junta Comercial (JUCERN) :",
        part_fiche_nature: "Forme Juridique :",
        part_fiche_socio: "Associé Unique (100%) :",
        part_fiche_admin: "Administrateur au Brésil :",
        part_fiche_activite: "Activité Principale (CNAE) :",
        part_fiche_siege: "Siège Légal :",
        part_fiche_banque: "Compte Bancaire :",
        part_btn_cnpj: "Extrait CNPJ",
        part_btn_jucern: "Statuts JUCERN",
        part_btn_contrat_hotel: "Contrat Hôtel Sombra",

        // Resort Hospitality Profile
        part_resort_desc: "Le complexe <strong>Sombra Resort Brasil</strong> est situé à <strong>Praia de Pipa</strong> (Tibau do Sul), destination balnéaire et touristique de renommée internationale au Brésil.",
        part_resort_item1: "<strong style=\"color: var(--text-main);\">10 Villas de Prestige :</strong> 9 villas exclusives attribuées aux investisseurs de la holding luxembourgeoise.",
        part_resort_item2: "<strong style=\"color: var(--text-main);\">Partenariat Opérationnel :</strong> Synergie avec le renommé <em>Hôtel Sombra e Água Fresca</em> pour la conciergerie, maintenance et commercialisation hôtelière.",
        part_resort_item3: "<strong style=\"color: var(--text-main);\">Cadre Naturel :</strong> Intégration paysagère tropicale, à quelques pas de la mer, espaces détente et sécurité privée 24/7.",
        part_resort_callout: "<i class=\"fa-solid fa-shield-check\"></i> Actif foncier et immobilier entièrement consolidé sous la holding luxembourgeoise.",

        // Comptes Bancaires Filiale Brésil
        part_banks_title: "Comptes Bancaires au Brésil & Trésorerie (Banco do Brasil S.A.)",
        part_banks_subtitle: "Gestion bancaire de la filiale Sombra Resort Brasil Sociedade Unipessoal Ltda • Agência 1066-9 (Goianinha - RN)",
        part_banks_btn_excel: "Télécharger l'Excel Officiel (2 Comptes)",
        part_card_cc_badge: "COMPTE COURANT OPÉRATIONNEL",
        part_card_cc_label: "Solde Actuel Disponible",
        part_card_cc_note: "Encaissement des loyers Hôtel Sombra (JM Empreendimentos SCP 21.578 R$), honoraires et dépenses d'exploitation.",
        part_card_inv_badge: "COMPTE DE PLACEMENT & RÉSERVES",
        part_card_inv_sub: "Aplicação Financeira • Rendements DI",
        part_card_inv_label: "Solde Actuel Placements",
        part_card_inv_note: "<i class=\"fa-solid fa-arrow-trend-up\"></i> Rendements bruts de juros : <strong>+15.176 R$ à +17.203 R$ / mois</strong> (+141.245 R$ cumulés en 2026).",
        part_card_tot_badge: "TOTAL TRÉSORERIE BRÉSIL",
        part_card_tot_title: "Consolidé Banco do Brasil",
        part_card_tot_fx: "Taux de change indicatif : 1 EUR = 5,90 BRL",
        part_card_tot_label: "Total Actif Monétaire",
        part_card_tot_note: "Liquidité totale immédiatement mobilisable au crédit de la filiale brésilienne 100% détenue.",

        // Onglets banques et tableaux
        part_tab_btn_cc: "1. Conta Corrente (40.703,63 R$)",
        part_tab_btn_inv: "2. Compte de Placement (1.702.354,95 R$)",
        part_tab_btn_hist: "3. Évolution des Soldes (2021 - 2026)",
        part_cc_intro: "Dernières opérations du compte courant opérationnel (loyers perçus, honoraires, frais bancaires) :",
        part_th_date: "Date",
        part_th_num: "N°",
        part_th_desc: "Description de l'Opération",
        part_th_cat: "Catégorie",
        part_th_party: "Tiers / Contrepartie",
        part_th_amount: "Montant",
        part_th_balance: "Solde Progressif",
        part_hist_intro: "Synthèse de l'évolution des soldes bancaires de la filiale au 31 décembre de chaque exercice :",
        part_hist_col_period: "Période d'Arrêté",
        part_hist_col_inv: "Compte de Placement (Placements)",
        part_hist_col_tot: "Total Trésorerie R$",
        part_hist_col_eur: "Équivalent EUR",

        // Bannières liens bas de page
        part_banner_bp_badge: "Bilan Séparé",
        part_banner_bp_badge2: "Certifié 2024 vs 2025",
        part_banner_bp_title: "Balanço Patrimonial (Bilan Brésil)",
        part_banner_bp_desc: "Consultez la page dédiée du Bilan Patrimonial officiel (Actif Total R$ 5.298.710,03, Capitaux Propres R$ 3.967.288,96) avec l'arborescence détaillée de chaque poste et sous-compte.",
        part_banner_bp_btn: "Ouvrir la Page Bilan Brésil",
        part_banner_dre_badge: "Compte de Résultat Séparé",
        part_banner_dre_badge2: "P&L Certifié",
        part_banner_dre_title: "DRE - Demonstração do Resultado do Exercício",
        part_banner_dre_desc: "Consultez la page dédiée du Compte de Résultat (Rendements Banco do Brasil +R$ 135.280,27, Bénéfice Net Certifié DRE +R$ 137.310,45) avec le détail des factures et produits.",
        part_banner_dre_btn: "Ouvrir la Page DRE Brésil",

        // Contrôles Bilan et DRE
        ctrl_single_year: "Vue par Exercice Unique",
        ctrl_compare_years: "Comparaison sur Deux Exercices",
        ctrl_exam_year: "Exercice à examiner :",
        ctrl_compare_y1: "Comparer Année 1 :",
        ctrl_compare_y2: "avec Année 2 :",
        ctrl_expand_all: "Déployer tout",
        ctrl_collapse_all: "Réduire tout",
        btn_pdf_balanco: "Bilan Signé (PDF)",
        btn_pdf_dre: "DRE Signé (PDF)",

        // Fiche Juridique Holding (index.html)
        legal_card_title: "Fiche d'Identité Juridique",
        legal_denomination: "Dénomination :",
        legal_forme: "Forme Juridique :",
        legal_matricule: "Matricule National :",
        legal_constitution: "Date de Constitution :",
        legal_siege: "Siège Social :",
        legal_gerance: "Conseil de Gérance :",
        legal_btn_organigram: "Organigramme Détention Luxembourg / Brésil",
        legal_btn_rcs: "Voir Acte & RCS",
        filiale_card_title: "Filiale Détenue",
        filiale_badge_pct: "100% Détenue",
        filiale_card_desc: "Actif d'hospitality haut standing à <strong>Praia de Pipa</strong> (Tibau do Sul, RN). Capital souscrit par la holding : <strong>R$ 3.000.525,45</strong>. Complexe résidentiel comprenant 9 villas attribuées aux associés.",
        filiale_btn_view: "Consulter la Filiale Brésil",
        part_inv_intro: "Historique des rendements mensuels bruts, impôts retenus à la source (IRRF) et rachats de trésorerie :",
        part_th_mov_desc: "Description du Mouvement",
        part_th_nature: "Nature",
        part_th_detail: "Détail / Type",
        part_th_balance_inv: "Solde Placements",
        part_hist_close_2021: "Clôture Exercice 2021",
        part_hist_close_2022: "Clôture Exercice 2022",
        part_hist_close_2023: "Clôture Exercice 2023",
        part_hist_close_2024: "Clôture Exercice 2024",
        part_hist_close_2025: "Clôture Exercice 2025",
        part_hist_current_2026: "Situation Actuelle 2026 (Extrait Banco do Brasil)",
        part_header_subtitle: "Participation Étrangère Détenue à 100% • Natal / Praia de Pipa (RN, Brésil)",
        btn_security_access: "Sécurité & Accès",
        part_bilancio_page_title: "SOMBRA RESORT BRASIL - BILAN PATRIMONIAL",
        part_bilancio_subtitle: "Bilan Patrimonial Officiel et Certifié au 31/12/2024 et 31/12/2025 (Valeurs en Real R$)",
        part_dre_page_title: "SOMBRA RESORT BRASIL - COMPTE DE RÉSULTAT (DRE)",
        part_dre_subtitle: "Compte de Résultat Officiel (DRE) au 31/12/2024 et 31/12/2025 (Valeurs en Real R$)",
        part_kpi_ativo_total: "Actif Total",
        part_kpi_ativo_circ: "Actif Circulant",
        part_kpi_passivo_circ: "Passif Circulant",
        part_kpi_patrimonio_liq: "Capitaux Propres",
        part_dre_kpi_ricavi: "Total des Produits & Revenus",
        part_dre_kpi_costi: "Total des Coûts, Charges & Impôts",
        part_dre_kpi_fin: "Résultat Financier (BB RF)",
        part_dre_kpi_lucro: "Bénéfice Net de l'Exercice",
        opt_year_2025_cert: "2025 (Certifié)",
        opt_year_2024_cert: "2024 (Certifié)",
        tx_desc_rent: "Paiement contrat de bail",
        tx_desc_dom: "Domiciliation d'entreprise",
        part_hist_col_cc: "Compte Courant (C/C)",
    },

    it: {
        nav_section_societe: "AREA SOCIETÀ",
        nav_societe: "La Società",
        nav_partecipazioni: "Partecipazione Sombra (Brasile)",
        nav_section_finances: "AREA FINANZE",
        nav_contabilita: "Contabilità PCN",
        nav_banca: "Conti Bancari",
        nav_ammortamenti: "Ammortamenti",
        nav_section_documentation: "AREA DOCUMENTAZIONE",
        nav_aml: "Conformità AML / Antiriciclaggio",
        nav_documenti: "Documenti & Archivi",
        nav_media: "Foto & Video",
        last_update: "Ultimo aggiornamento :",
        header_holding_subtitle: "Società Holding di Partecipazioni - Lussemburgo",
        holding_tagline: "SOMBRA E AGUA FRESCA RESORT S.à r.l. • RCS Lussemburgo B 263.295",
        btn_logout: "Disconnetti",
        btn_close: "Chiudi",
        btn_save: "Salva",
        btn_cancel: "Annulla",
        btn_download: "Scarica",
        btn_download_excel: "Scarica Excel",
        btn_view: "Visualizza",
        btn_add: "Aggiungi",
        btn_search: "Cerca",
        btn_filter: "Filtra",
        cap_table_title: "Registro Soci & Cap Table",
        villas_title: "Assegnazione 9 Ville Residenziali",
        stats_capital: "Capitale Sociale Sottoscritto",
        stats_shares: "Quote Sociali",
        stats_filiale: "Quota Partecipazione Brasile",
        stats_villas: "Ville di Proprietà",
        stats_actif: "Totale Attivo Stato Patrimoniale",
        stats_tresorerie: "Liquidità Disponibile",
        tab_partners: "Vista per Socio (13 Soci)",
        tab_villas: "Vista per Villa (9 Ville)",
        tab_organigramme: "Organigramma Societario",

        // Navigation sotto-pagine Partecipata Brasile
        part_subpage_title: "Sezioni Partecipata:",
        part_tab_scheda: "1. Scheda Società & Banche (Banco do Brasil)",
        part_tab_bilancio: "2. Bilancio (Balanço Patrimonial)",
        part_tab_dre: "3. Perdite e Profitti (DRE)",

        // Card KPI Partecipata Brasile
        part_kpi_capital_label: "Capitale Sottoscritto Estero",
        part_kpi_capital_sub: "Interamente sottoscritto da Sombra Sàrl Lux",
        part_kpi_ativo_label: "Attivo Totale (Bilancio 2025)",
        part_kpi_ativo_sub: "Investimenti finanziari R$ 976.766,78",
        part_kpi_pl_label: "Patrimonio Netto 2025",
        part_kpi_pl_sub: "Capitale + Riserve Utili R$ 966.763,51",
        part_kpi_res_label: "Risultato Finanziario (DRE 2025)",
        part_kpi_res_sub: "Rendimenti lordi di investimenti",

        // Scheda Identificativa Filiale Brasiliana
        part_fiche_title: "Scheda Identificativa della Filiale Brasiliana",
        part_fiche_nom: "Ragione Sociale :",
        part_fiche_cnpj: "CNPJ Sede Matrice :",
        part_fiche_junta: "Camera di Commercio (JUCERN) :",
        part_fiche_nature: "Forma Giuridica :",
        part_fiche_socio: "Socio Unico (100%) :",
        part_fiche_admin: "Amministratore in Brasile :",
        part_fiche_activite: "Attività Principale (CNAE) :",
        part_fiche_siege: "Sede Legale :",
        part_fiche_banque: "Conto Bancario :",
        part_btn_cnpj: "Certificato CNPJ",
        part_btn_jucern: "Contratto JUCERN",
        part_btn_contrat_hotel: "Contratto Hotel Sombra",

        // Profilo Hospitality Resort
        part_resort_desc: "Il complesso <strong>Sombra Resort Brasil</strong> è situato a <strong>Praia de Pipa</strong> (Tibau do Sul), rinomata destinazione balneare e turistica internazionale in Brasile.",
        part_resort_item1: "<strong style=\"color: var(--text-main);\">10 Ville di Prestigio :</strong> 9 ville esclusive assegnate agli investitori della holding lussemburghese.",
        part_resort_item2: "<strong style=\"color: var(--text-main);\">Partnership Operativa :</strong> Sinergia con il rinomato <em>Hotel Sombra e Água Fresca</em> per portineria, manutenzione e commercializzazione alberghiera.",
        part_resort_item3: "<strong style=\"color: var(--text-main);\">Contesto Naturale :</strong> Integrazione paesaggistica tropicale, a pochi passi dal mare, aree relax e sicurezza privata 24/7.",
        part_resort_callout: "<i class=\"fa-solid fa-shield-check\"></i> Patrimonio fondiario e immobiliare interamente consolidato sotto la holding lussemburghese.",

        // Sezione Conti Bancari Brasile
        part_banks_title: "Conti Bancari in Brasile & Tesoreria (Banco do Brasil S.A.)",
        part_banks_subtitle: "Gestione bancaria della filiale Sombra Resort Brasil Sociedade Unipessoal Ltda • Agenzia 1066-9 (Goianinha - RN)",
        part_banks_btn_excel: "Scarica Excel Ufficiale (2 Conti)",
        part_card_cc_badge: "CONTO CORRENTE OPERATIVO",
        part_card_cc_label: "Saldo Attuale Disponibile",
        part_card_cc_note: "Incasso canoni Hotel Sombra (JM Empreendimentos SCP 21.578 R$), onorari e spese di gestione.",
        part_card_inv_badge: "CONTO INVESTIMENTO & RISERVE",
        part_card_inv_sub: "Investimento Finanziario • Rendimenti DI",
        part_card_inv_label: "Saldo Attuale Investimenti",
        part_card_inv_note: "<i class=\"fa-solid fa-arrow-trend-up\"></i> Rendimenti lordi di interessi: <strong>+15.176 R$ a +17.203 R$ / mese</strong> (+141.245 R$ cumulati nel 2026).",
        part_card_tot_badge: "TOTALE TESORERIA BRASILE",
        part_card_tot_title: "Consolidato Banco do Brasil",
        part_card_tot_fx: "Tasso di cambio indicativo: 1 EUR = 5,90 BRL",
        part_card_tot_label: "Totale Attivo Monetario",
        part_card_tot_note: "Liquidità totale immediatamente disponibile a credito della filiale brasiliana controllata al 100%.",

        // Tabella e schede movimenti
        part_tab_btn_cc: "1. Conta Corrente (40.703,63 R$)",
        part_tab_btn_inv: "2. Conto Investimento (1.702.354,95 R$)",
        part_tab_btn_hist: "3. Evoluzione dei Saldi (2021 - 2026)",
        part_cc_intro: "Ultime operazioni del conto corrente operativo (canoni incassati, onorari, spese bancarie):",
        part_th_date: "Data",
        part_th_num: "N°",
        part_th_desc: "Descrizione Operazione",
        part_th_cat: "Categoria",
        part_th_party: "Controparte / Beneficiario",
        part_th_amount: "Importo",
        part_th_balance: "Saldo Progressivo",
        part_hist_intro: "Sintesi dell'evoluzione dei saldi bancari della filiale al 31 dicembre di ciascun esercizio:",
        part_hist_col_period: "Periodo di Chiusura",
        part_hist_col_inv: "Conto Investimento (Placements)",
        part_hist_col_tot: "Totale Tesoreria R$",
        part_hist_col_eur: "Equivalente EUR",

        // Banner di collegamento
        part_banner_bp_badge: "Stato Patrimoniale Separato",
        part_banner_bp_badge2: "Certificato 2024 vs 2025",
        part_banner_bp_title: "Balanço Patrimonial (Bilancio Brasile)",
        part_banner_bp_desc: "Consulta la pagina dedicata del Bilancio Patrimoniale ufficiale (Ativo Total R$ 5.298.710,03, Patrimônio Líquido R$ 3.967.288,96) con l'apertura a tendina per ogni singola voce e sottoconto.",
        part_banner_bp_btn: "Apri Pagina Bilancio Brasile",
        part_banner_dre_badge: "Conto Economico Separato",
        part_banner_dre_badge2: "Perdite e Profitti Certificati",
        part_banner_dre_title: "DRE - Demonstração do Resultado do Exercício",
        part_banner_dre_desc: "Consulta la pagina dedicata di Perdite e Profitti (Rendimenti Banco do Brasil +R$ 135.280,27, Utile Netto Certificato DRE +R$ 137.310,45) con l'apertura a tendina delle singole fatture e proventi.",
        part_banner_dre_btn: "Apri Pagina Perdite e Profitti Brasile",

        // Controlli Bilancio e DRE
        ctrl_single_year: "Vista per Anno Singolo",
        ctrl_compare_years: "Confronto tra Due Anni",
        ctrl_exam_year: "Esercizio da esaminare :",
        ctrl_compare_y1: "Confronta Anno 1 :",
        ctrl_compare_y2: "con Anno 2 :",
        ctrl_expand_all: "Espandi tutto",
        ctrl_collapse_all: "Riduci tutto",
        btn_pdf_balanco: "Balanço Asseverato (PDF)",
        btn_pdf_dre: "DRE Asseverato (PDF)",

        // Scheda Holding (index.html)
        legal_card_title: "Scheda Giuridica Societaria",
        legal_denomination: "Denominazione :",
        legal_forme: "Forma Giuridica :",
        legal_matricule: "Matricola Nazionale :",
        legal_constitution: "Data di Costituzione :",
        legal_siege: "Sede Legale :",
        legal_gerance: "Consiglio di Gestione :",
        legal_btn_organigram: "Organigramma Partecipazioni Lussemburgo / Brasile",
        legal_btn_rcs: "Vedi Atto Costitutivo & RCS",
        filiale_card_title: "Filiale Controllata",
        filiale_badge_pct: "100% Controllata",
        filiale_card_desc: "Asset di hospitality di alto livello a <strong>Praia de Pipa</strong> (Tibau do Sul, RN). Capitale sottoscritto dalla holding: <strong>R$ 3.000.525,45</strong>. Complesso residenziale composto da 9 ville assegnate ai soci.",
        filiale_btn_view: "Visualizza Filiale Brasile",
        part_inv_intro: "Storico dei rendimenti mensili lordi, imposte trattenute alla fonte (IRRF) e riscatti di liquidità:",
        part_th_mov_desc: "Descrizione del Movimento",
        part_th_nature: "Natura",
        part_th_detail: "Dettaglio / Tipo",
        part_th_balance_inv: "Saldo Investimenti",
        part_hist_close_2021: "Chiusura Esercizio 2021",
        part_hist_close_2022: "Chiusura Esercizio 2022",
        part_hist_close_2023: "Chiusura Esercizio 2023",
        part_hist_close_2024: "Chiusura Esercizio 2024",
        part_hist_close_2025: "Chiusura Esercizio 2025",
        part_hist_current_2026: "Situazione Attuale 2026 (Estratto Banco do Brasil)",
        part_header_subtitle: "Partecipazione Estera Detenuta al 100% • Natal / Praia de Pipa (RN, Brasile)",
        btn_security_access: "Sicurezza & Accessi",
        part_bilancio_page_title: "SOMBRA RESORT BRASIL - STATO PATRIMONIALE",
        part_bilancio_subtitle: "Stato Patrimoniale Ufficiale e Certificato al 31/12/2024 e 31/12/2025 (Valori in Real R$)",
        part_dre_page_title: "SOMBRA RESORT BRASIL - CONTO ECONOMICO (DRE)",
        part_dre_subtitle: "Conto Economico Ufficiale (DRE) al 31/12/2024 e 31/12/2025 (Valori in Real R$)",
        part_kpi_ativo_total: "Attivo Totale",
        part_kpi_ativo_circ: "Attivo Circolante",
        part_kpi_passivo_circ: "Passivo Circolante",
        part_kpi_patrimonio_liq: "Patrimonio Netto",
        part_dre_kpi_ricavi: "Totale Ricavi & Proventi",
        part_dre_kpi_costi: "Totale Costi, Oneri & Imposte",
        part_dre_kpi_fin: "Risultato Finanziario (BB RF)",
        part_dre_kpi_lucro: "Utile Netto d'Esercizio",
        opt_year_2025_cert: "2025 (Certificato)",
        opt_year_2024_cert: "2024 (Certificato)",
        tx_desc_rent: "Pagamento contratto affitto",
        tx_desc_dom: "Domiciliazione societaria",
        part_hist_col_cc: "Conto Corrente (C/C)",
    },

    pt: {
        nav_section_societe: "ÁREA SOCIEDADE",
        nav_societe: "A Sociedade",
        nav_partecipazioni: "Participação Sombra (Brasil)",
        nav_section_finances: "ÁREA FINANÇAS",
        nav_contabilita: "Contabilidade PCN",
        nav_banca: "Contas Bancárias",
        nav_ammortamenti: "Amortizações",
        nav_section_documentation: "ÁREA DOCUMENTAÇÃO",
        nav_aml: "Conformidade PLD / AML",
        nav_documenti: "Documentos & Arquivos",
        nav_media: "Fotos & Vídeos",
        last_update: "Última atualização :",
        header_holding_subtitle: "Sociedade Holding de Participações - Luxemburgo",
        holding_tagline: "SOMBRA E AGUA FRESCA RESORT S.à r.l. • RCS Luxemburgo B 263.295",
        btn_logout: "Sair",
        btn_close: "Fechar",
        btn_save: "Salvar",
        btn_cancel: "Cancelar",
        btn_download: "Baixar",
        btn_download_excel: "Baixar Excel",
        btn_view: "Visualizar",
        btn_add: "Adicionar",
        btn_search: "Pesquisar",
        btn_filter: "Filtrar",
        cap_table_title: "Quadro de Sócios & Cap Table",
        villas_title: "Atribuição das 9 Vilas Residenciais",
        stats_capital: "Capital Social Subscrito",
        stats_shares: "Quotas Sociais",
        stats_filiale: "Participação Filial Brasil",
        stats_villas: "Vilas sob Gestão",
        stats_actif: "Ativo Total Balanço (PCN)",
        stats_tresorerie: "Tesouraria Disponível",
        tab_partners: "Visão por Sócio (13 Sócios)",
        tab_villas: "Visão por Vila (9 Vilas)",
        tab_organigramme: "Organograma Societário",

        // Navegação das subpáginas da filial brasileira
        part_subpage_title: "Seções da Filial Brasil:",
        part_tab_scheda: "1. Ficha da Empresa & Bancos (Banco do Brasil)",
        part_tab_bilancio: "2. Balanço Patrimonial",
        part_tab_dre: "3. Demonstração do Resultado (DRE)",

        // Cartões KPI Filial Brasil
        part_kpi_capital_label: "Capital Subscrito Estrangeiro",
        part_kpi_capital_sub: "Totalmente subscrito por Sombra Sàrl Lux",
        part_kpi_ativo_label: "Ativo Total (Balanço 2025)",
        part_kpi_ativo_sub: "Aplicações financeiras R$ 976.766,78",
        part_kpi_pl_label: "Patrimônio Líquido 2025",
        part_kpi_pl_sub: "Capital + Lucros Acumulados R$ 966.763,51",
        part_kpi_res_label: "Resultado Financeiro (DRE 2025)",
        part_kpi_res_sub: "Rendimentos brutos de aplicações",

        // Ficha Cadastral da Filial Brasileira
        part_fiche_title: "Ficha Cadastral da Filial Brasileira",
        part_fiche_nom: "Razão Social :",
        part_fiche_cnpj: "CNPJ Matriz :",
        part_fiche_junta: "Junta Comercial (JUCERN) :",
        part_fiche_nature: "Natureza Jurídica :",
        part_fiche_socio: "Sócio Único (100%) :",
        part_fiche_admin: "Administrador no Brasil :",
        part_fiche_activite: "Atividade Principal (CNAE) :",
        part_fiche_siege: "Sede Social :",
        part_fiche_banque: "Conta Bancária :",
        part_btn_cnpj: "Cartão CNPJ",
        part_btn_jucern: "Contrato JUCERN",
        part_btn_contrat_hotel: "Contrato Hotel Sombra",

        // Perfil de Hospitalidade do Resort
        part_resort_desc: "O complexo <strong>Sombra Resort Brasil</strong> está localizado na <strong>Praia de Pipa</strong> (Tibau do Sul), destino turístico e litorâneo de renome internacional no Brasil.",
        part_resort_item1: "<strong style=\"color: var(--text-main);\">10 Vilas de Prestígio :</strong> 9 vilas exclusivas atribuídas aos investidores da holding de Luxemburgo.",
        part_resort_item2: "<strong style=\"color: var(--text-main);\">Parceria Operacional :</strong> Sinergia com o renomado <em>Hotel Sombra e Água Fresca</em> para serviços de concierge, manutenção e comercialização hoteleira.",
        part_resort_item3: "<strong style=\"color: var(--text-main);\">Ambiente Natural :</strong> Integração paisagística tropical, a poucos passos do mar, áreas de lazer e segurança privada 24/7.",
        part_resort_callout: "<i class=\"fa-solid fa-shield-check\"></i> Ativo fundiário e imobiliário integralmente consolidado sob a holding de Luxemburgo.",

        // Contas Bancárias no Brasil & Tesouraria
        part_banks_title: "Contas Bancárias no Brasil & Tesouraria (Banco do Brasil S.A.)",
        part_banks_subtitle: "Gestão bancária da filial Sombra Resort Brasil Sociedade Unipessoal Ltda • Agência 1066-9 (Goianinha - RN)",
        part_banks_btn_excel: "Baixar Excel Oficial (2 Contas)",
        part_card_cc_badge: "CONTA CORRENTE OPERACIONAL",
        part_card_cc_label: "Saldo Atual Disponível",
        part_card_cc_note: "Recebimento dos aluguéis Hotel Sombra (JM Empreendimentos SCP 21.578 R$), honorários e despesas operacionais.",
        part_card_inv_badge: "CONTA DE APLICAÇÃO & RESERVAS",
        part_card_inv_sub: "Aplicação Financeira • Rendimentos DI",
        part_card_inv_label: "Saldo Atual em Aplicações",
        part_card_inv_note: "<i class=\"fa-solid fa-arrow-trend-up\"></i> Rendimentos brutos de juros: <strong>+15.176 R$ a +17.203 R$ / mês</strong> (+141.245 R$ acumulados em 2026).",
        part_card_tot_badge: "TOTAL TESOURARIA BRASIL",
        part_card_tot_title: "Consolidado Banco do Brasil",
        part_card_tot_fx: "Câmbio indicativo: 1 EUR = 5,90 BRL",
        part_card_tot_label: "Total Ativo Monetário",
        part_card_tot_note: "Liquidez total imediatamente disponível da filial brasileira 100% detida.",

        // Guias bancárias e extrato
        part_tab_btn_cc: "1. Conta Corrente (40.703,63 R$)",
        part_tab_btn_inv: "2. Conta de Aplicação (1.702.354,95 R$)",
        part_tab_btn_hist: "3. Evolução dos Saldos (2021 - 2026)",
        part_cc_intro: "Últimas operações da conta corrente operacional (aluguéis recebidos, honorários, despesas bancárias):",
        part_th_date: "Data",
        part_th_num: "Nº",
        part_th_desc: "Descrição da Operação",
        part_th_cat: "Categoria",
        part_th_party: "Favorecido / Contraparte",
        part_th_amount: "Valor",
        part_th_balance: "Saldo Acumulado",
        part_hist_intro: "Síntese da evolução dos saldos bancários da filial em 31 de dezembro de cada exercício:",
        part_hist_col_period: "Período de Fechamento",
        part_hist_col_inv: "Conta de Aplicação (Investimentos)",
        part_hist_col_tot: "Total Tesouraria R$",
        part_hist_col_eur: "Equivalente EUR",

        // Banners de links no rodapé
        part_banner_bp_badge: "Balanço Patrimonial Separado",
        part_banner_bp_badge2: "Certificado 2024 vs 2025",
        part_banner_bp_title: "Balanço Patrimonial (Filial Brasil)",
        part_banner_bp_desc: "Consulte a página dedicada do Balanço Patrimonial oficial (Ativo Total R$ 5.298.710,03, Patrimônio Líquido R$ 3.967.288,96) com detalhamento analítico para cada conta e subconta.",
        part_banner_bp_btn: "Acessar Balanço Patrimonial Brasil",
        part_banner_dre_badge: "Demonstração do Resultado (DRE)",
        part_banner_dre_badge2: "Lucros e Perdas Certificados",
        part_banner_dre_title: "DRE - Demonstração do Resultado do Exercício",
        part_banner_dre_desc: "Consulte a página dedicada de Demonstração do Resultado (Rendimentos Banco do Brasil +R$ 135.280,27, Lucro Líquido Certificado DRE +R$ 137.310,45) com abertura detalhada de receitas e custos.",
        part_banner_dre_btn: "Acessar DRE / Resultados Brasil",

        // Controles de Exercício Balanço e DRE
        ctrl_single_year: "Visão por Exercício Individual",
        ctrl_compare_years: "Comparativo entre Dois Exercícios",
        ctrl_exam_year: "Exercício em exame :",
        ctrl_compare_y1: "Comparar Ano 1 :",
        ctrl_compare_y2: "com Ano 2 :",
        ctrl_expand_all: "Expandir tudo",
        ctrl_collapse_all: "Recolher tudo",
        btn_pdf_balanco: "Balanço Assinado (PDF)",
        btn_pdf_dre: "DRE Assinado (PDF)",

        // Ficha Holding (index.html)
        legal_card_title: "Ficha Cadastral da Sociedade",
        legal_denomination: "Razão Social :",
        legal_forme: "Forma Jurídica :",
        legal_matricule: "Matrícula Nacional :",
        legal_constitution: "Data de Constituição :",
        legal_siege: "Sede Social :",
        legal_gerance: "Conselho de Administração :",
        legal_btn_organigram: "Organograma Participações Luxemburgo / Brasil",
        legal_btn_rcs: "Ver Contrato Social & RCS",
        filiale_card_title: "Filial Controlada",
        filiale_badge_pct: "100% Controlada",
        filiale_card_desc: "Ativo hoteleiro e imobiliário de alto padrão na <strong>Praia de Pipa</strong> (Tibau do Sul, RN). Capital subscrito pela holding: <strong>R$ 3.000.525,45</strong>. Complexo residencial composto por 9 vilas atribuídas aos sócios.",
        filiale_btn_view: "Acessar Filial Brasil",
        part_inv_intro: "Histórico de rendimentos mensais brutos, impostos retidos na fonte (IRRF) e resgates de tesouraria:",
        part_th_mov_desc: "Descrição da Movimentação",
        part_th_nature: "Natureza",
        part_th_detail: "Detalhe / Tipo",
        part_th_balance_inv: "Saldo em Aplicações",
        part_hist_close_2021: "Fechamento Exercício 2021",
        part_hist_close_2022: "Fechamento Exercício 2022",
        part_hist_close_2023: "Fechamento Exercício 2023",
        part_hist_close_2024: "Fechamento Exercício 2024",
        part_hist_close_2025: "Fechamento Exercício 2025",
        part_hist_current_2026: "Posição Atual 2026 (Extrato Banco do Brasil)",
        part_header_subtitle: "Participação Estrangeira Detida a 100% • Natal / Praia de Pipa (RN, Brasil)",
        btn_security_access: "Segurança & Acessos",
        part_bilancio_page_title: "SOMBRA RESORT BRASIL - BALANÇO PATRIMONIAL",
        part_bilancio_subtitle: "Balanço Patrimonial Oficial e Certificado em 31/12/2024 e 31/12/2025 (Valores em Reais R$)",
        part_dre_page_title: "SOMBRA RESORT BRASIL - DEMONSTRAÇÃO DO RESULTADO (DRE)",
        part_dre_subtitle: "Demonstração do Resultado do Exercício em 31/12/2024 e 31/12/2025 (Valores em Reais R$)",
        part_kpi_ativo_total: "Ativo Total",
        part_kpi_ativo_circ: "Ativo Circulante",
        part_kpi_passivo_circ: "Passivo Circulante",
        part_kpi_patrimonio_liq: "Patrimônio Líquido",
        part_dre_kpi_ricavi: "Total de Receitas & Rendimentos",
        part_dre_kpi_costi: "Total de Custos, Despesas & Tributos",
        part_dre_kpi_fin: "Resultado Financeiro (BB RF)",
        part_dre_kpi_lucro: "Lucro Líquido do Exercício",
        opt_year_2025_cert: "2025 (Certificado)",
        opt_year_2024_cert: "2024 (Certificado)",
        tx_desc_rent: "Pagamento de contrato de locação",
        tx_desc_dom: "Domiciliação societária",
        part_hist_col_cc: "Conta Corrente (C/C)",
    },

    en: {
        nav_section_societe: "COMPANY AREA",
        nav_societe: "The Company",
        nav_partecipazioni: "Participation Sombra (Brazil)",
        nav_section_finances: "FINANCE AREA",
        nav_contabilita: "PCN Accounting",
        nav_banca: "Bank Accounts",
        nav_ammortamenti: "Depreciation",
        nav_section_documentation: "DOCUMENTATION AREA",
        nav_aml: "AML Compliance",
        nav_documenti: "Documents & Archives",
        nav_media: "Photos & Videos",
        last_update: "Last updated :",
        header_holding_subtitle: "Investment Holding Company - Luxembourg",
        holding_tagline: "SOMBRA E AGUA FRESCA RESORT S.à r.l. • RCS Luxembourg B 263.295",
        btn_logout: "Logout",
        btn_close: "Close",
        btn_save: "Save",
        btn_cancel: "Cancel",
        btn_download: "Download",
        btn_download_excel: "Download Excel",
        btn_view: "View",
        btn_add: "Add",
        btn_search: "Search",
        btn_filter: "Filter",
        cap_table_title: "Shareholders Registry & Cap Table",
        villas_title: "Allocation of the 9 Residential Villas",
        stats_capital: "Subscribed Share Capital",
        stats_shares: "Shares Issued",
        stats_filiale: "Brazil Subsidiary Stake",
        stats_villas: "Owned Villas",
        stats_actif: "Total Balance Sheet Assets",
        stats_tresorerie: "Available Cash",
        tab_partners: "Shareholder View (13 Shareholders)",
        tab_villas: "Villa View (9 Villas)",
        tab_organigramme: "Corporate Organigram",

        // Navigation Subpage Tabs Brazil
        part_subpage_title: "Brazil Subsidiary Sections:",
        part_tab_scheda: "1. Company Profile & Banks (Banco do Brasil)",
        part_tab_bilancio: "2. Balance Sheet (Balanço Patrimonial)",
        part_tab_dre: "3. Income Statement / P&L (DRE)",

        // KPI Cards Brazil
        part_kpi_capital_label: "Foreign Subscribed Capital",
        part_kpi_capital_sub: "Fully subscribed by Sombra Sàrl Lux",
        part_kpi_ativo_label: "Total Assets (2025 Balance Sheet)",
        part_kpi_ativo_sub: "Financial investments R$ 976,766.78",
        part_kpi_pl_label: "Net Equity 2025",
        part_kpi_pl_sub: "Capital + Retained Earnings R$ 966,763.51",
        part_kpi_res_label: "Financial Result (DRE 2025)",
        part_kpi_res_sub: "Gross investment returns",

        // Corporate Profile Brazil
        part_fiche_title: "Corporate Profile of the Brazilian Subsidiary",
        part_fiche_nom: "Company Name :",
        part_fiche_cnpj: "Headquarters CNPJ :",
        part_fiche_junta: "Board of Trade (JUCERN) :",
        part_fiche_nature: "Legal Nature :",
        part_fiche_socio: "Sole Shareholder (100%) :",
        part_fiche_admin: "Administrator in Brazil :",
        part_fiche_activite: "Main Activity (CNAE) :",
        part_fiche_siege: "Registered Office :",
        part_fiche_banque: "Bank Account :",
        part_btn_cnpj: "CNPJ Certificate",
        part_btn_jucern: "JUCERN Articles",
        part_btn_contrat_hotel: "Hotel Sombra Agreement",

        // Resort Hospitality Profile
        part_resort_desc: "The <strong>Sombra Resort Brasil</strong> complex is located in <strong>Praia de Pipa</strong> (Tibau do Sul), an internationally renowned seaside tourist destination in Brazil.",
        part_resort_item1: "<strong style=\"color: var(--text-main);\">10 Prestige Villas:</strong> 9 exclusive villas allocated to investors of the Luxembourg holding company.",
        part_resort_item2: "<strong style=\"color: var(--text-main);\">Operational Partnership:</strong> Synergy with the renowned <em>Hotel Sombra e Água Fresca</em> for concierge, maintenance, and hospitality operations.",
        part_resort_item3: "<strong style=\"color: var(--text-main);\">Natural Environment:</strong> Tropical landscape integration, steps away from the beach, relaxation areas, and 24/7 private security.",
        part_resort_callout: "<i class=\"fa-solid fa-shield-check\"></i> Land and real estate assets fully consolidated under the Luxembourg holding company.",

        // Bank Accounts in Brazil & Treasury
        part_banks_title: "Bank Accounts in Brazil & Treasury (Banco do Brasil S.A.)",
        part_banks_subtitle: "Banking management of subsidiary Sombra Resort Brasil Sociedade Unipessoal Ltda • Branch 1066-9 (Goianinha - RN)",
        part_banks_btn_excel: "Download Official Excel (2 Accounts)",
        part_card_cc_badge: "OPERATING CHECKING ACCOUNT",
        part_card_cc_label: "Current Available Balance",
        part_card_cc_note: "Collection of Hotel Sombra rentals (JM Empreendimentos SCP 21,578 R$), professional fees and operating expenses.",
        part_card_inv_badge: "INVESTMENT & RESERVE ACCOUNT",
        part_card_inv_sub: "Financial Application • DI Yields",
        part_card_inv_label: "Current Investment Balance",
        part_card_inv_note: "<i class=\"fa-solid fa-arrow-trend-up\"></i> Gross interest returns: <strong>+15,176 R$ to +17,203 R$ / month</strong> (+141,245 R$ cumulative in 2026).",
        part_card_tot_badge: "TOTAL BRAZIL TREASURY",
        part_card_tot_title: "Banco do Brasil Consolidated",
        part_card_tot_fx: "Indicative exchange rate: 1 EUR = 5.90 BRL",
        part_card_tot_label: "Total Monetary Assets",
        part_card_tot_note: "Total liquid funds immediately available to the credit of the 100% owned Brazilian subsidiary.",

        // Ledger Tabs and Tables
        part_tab_btn_cc: "1. Checking Account (40,703.63 R$)",
        part_tab_btn_inv: "2. Investment Account (1,702,354.95 R$)",
        part_tab_btn_hist: "3. Balance History (2021 - 2026)",
        part_cc_intro: "Recent transactions on operating checking account (rentals collected, professional fees, bank expenses):",
        part_th_date: "Date",
        part_th_num: "No.",
        part_th_desc: "Transaction Description",
        part_th_cat: "Category",
        part_th_party: "Counterparty / Payee",
        part_th_amount: "Amount",
        part_th_balance: "Running Balance",
        part_hist_intro: "Summary of subsidiary bank balance evolution as of December 31 of each fiscal year:",
        part_hist_col_period: "Reporting Period",
        part_hist_col_inv: "Investment Account (Placements)",
        part_hist_col_tot: "Total Treasury R$",
        part_hist_col_eur: "EUR Equivalent",

        // Bottom Banners
        part_banner_bp_badge: "Separate Balance Sheet",
        part_banner_bp_badge2: "Certified 2024 vs 2025",
        part_banner_bp_title: "Balanço Patrimonial (Brazil Balance Sheet)",
        part_banner_bp_desc: "Access the dedicated official Balance Sheet page (Total Assets R$ 5,298,710.03, Net Equity R$ 3,967,288.96) with collapsible details for every ledger entry and sub-account.",
        part_banner_bp_btn: "Open Brazil Balance Sheet Page",
        part_banner_dre_badge: "Separate Income Statement",
        part_banner_dre_badge2: "Certified P&L",
        part_banner_dre_title: "DRE - Demonstração do Resultado do Exercício",
        part_banner_dre_desc: "Access the dedicated P&L / Income Statement page (Banco do Brasil Returns +R$ 135,280.27, Certified Net Profit +R$ 137,310.45) with collapsible details for revenues and expenses.",
        part_banner_dre_btn: "Open Brazil P&L Page",

        // Controls
        ctrl_single_year: "Single Year View",
        ctrl_compare_years: "Two-Year Comparison",
        ctrl_exam_year: "Fiscal year to examine :",
        ctrl_compare_y1: "Compare Year 1 :",
        ctrl_compare_y2: "with Year 2 :",
        ctrl_expand_all: "Expand all",
        ctrl_collapse_all: "Collapse all",
        btn_pdf_balanco: "Signed Balance Sheet (PDF)",
        btn_pdf_dre: "Signed DRE (PDF)",

        // Holding Card (index.html)
        legal_card_title: "Corporate Legal Profile",
        legal_denomination: "Company Name :",
        legal_forme: "Legal Form :",
        legal_matricule: "National Registration :",
        legal_constitution: "Date of Incorporation :",
        legal_siege: "Registered Office :",
        legal_gerance: "Board of Managers :",
        legal_btn_organigram: "Ownership Structure Luxembourg / Brazil",
        legal_btn_rcs: "View Articles & RCS",
        filiale_card_title: "Subsidiary Owned",
        filiale_badge_pct: "100% Owned",
        filiale_card_desc: "High-end hospitality asset in <strong>Praia de Pipa</strong> (Tibau do Sul, RN). Capital subscribed by holding: <strong>R$ 3,000,525.45</strong>. Residential complex comprising 9 villas allocated to partners.",
        filiale_btn_view: "View Brazil Subsidiary",
        part_inv_intro: "History of gross monthly yields, withholding taxes (IRRF), and cash redemptions:",
        part_th_mov_desc: "Transaction Description",
        part_th_nature: "Nature",
        part_th_detail: "Detail / Type",
        part_th_balance_inv: "Investment Balance",
        part_hist_close_2021: "Year-End 2021",
        part_hist_close_2022: "Year-End 2022",
        part_hist_close_2023: "Year-End 2023",
        part_hist_close_2024: "Year-End 2024",
        part_hist_close_2025: "Year-End 2025",
        part_hist_current_2026: "Current Position 2026 (Banco do Brasil Statement)",
        part_header_subtitle: "Foreign Subsidiary 100% Owned • Natal / Praia de Pipa (RN, Brazil)",
        btn_security_access: "Security & Access",
        part_bilancio_page_title: "SOMBRA RESORT BRASIL - BALANCE SHEET",
        part_bilancio_subtitle: "Official & Certified Balance Sheet as of 31/12/2024 and 31/12/2025 (Values in Brazilian Reais R$)",
        part_dre_page_title: "SOMBRA RESORT BRASIL - INCOME STATEMENT (DRE)",
        part_dre_subtitle: "Official Income Statement (DRE) as of 31/12/2024 and 31/12/2025 (Values in Brazilian Reais R$)",
        part_kpi_ativo_total: "Total Assets",
        part_kpi_ativo_circ: "Current Assets",
        part_kpi_passivo_circ: "Current Liabilities",
        part_kpi_patrimonio_liq: "Equity / Net Worth",
        part_dre_kpi_ricavi: "Total Revenues & Income",
        part_dre_kpi_costi: "Total Costs, Expenses & Taxes",
        part_dre_kpi_fin: "Financial Result (BB RF)",
        part_dre_kpi_lucro: "Net Profit for the Year",
        opt_year_2025_cert: "2025 (Certified)",
        opt_year_2024_cert: "2024 (Certified)",
        tx_desc_rent: "Lease contract payment",
        tx_desc_dom: "Corporate domiciliation",
        part_hist_col_cc: "Checking Account (C/C)",
    }
};

let currentLanguage = (function() {
    try {
        const saved = localStorage.getItem('sr_lang');
        if (saved && SR_I18N[saved]) return saved;
    } catch(e) {}
    try {
        const path = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : '';
        if (path.indexOf('brasil') !== -1 || path.indexOf('partecipazioni') !== -1) {
            return 'pt';
        }
    } catch(e) {}
    return 'fr';
})();

function setLanguage(lang) {
    if (!SR_I18N[lang]) lang = 'fr';
    currentLanguage = lang;
    try {
        localStorage.setItem('sr_lang', lang);
    } catch(e) {}
    applyTranslations();
    updateLanguageButtons();
    try {
        window.dispatchEvent(new CustomEvent('sr:languageChanged', { detail: { lang } }));
    } catch(e) {}
}

function applyTranslations() {
    const dict = SR_I18N[currentLanguage] || SR_I18N.fr;
    if (!dict) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
            if (el.getAttribute('data-i18n-html') === 'true' || dict[key].indexOf('<') !== -1) {
                el.innerHTML = dict[key];
            } else {
                el.innerText = dict[key];
            }
        }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (dict[key] !== undefined) {
            el.setAttribute('title', dict[key]);
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key] !== undefined) {
            el.setAttribute('placeholder', dict[key]);
        }
    });
}

function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function initI18n() {
    applyTranslations();
    updateLanguageButtons();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}

// Global exports
window.SR_I18N = SR_I18N;
window.setLanguage = setLanguage;
window.applyTranslations = applyTranslations;
window.updateLanguageButtons = updateLanguageButtons;
