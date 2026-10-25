/**
 * brasil_finances.js
 * SOMBRA RESORT BRASIL SOCIEDADE UNIPESSOAL LTDA (CNPJ 43.730.206/0001-80)
 * Gestione dinamica:
 * - Scelta dell'anno singolo da esaminare (2024, 2025)
 * - Confronto dinamico tra due anni (2024 vs 2025, o viceversa)
 * - Accordion tendina per ciascuna voce e sottoconto analitico
 */

let brFinMode = 'compare'; // 'single' oppure 'compare'
let brSingleYear = '2025';
let brCompareY1 = '2024';
let brCompareY2 = '2025';

function formatBRL(val) {
    if (val === null || val === undefined || isNaN(val)) return "R$ 0,00";
    const num = Number(val);
    const sign = num < 0 ? "- R$ " : (num > 0 ? "R$ " : "R$ ");
    const absNum = Math.abs(num);
    const parts = absNum.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return sign + parts.join(",");
}

function formatBRLSigned(val) {
    if (val === null || val === undefined || isNaN(val)) return "R$ 0,00";
    const num = Number(val);
    const sign = num > 0 ? "+ R$ " : (num < 0 ? "- R$ " : "R$ ");
    const absNum = Math.abs(num);
    const parts = absNum.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return sign + parts.join(",");
}

function formatBRLPercent(v1, v2) {
    if (!v1 || v1 === 0) return "-";
    const diff = v2 - v1;
    const pct = (diff / Math.abs(v1)) * 100;
    const sign = pct > 0 ? "+" : "";
    return `${sign}${pct.toFixed(1).replace('.', ',')}%`;
}

// ============================================================
// BASE DATI: BALANÇO PATRIMONIAL (STATO PATRIMONIALE)
// ============================================================
const BR_BALANCO_DATA = [
    {
        id: "disp",
        category: "ativo_circ",
        code: "1.1.1",
        name: "Ativo Circulante - Disponibilidades (Cassa e Banche)",
        desc: "Banco do Brasil C/C e Fondo Investimento Renda Fixa",
        vals: { "2024": 1600579.12, "2025": 976766.78 },
        details: [
            { code: "1.1.1.01.002", name: "Banco do Brasil S.A. - C/C 48649-3", nature: "Conto Corrente ordinario (Ag. 1066-9 Tibau do Sul)", vals: { "2024": 8856.39, "2025": 0.00 }, note: "Saldo tesoreria operativa; liquidità concentrata su fondo remunerato" },
            { code: "1.1.1.02.001", name: "BB Renda Fixa Simples LP", nature: "Fondo d'Investimento Monetario a Breve Termine", vals: { "2024": 1591722.73, "2025": 976766.78 }, note: "Liquidità aziendale remunerata a rendimento CDI garantito" }
        ]
    },
    {
        id: "cred",
        category: "ativo_circ",
        code: "1.1.2",
        name: "Ativo Circulante - Outros Créditos & Adiantamentos",
        desc: "Anticipi fornitori, Crediti fiscali RFB & Dividendi SCP a ricevere",
        vals: { "2024": 134445.55, "2025": 701156.51 },
        details: [
            { code: "1.1.2.05.001", name: "Adiantamentos a Fornecedores", nature: "Yapay Pagamentos (R$ 6.764,79) & Palaoro (R$ 6.573,20 em 2024)", vals: { "2024": 13337.99, "2025": 6764.79 }, note: "Acconti versati per servizi tecnologici e piattaforme di pagamento" },
            { code: "1.1.2.06.002", name: "Impostos a Compensar (IRRF / IRPJ)", nature: "Crediti tributari verso Receita Federal do Brasil (RFB)", vals: { "2024": 56373.52, "2025": 36557.38 }, note: "Ritenute fiscali subite sui rendimenti BB da compensare con future imposte" },
            { code: "1.1.2.08.001", name: "Dividendos e Lucros a Receber SCP", nature: "J.M. Empreendimentos Imobiliários SCP", vals: { "2024": 64734.04, "2025": 657834.34 }, note: "Utili e proventi maturati dalla partecipazione nella SCP immobiliare da incassare" }
        ]
    },
    {
        id: "est",
        category: "ativo_circ",
        code: "1.1.3",
        name: "Ativo Circulante - Estoques & Ativos Imobiliários",
        desc: "Terreno Praia do Amor e Complesso Case/Villas Sombra Resort",
        vals: { "2024": 3600525.45, "2025": 3600525.45 },
        details: [
            { code: "1.1.3.01.001", name: "Terreno Urbano Praia do Amor", nature: "Lotto 1.044,81 m² - Praia de Pipa / Tibau do Sul (RN)", vals: { "2024": 600000.00, "2025": 600000.00 }, note: "Valore d'acquisto e registrazione notarile al Catasto di Tibau do Sul" },
            { code: "1.1.3.02.001", name: "Empreendimento 09 Casas/Villas Sombra Resort", nature: "Complesso Residenziale Turistico Sombra Resort Brasil", vals: { "2024": 3000525.45, "2025": 3000525.45 }, note: "Valore storico di conferimento di capitale e sviluppo edilizio del villaggio" }
        ]
    },
    {
        id: "anc",
        category: "ativo_nc",
        code: "1.2",
        name: "Ativo Não Circulante - Investimentos & Imobilizzato",
        desc: "Partecipazione SCP J.M. Empreendimenti & Mobili",
        vals: { "2024": 12630.71, "2025": 20261.29 },
        details: [
            { code: "1.2.1.01.001", name: "Participação Societária J.M. Empreendimentos SCP", nature: "Quota di partecipazione societaria", vals: { "2024": 6000.00, "2025": 6000.00 }, note: "Quota sociale nominale detenuta quale socio partecipante (sócio participante)" },
            { code: "1.2.1.02.001", name: "Equivalência Patrimonial SCP", nature: "Rivalutazione a Patrimonio Netto quota SCP", vals: { "2024": 0.00, "2025": 14261.29 }, note: "Incremento del patrimonio netto pro quota di spettanza maturato nella SCP" },
            { code: "1.2.2.01.001", name: "Móveis e Utensílios de Escritório", nature: "Cespiti materiali e dotazioni sede", vals: { "2024": 6630.71, "2025": 0.00 }, note: "Completamente ammortizzati al 31/12/2025 (fondo ammortamento al 100%)" }
        ]
    },
    {
        id: "forn",
        category: "passivo_circ",
        code: "2.1.1",
        name: "Passivo Circulante - Fornecedores & Imposte da Versare",
        desc: "Debiti commerciali a breve termine e imposte correnti/differite",
        vals: { "2024": 76272.57, "2025": 47473.96 },
        details: [
            { code: "2.1.1.01.001", name: "Fornecedores Nacionais de Bens e Serviços", nature: "Fornitori locali (JJ Manut., LRT, Elenice de Souza)", vals: { "2024": 2224.00, "2025": 88.25 }, note: "Fatture per servizi vari di manutenzione e utenze in scadenza" },
            { code: "2.1.2.01.002", name: "CSLL a Recolher (Tributi sul Reddito)", nature: "Receita Federal do Brasil (RFB)", vals: { "2024": 2167.32, "2025": 521.45 }, note: "Imposta CSLL dovuta per il 4° trimestre con saldo entro gennaio" },
            { code: "2.1.2.03.001", name: "Tributos Federais Diferidos s/ Aplicações", nature: "IRPJ (R$ 29.290,16) e CSLL (R$ 17.574,10)", vals: { "2024": 71881.25, "2025": 46864.26 }, note: "Fondo imposte differite sui rendimenti maturati sul fondo BB RF" }
        ]
    },
    {
        id: "rel",
        category: "passivo_circ",
        code: "2.1.3",
        name: "Passivo Circulante - Partes Relacionadas (SCP J.M.)",
        desc: "Debiti di regolamento intercompany verso J.M. Empreendimentos SCP",
        vals: { "2024": 0.00, "2025": 583947.11 },
        details: [
            { code: "2.1.3.01.001", name: "Intercompany Partes Relacionadas", nature: "J.M. Empreendimentos Imobiliários SCP", vals: { "2024": 0.00, "2025": 583947.11 }, note: "Anticipazioni e regolamenti di conto per la gestione congiunta delle opere e del resort" }
        ]
    },
    {
        id: "pnc",
        category: "passivo_nc",
        code: "2.2.1",
        name: "Passivo Não Circulante - Financiamento Sócios (Holding Lux)",
        desc: "Finanziamento soci a lungo termine da Sombra e Agua Fresca Resort S.à r.l.",
        vals: { "2024": 638000.00, "2025": 700000.00 },
        details: [
            { code: "2.2.1.01.001", name: "Financiamento / Mútuo de Sócios Estrangeiros", nature: "Sombra e Agua Fresca Resort S.à r.l. (RCS B263295)", vals: { "2024": 638000.00, "2025": 700000.00 }, note: "Finanziamento soci infruttifero a lungo termine. Corrisponde al conto PCN 4228800 in Lux" }
        ]
    },
    {
        id: "cap",
        category: "pl",
        code: "2.3.1",
        name: "Patrimônio Líquido - Capital Social Subscrito Estrangeiro",
        desc: "100% detenuto da Sombra e Agua Fresca Resort S.à r.l.",
        vals: { "2024": 3000525.45, "2025": 3000525.45 },
        details: [
            { code: "2.3.1.01.001", name: "Sombra e Agua Fresca Resort S.à r.l.", nature: "Lussemburgo (RCS B263295) - 3.000.525 quote (100%)", vals: { "2024": 3000525.45, "2025": 3000525.45 }, note: "Capitale sociale interamente versato registrato RDE-IED presso Banco Central do Brasil" }
        ]
    },
    {
        id: "luc",
        category: "pl",
        code: "2.3.2",
        name: "Patrimônio Líquido - Lucros Acumulados & Riserve",
        desc: "Risultati economici riportati a nuovo e utili netti d'esercizio",
        vals: { "2024": 1633382.81, "2025": 966763.51 },
        details: [
            { code: "2.3.2.01.001", name: "Saldo Anterior de Lucros Acumulados", nature: "Utili di esercizi precedenti riportati a nuovo", vals: { "2024": 1588783.95, "2025": 1633382.81 }, note: "Riserva utili accumulati all'inizio del rispettivo esercizio contabile" },
            { code: "2.3.2.01.002", name: "Lucro Líquido Apurado no Exercício", nature: "Risultato netto da DRE chiuso al 31 dicembre", vals: { "2024": 44598.86, "2025": 137310.45 }, note: "Utile netto certificato d'esercizio asseverato dal commercialista CRC" },
            { code: "2.3.2.01.003", name: "Distribuições e Destinações de Resultados", nature: "Distribuzione dividendi / rettifiche autorizzate", vals: { "2024": 0.00, "2025": -803929.75 }, note: "Distribuzione proventi a soci e compensazioni approvate in assemblea" }
        ]
    }
];

// ============================================================
// BASE DATI: DRE (PERDITE E PROFITTI / CONTO ECONOMICO)
// ============================================================
const BR_DRE_DATA = [
    // ------------------------------------------------------------
    // SEZIONE I: RICAVI E PROVENTI (RECEITAS E RENDIMENTOS)
    // ------------------------------------------------------------
    {
        id: "rec",
        group: "ricavi",
        code: "3.1.1",
        name: "Receita Líquida Operacional (Ricavi delle Vendite)",
        desc: "Vendita unità abitative e ricavi di gestione alberghiera",
        vals: { "2024": 0.00, "2025": 0.00 },
        details: [
            { code: "3.1.1.01.001", name: "Vendas de Unidades Imobiliárias", nature: "Vendita diretta unità abitative Sombra Resort", vals: { "2024": 0.00, "2025": 0.00 }, note: "Nessun rogito perfezionato nel periodo; unità mantenute a magazzino patrimoniale" }
        ]
    },
    {
        id: "rec_fin",
        group: "ricavi",
        code: "3.1.2",
        name: "Receitas Financeiras (Rendimenti Banco do Brasil & Interessi)",
        desc: "Rendimenti lordi fondo liquidità CDI Banco do Brasil e proventi finanziari",
        vals: { "2024": 81243.96, "2025": 136415.08 },
        details: [
            { code: "3.1.2.01.001", name: "Receita Financeira - Aplicações BB RF Simples", nature: "Fondo d'Investimento BB Renda Fixa Simples LP", vals: { "2024": 80942.61, "2025": 135991.31 }, note: "Interessi lordi maturati sul conto d'investimento BB indicizzato a CDI garantito" },
            { code: "3.1.2.01.002", name: "Juros Ativos & Proventi Accessori", nature: "Interessi attivi bancari maturati su giacenze", vals: { "2024": 0.00, "2025": 423.77 }, note: "Interessi attivi bancari ordinari" },
            { code: "3.1.2.01.003", name: "Variação Monetária Ativa", nature: "Rettifiche valutarie e rivalutazioni monetarie attive", vals: { "2024": 301.35, "2025": 0.00 }, note: "Rettifiche attive di cambio e oscillazioni monetarie" }
        ]
    },
    {
        id: "rec_scp",
        group: "ricavi",
        code: "3.1.3",
        name: "Outras Receitas Operacionais (Proventi Partecipazione SCP)",
        desc: "Quota risultato positivo e proventi da J.M. Empreendimentos SCP",
        vals: { "2024": 0.00, "2025": 64734.04 },
        details: [
            { code: "3.1.3.01.001", name: "Resultado Positivo de Participação em SCP", nature: "Sociedade em Conta de Participação (Socio Partecipante 100%)", vals: { "2024": 0.00, "2025": 64734.04 }, note: "Attribuzione quota utili e proventi da SCP J.M. Empreendimentos Imobiliários" }
        ]
    },

    // ------------------------------------------------------------
    // SEZIONE II: COSTI, ONERI OPERATIVI E IMPOSTE (DESPESAS E TRIBUTOS)
    // ------------------------------------------------------------
    {
        id: "adm",
        group: "costi",
        code: "3.2.1",
        name: "Despesas Operacionais & Administrativas",
        desc: "Spese legali, notai, manutenzione software, servizi PJ e onorari contabili",
        vals: { "2024": -14798.93, "2025": -29585.61 },
        details: [
            { code: "3.2.1.01.002", name: "Cartórios, Certidões e Registri", nature: "Cartório Notarile di Tibau do Sul e Goianinha", vals: { "2024": 0.00, "2025": -1049.08 }, note: "Certificati di vigenza societaria, autentiche e atti notarili" },
            { code: "3.2.1.01.005", name: "Softwares, Sistemi & Connettività", nature: "Licenze informatiche, domini e sistemi gestionali", vals: { "2024": 0.00, "2025": -7621.60 }, note: "Piattaforme di sicurezza, gestione documentale cloud e servizi web" },
            { code: "3.2.1.01.008", name: "Serviços Prestados PJ", nature: "Consulenze e servizi professionali da persone giuridiche", vals: { "2024": -15007.20, "2025": -184.00 }, note: "Prestazioni specialistiche di supporto societario e tecnico" },
            { code: "3.2.1.01.009", name: "Serviços de Terceiros", nature: "Servizi operativi e manutenzioni esterne", vals: { "2024": 0.00, "2025": -5944.25 }, note: "Servizi di manutenzione e forniture ordinarie sede e cantiere" },
            { code: "3.2.1.01.010", name: "Honorários Contábeis & Fiscais", nature: "Studio Commercialista e Revisione Contabile (CRC)", vals: { "2024": -9178.00, "2025": -14786.68 }, note: "Redazione bilancio d'esercizio, dichiarazioni fiscali federali SPED/ECF" },
            { code: "3.2.1.02.001", name: "Material de Manutenção e Reparo", nature: "Opere di custodia ordinaria e conservazione beni", vals: { "2024": -4657.97, "2025": 0.00 }, note: "Spese di custodia sostenute nel 2024 (nel 2025 gestite tramite SCP)" },
            { code: "3.2.1.03.001", name: "Depreciação & Ammortamenti", nature: "Ammortamento attrezzature e arredi", vals: { "2024": -742.44, "2025": 0.00 }, note: "Arredi e dotazioni completati di ammortamento patrimoniale" }
        ]
    },
    {
        id: "trib",
        group: "costi",
        code: "3.2.2",
        name: "Despesas Tributárias Comunali & Tasse Locali",
        desc: "Tasse municipali, licenze di funzionamento ed oneri tributari comunali",
        vals: { "2024": -1463.63, "2025": -378.61 },
        details: [
            { code: "3.2.2.01.001", name: "Impostos e Taxas Municipais", nature: "Prefeitura Municipal de Tibau do Sul (RN)", vals: { "2024": -363.63, "2025": -378.61 }, note: "Tassa di localizzazione ed esercizio e diritti di segreteria amministrativa" },
            { code: "3.2.2.01.003", name: "Multas Fiscais e Ravvedimenti", nature: "Receita Federal / Enti Locali", vals: { "2024": -1100.00, "2025": 0.00 }, note: "Sanzioni per ritardo adempimenti estinte nel 2024; nessuna sanzione nel 2025" }
        ]
    },
    {
        id: "desp_fin",
        group: "costi",
        code: "3.2.3",
        name: "Despesas Financeiras & Oneri Bancari",
        desc: "Spese tenuta conto, bonifici Banco do Brasil e imposta IOF",
        vals: { "2024": -884.01, "2025": -1134.81 },
        details: [
            { code: "3.2.3.01.001", name: "Despesas Bancárias (Tarifas BB)", nature: "Canoni tenuta conto e bonifici Banco do Brasil", vals: { "2024": -729.00, "2025": -925.60 }, note: "Costi di gestione conto corrente e commissioni per operazioni bancarie" },
            { code: "3.2.3.02.001", name: "Juros e Multas Passivi / IOF", nature: "Imposta sulle operazioni finanziarie e oneri", vals: { "2024": -155.01, "2025": -209.21 }, note: "IOF e oneri accessori trattenuti su movimentazioni bancarie" }
        ]
    },
    {
        id: "trib_lucro",
        group: "costi",
        code: "3.2.4",
        name: "Provisões Tributárias s/ Lucro (IRPJ & CSLL)",
        desc: "Imposte federali sul reddito societario (Receita Federal do Brasil)",
        vals: { "2024": -19498.53, "2025": -32739.64 },
        details: [
            { code: "3.2.4.01.001", name: "Provisão para IRPJ (Imposto de Renda Pessoa Jurídica)", nature: "Receita Federal do Brasil (15% base imponibile)", vals: { "2024": -12186.58, "2025": -20462.28 }, note: "Imposta federale sul reddito d'impresa calcolata sul risultato prima imposte" },
            { code: "3.2.4.01.002", name: "Provisão para CSLL (Contribuição Social s/ Lucro)", nature: "Receita Federal do Brasil (9% base imponibile)", vals: { "2024": -7311.95, "2025": -12277.36 }, note: "Contributo sociale statale sull'utile netto aziendale" }
        ]
    },

    // ------------------------------------------------------------
    // SEZIONE III: RISULTATO D'ESERCIZIO (UTILE NETTO)
    // ------------------------------------------------------------
    {
        id: "lucro",
        group: "risultato",
        code: "3.3",
        name: "LUCRO LÍQUIDO DO EXERCÍCIO (UTILE NETTO)",
        desc: "Risultato netto certificato da Contador e Amministratore (DRE Asseverato)",
        vals: { "2024": 44598.86, "2025": 137310.45 },
        details: [
            { code: "3.3.01", name: "Totale Ricavi e Proventi d'Esercizio", nature: "Somma ricavi vendite, proventi finanziari e proventi SCP", vals: { "2024": 81243.96, "2025": 201149.12 }, note: "Tutti i proventi economici accreditati di competenza" },
            { code: "3.3.02", name: "(-) Totale Costi, Oneri e Imposte", nature: "Somma spese amministrative, tributi, oneri bancari e IRPJ/CSLL", vals: { "2024": -36645.10, "2025": -63838.67 }, note: "Tutti i costi e imposte addebitati di competenza" },
            { code: "3.3.03", name: "Risultato Operativo / LAIR (Prima delle Imposte)", nature: "Risultato lordo aziendale prima di IRPJ e CSLL", vals: { "2024": 64097.39, "2025": 170050.09 }, note: "Base imponibile asseverata nel DRE ufficiale" },
            { code: "3.3.04", name: "LUCRO LÍQUIDO FINALE DO EXERCÍCIO", nature: "Utile netto d'esercizio asseverato da Contadora CRC", vals: { "2024": 44598.86, "2025": 137310.45 }, note: "Risultato finale asseverato al 31/12/2025 (DRE - Sombra Resort Brasil Unipessoal Ltda)" }
        ]
    }
];

// ============================================================
// CONTROLLER: CAMBIO MODALITÀ (ANNO SINGOLO / CONFRONTO)
// ============================================================
function setBrFinMode(mode) {
    brFinMode = mode;
    document.getElementById('btn-mode-single')?.classList.toggle('active', mode === 'single');
    document.getElementById('btn-mode-compare')?.classList.toggle('active', mode === 'compare');
    
    const ctrlSingle = document.getElementById('control-br-single');
    const ctrlCompare = document.getElementById('control-br-compare');
    if (ctrlSingle) ctrlSingle.style.display = (mode === 'single') ? 'flex' : 'none';
    if (ctrlCompare) ctrlCompare.style.display = (mode === 'compare') ? 'flex' : 'none';

    renderCurrentBrPage();
}

function onBrYearChange() {
    const sel = document.getElementById('select-br-single-year');
    if (sel) brSingleYear = sel.value;
    renderCurrentBrPage();
}

function onBrCompareChange() {
    const s1 = document.getElementById('select-br-compare-y1');
    const s2 = document.getElementById('select-br-compare-y2');
    if (s1) brCompareY1 = s1.value;
    if (s2) brCompareY2 = s2.value;
    renderCurrentBrPage();
}

function toggleBrDrawer(drawerId, rowId, btnId) {
    const drawer = document.getElementById(drawerId);
    const row = document.getElementById(rowId);
    const btn = document.getElementById(btnId);
    if (!drawer) return;

    const isHidden = (drawer.style.display === 'none' || !drawer.style.display);
    if (isHidden) {
        drawer.style.display = 'table-row';
        if (row) row.classList.add('row-expanded');
        if (btn) btn.classList.add('chevron-open');
    } else {
        drawer.style.display = 'none';
        if (row) row.classList.remove('row-expanded');
        if (btn) btn.classList.remove('chevron-open');
    }
}


// ============================================================
// I18N SUPPORT FOR BRASIL FINANCES
// ============================================================
function getBrLang() {
    return (typeof currentLanguage !== 'undefined' && currentLanguage) ? currentLanguage : (localStorage.getItem('sr_lang') || 'fr');
}

const BR_UI_TEXTS = {
    fr: {
        // Balanço table
        bp_th_rubrica: "Rubrique Comptable (Balanço)",
        bp_th_natura: "Nature Comptable / Description",
        bp_th_saldo: "Solde au 31/12/",
        bp_th_peso: "Poids % sur Total",
        bp_th_var: "Variation (R$)",
        bp_th_var_pct: "Var. %",
        bp_sec_ativo: "ATIVO TOTAL (ACTIF PATRIMONIAL)",
        bp_tot_ativo: "TOTAL GÉNERAL DE L'ACTIF :",
        bp_sec_passivo: "PASSIVO & PATRIMÔNIO LÍQUIDO (PASSIF ET CAPITAUX PROPRES)",
        bp_tot_passivo: "TOTAL GÉNERAL DU PASSIF & PL :",
        // Balanço Drawer
        bp_dr_title: "Détail des Opérations :",
        bp_dr_badge: "Sous-comptes Analytiques",
        bp_dr_cod: "Code Sous-compte",
        bp_dr_desc: "Description du Poste",
        bp_dr_nat: "Nature / Contrepartie",
        bp_dr_saldo: "Solde",
        bp_dr_notes: "Notes et Référence Officielle",
        bp_dr_var: "Variation",
        bp_dr_btn_title: "Développer/Réduire le détail analytique",
        // DRE table
        dre_th_voce: "Poste du Compte de Résultat (DRE)",
        dre_th_cat: "Catégorie de Coût ou Revenu",
        dre_th_importo: "Montant Exercice",
        dre_th_natura: "Nature Comptable",
        dre_th_var: "Variation (R$)",
        dre_th_var_pct: "Var. %",
        dre_sec_rec: "SECTION I — REVENUS ET PRODUITS DE L'EXERCICE (RECEITAS)",
        dre_tot_rec: "TOTAL DES PRODUITS D'EXPLOITATION :",
        dre_rec_badge: "Produits Totaux",
        dre_sec_costi: "SECTION II — COÛTS, CHARGES D'EXPLOITATION ET IMPÔTS (DESPESAS E TRIBUTOS)",
        dre_tot_costi: "TOTAL DES CHARGES, FRAIS & IMPÔTS :",
        dre_costi_badge: "Charges Totales",
        dre_sec_res: "SECTION III — SYNTHÈSE & RÉSULTAT NET DE L'EXERCICE (LUCRO LÍQUIDO)",
        dre_tot_res: "BÉNÉFICE NET DE L'EXERCICE (DRE CERTIFIÉ) :",
        dre_res_badge: "Résultat Net Certifié",
        dre_nature_pos: "Produit / Revenu",
        dre_nature_neg: "Charge / Impôt",
        // DRE Drawer
        dre_dr_title: "Détail des Opérations :",
        dre_dr_badge: "Lignes Analytiques",
        dre_dr_cod: "Code Poste",
        dre_dr_desc: "Description de la Ligne",
        dre_dr_fonte: "Nature / Source Opérationnelle",
        dre_dr_notes: "Notes et Détails Opérationnels",
        // Expand/Collapse
        expand_all: "Déployer tout",
        collapse_all: "Réduire tout"
    },
    it: {
        // Balanço table
        bp_th_rubrica: "Rubrica Contabile (Balanço)",
        bp_th_natura: "Natura Contabile / Destinazione",
        bp_th_saldo: "Saldo al 31/12/",
        bp_th_peso: "Peso % su Totale",
        bp_th_var: "Variazione (R$)",
        bp_th_var_pct: "Var. %",
        bp_sec_ativo: "ATIVO TOTAL (ATTIVO PATRIMONIALE)",
        bp_tot_ativo: "TOTAL GERAL DO ATIVO :",
        bp_sec_passivo: "PASSIVO & PATRIMÔNIO LÍQUIDO (PASSIVO E PATRIMONIO NETTO)",
        bp_tot_passivo: "TOTAL GERAL DO PASSIVO & PL :",
        // Balanço Drawer
        bp_dr_title: "Dettaglio Operazioni :",
        bp_dr_badge: "Sottoconti Analitici",
        bp_dr_cod: "Codice Sottoconto",
        bp_dr_desc: "Descrizione Voce",
        bp_dr_nat: "Natura / Controparte",
        bp_dr_saldo: "Saldo",
        bp_dr_notes: "Note e Riferimento Ufficiale",
        bp_dr_var: "Variazione",
        bp_dr_btn_title: "Apri/Chiudi dettaglio a tendina",
        // DRE table
        dre_th_voce: "Voce di Conto Economico (DRE)",
        dre_th_cat: "Categoria di Costo o Ricavo",
        dre_th_importo: "Importo Esercizio",
        dre_th_natura: "Natura Contabile",
        dre_th_var: "Variazione (R$)",
        dre_th_var_pct: "Var. %",
        dre_sec_rec: "SEZIONE I — RICAVI E PROVENTI D'ESERCIZIO (RECEITAS)",
        dre_tot_rec: "TOTALE RICAVI E PROVENTI :",
        dre_rec_badge: "Proventi Totali",
        dre_sec_costi: "SEZIONE II — COSTI, SPESE OPERATIVE E IMPOSTE (DESPESAS E TRIBUTOS)",
        dre_tot_costi: "TOTALE COSTI, ONERI & TRIBUTI :",
        dre_costi_badge: "Costi Totali",
        dre_sec_res: "SEZIONE III — SINTESI & RISULTATO NETTO FINALE (RICAVI - COSTI)",
        dre_tot_res: "LUCRO LÍQUIDO FINALE (DRE ASSEVERATO) :",
        dre_res_badge: "Risultato Netto Certificato",
        dre_nature_pos: "Provento / Ricavo",
        dre_nature_neg: "Costo / Imposta",
        // DRE Drawer
        dre_dr_title: "Dettaglio Operazioni :",
        dre_dr_badge: "Voci Analitiche",
        dre_dr_cod: "Codice Voce",
        dre_dr_desc: "Descrizione Voce Analitica",
        dre_dr_fonte: "Natura / Fonte Operativa",
        dre_dr_notes: "Note e Dettagli Operativi",
        // Expand/Collapse
        expand_all: "Espandi tutto",
        collapse_all: "Riduci tutto"
    },
    pt: {
        // Balanço table
        bp_th_rubrica: "Rubrica Contábil (Balanço)",
        bp_th_natura: "Natureza Contábil / Descrição",
        bp_th_saldo: "Saldo em 31/12/",
        bp_th_peso: "Participação % no Total",
        bp_th_var: "Variação (R$)",
        bp_th_var_pct: "Var. %",
        bp_sec_ativo: "ATIVO TOTAL (BALANÇO PATRIMONIAL)",
        bp_tot_ativo: "TOTAL GERAL DO ATIVO :",
        bp_sec_passivo: "PASSIVO & PATRIMÔNIO LÍQUIDO",
        bp_tot_passivo: "TOTAL DO PASSIVO E PATRIMÔNIO LÍQUIDO :",
        // Balanço Drawer
        bp_dr_title: "Detalhamento Analítico :",
        bp_dr_badge: "Subcontas Analíticas",
        bp_dr_cod: "Código da Subconta",
        bp_dr_desc: "Descrição da Rubrica",
        bp_dr_nat: "Natureza / Contraparte",
        bp_dr_saldo: "Saldo",
        bp_dr_notes: "Notas e Referência Oficial",
        bp_dr_var: "Variação",
        bp_dr_btn_title: "Expandir/Recolher detalhes da conta",
        // DRE table
        dre_th_voce: "Rubrica de Resultado (DRE)",
        dre_th_cat: "Categoria de Receita / Despesa",
        dre_th_importo: "Valor do Exercício",
        dre_th_natura: "Natureza Contábil",
        dre_th_var: "Variação (R$)",
        dre_th_var_pct: "Var. %",
        dre_sec_rec: "SEÇÃO I — RECEITAS E RENDIMENTOS DO EXERCÍCIO (RECEITAS)",
        dre_tot_rec: "TOTAL DE RECEITAS E RENDIMENTOS :",
        dre_rec_badge: "Receitas Totais",
        dre_sec_costi: "SEÇÃO II — CUSTOS, DESPESAS OPERACIONAIS E TRIBUTOS (DESPESAS E TRIBUTOS)",
        dre_tot_costi: "TOTAL DE CUSTOS, DESPESAS E TRIBUTOS :",
        dre_costi_badge: "Despesas Totais",
        dre_sec_res: "SEÇÃO III — DEMONSTRAÇÃO DO RESULTADO LÍQUIDO (LUCRO LÍQUIDO)",
        dre_tot_res: "LUCRO LÍQUIDO FINAL DO EXERCÍCIO (DRE CERTIFICADO) :",
        dre_res_badge: "Lucro Líquido Certificado",
        dre_nature_pos: "Receita / Rendimento",
        dre_nature_neg: "Custo / Despesa",
        // DRE Drawer
        dre_dr_title: "Detalhamento das Operações :",
        dre_dr_badge: "Itens Analíticos",
        dre_dr_cod: "Código DRE",
        dre_dr_desc: "Descrição da Rubrica",
        dre_dr_fonte: "Natureza / Origem Operacional",
        dre_dr_notes: "Notas e Detalhes Operacionais",
        // Expand/Collapse
        expand_all: "Expandir tudo",
        collapse_all: "Recolher tudo"
    },
    en: {
        // Balanço table
        bp_th_rubrica: "Ledger Account (Balance Sheet)",
        bp_th_natura: "Accounting Nature / Description",
        bp_th_saldo: "Balance as of 31/12/",
        bp_th_peso: "% Share of Total",
        bp_th_var: "Change (R$)",
        bp_th_var_pct: "Var. %",
        bp_sec_ativo: "TOTAL ASSETS (BALANCE SHEET)",
        bp_tot_ativo: "TOTAL ASSETS :",
        bp_sec_passivo: "LIABILITIES & SHAREHOLDERS' EQUITY",
        bp_tot_passivo: "TOTAL LIABILITIES & EQUITY :",
        // Balanço Drawer
        bp_dr_title: "Analytical Details :",
        bp_dr_badge: "Sub-accounts",
        bp_dr_cod: "Sub-account Code",
        bp_dr_desc: "Account Description",
        bp_dr_nat: "Nature / Counterparty",
        bp_dr_saldo: "Balance",
        bp_dr_notes: "Notes & Official Reference",
        bp_dr_var: "Change",
        bp_dr_btn_title: "Expand/Collapse details",
        // DRE table
        dre_th_voce: "Income Statement Item (DRE)",
        dre_th_cat: "Revenue / Expense Category",
        dre_th_importo: "Fiscal Year Amount",
        dre_th_natura: "Accounting Nature",
        dre_th_var: "Change (R$)",
        dre_th_var_pct: "Var. %",
        dre_sec_rec: "SECTION I — REVENUES AND OPERATING EARNINGS (RECEITAS)",
        dre_tot_rec: "TOTAL OPERATING REVENUES :",
        dre_rec_badge: "Total Earnings",
        dre_sec_costi: "SECTION II — COSTS, OPERATING EXPENSES AND TAXES (DESPESAS E TRIBUTOS)",
        dre_tot_costi: "TOTAL COSTS, CHARGES & TAXES :",
        dre_costi_badge: "Total Expenses",
        dre_sec_res: "SECTION III — NET INCOME SUMMARY (LUCRO LÍQUIDO)",
        dre_tot_res: "FINAL NET PROFIT FOR THE YEAR (CERTIFIED DRE) :",
        dre_res_badge: "Certified Net Result",
        dre_nature_pos: "Revenue / Income",
        dre_nature_neg: "Cost / Tax",
        // DRE Drawer
        dre_dr_title: "Analytical Operations :",
        dre_dr_badge: "Analytical Entries",
        dre_dr_cod: "DRE Code",
        dre_dr_desc: "Entry Description",
        dre_dr_fonte: "Nature / Operational Source",
        dre_dr_notes: "Notes & Operational Details",
        // Expand/Collapse
        expand_all: "Expand all",
        collapse_all: "Collapse all"
    }
};

function getBrUIText(key) {
    const lang = getBrLang();
    const dict = BR_UI_TEXTS[lang] || BR_UI_TEXTS.fr;
    return dict[key] || BR_UI_TEXTS.fr[key] || key;
}

// Localized item titles and descriptions
const BR_ITEM_I18N = {
    // Balanço
    "disp": {
        pt: { name: "Ativo Circulante - Disponibilidades (Caixa e Bancos)", desc: "Banco do Brasil C/C e Fundo de Investimento Renda Fixa" },
        fr: { name: "Actif Circulant - Disponibilités (Caisse & Banques)", desc: "Banco do Brasil C/C et Fonds de Placement Renda Fixa" },
        en: { name: "Current Assets - Cash and Cash Equivalents", desc: "Banco do Brasil Checking & Fixed Income Investment Fund" }
    },
    "cred": {
        pt: { name: "Ativo Circulante - Outros Créditos & Adiantamentos", desc: "Adiantamentos a fornecedores, Créditos tributários RFB & Dividendos SCP a receber" },
        fr: { name: "Actif Circulant - Autres Créances & Avances", desc: "Avances aux fournisseurs, Crédits fiscaux RFB & Dividendes SCP à recevoir" },
        en: { name: "Current Assets - Other Receivables & Advances", desc: "Supplier advances, Federal tax credits & SCP dividends receivable" }
    },
    "est": {
        pt: { name: "Ativo Circulante - Estoques & Ativos Imobiliários", desc: "Terreno Praia do Amor e Empreendimento 09 Casas/Vilas Sombra Resort" },
        fr: { name: "Actif Circulant - Stocks & Actifs Immobiliers", desc: "Terrain Praia do Amor et Complexe 09 Villas Sombra Resort" },
        en: { name: "Current Assets - Real Estate Assets & Inventory", desc: "Praia do Amor Land & 9-Villa Sombra Resort Development" }
    },
    "anc": {
        pt: { name: "Ativo Não Circulante - Investimentos & Imobilizado", desc: "Participação Societária SCP J.M. Empreendimentos & Móveis" },
        fr: { name: "Actif Non Circulant - Participations & Immobilisations", desc: "Participation SCP J.M. Empreendimentos & Mobilier" },
        en: { name: "Non-Current Assets - Investments & Fixed Assets", desc: "Equity stake in SCP J.M. Empreendimentos & Office Furniture" }
    },
    "forn": {
        pt: { name: "Passivo Circulante - Fornecedores a Pagar", desc: "Fornecedores locais de tecnologia e assessoria contábil" },
        fr: { name: "Passif Circulant - Fournisseurs à Payer", desc: "Fournisseurs de services technologiques et cabinet comptable" },
        en: { name: "Current Liabilities - Accounts Payable / Suppliers", desc: "Local service providers and accounting advisory firm" }
    },
    "trib": {
        pt: { name: "Passivo Circulante - Obrigações Tributárias", desc: "Receita Federal do Brasil (IRPJ / CSLL) e Tributos Municipais" },
        fr: { name: "Passif Circulant - Dettes Fiscales", desc: "Receita Federal du Brésil (IRPJ / CSLL) et Taxes Municipales" },
        en: { name: "Current Liabilities - Tax Liabilities", desc: "Brazilian Federal Revenue (IRPJ / CSLL) and Municipal Taxes" }
    },
    "opass": {
        pt: { name: "Passivo Circulante - Outras Obrigações (Intercompany SCP)", desc: "J.M. Empreendimentos Imobiliários SCP e outras contas a pagar" },
        fr: { name: "Passif Circulant - Autres Passifs (Intercompany SCP)", desc: "J.M. Empreendimentos Imobiliários SCP et autres dettes courantes" },
        en: { name: "Current Liabilities - Other Obligations (Intercompany SCP)", desc: "J.M. Empreendimentos Imobiliários SCP and other payables" }
    },
    "pl": {
        pt: { name: "Patrimônio Líquido - Capital & Lucros Acumulados", desc: "Capital Social subscrito estrangeiro R$ 3.000.525,45 e Lucros Acumulados" },
        fr: { name: "Capitaux Propres - Capital & Réserves / Bénéfices", desc: "Capital Social souscrit étranger R$ 3.000.525,45 et Bénéfices Reportés" },
        en: { name: "Shareholders' Equity - Share Capital & Retained Earnings", desc: "Foreign subscribed Share Capital R$ 3,000,525.45 and Retained Earnings" }
    },
    // DRE
    "rec": {
        pt: { name: "Receita Líquida Operacional (Venda de Imóveis)", desc: "Venda de unidades imobiliárias e receitas de exploração hoteleira" },
        fr: { name: "Chiffre d'Affaires Net d'Exploitation (Ventes)", desc: "Vente d'unités immobilières et recettes d'exploitation hôtelière" },
        en: { name: "Net Operating Revenue (Real Estate Sales)", desc: "Sale of real estate units and hospitality operating revenues" }
    },
    "rec_fin": {
        pt: { name: "Receitas Financeiras (Rendimentos Banco do Brasil & Juros)", desc: "Rendimentos brutos do fundo CDI Banco do Brasil e receitas de aplicações" },
        fr: { name: "Produits Financiers (Rendements Banco do Brasil & Intérêts)", desc: "Rendements bruts du fonds CDI Banco do Brasil et produits financiers" },
        en: { name: "Financial Revenues (Banco do Brasil Returns & Interest)", desc: "Gross yields on Banco do Brasil CDI liquidity fund and financial earnings" }
    },
    "rec_scp": {
        pt: { name: "Outras Receitas Operacionais (Resultado Positivo SCP)", desc: "Quota-parte de lucro e proventos da participação em J.M. Empreendimentos SCP" },
        fr: { name: "Autres Produits d'Exploitation (Quote-part SCP)", desc: "Quote-part de bénéfice et produits de la participation dans J.M. Empreendimentos SCP" },
        en: { name: "Other Operating Revenues (SCP Net Income)", desc: "Profit share and dividends from participation in J.M. Empreendimentos SCP" }
    },
    "adm": {
        pt: { name: "Despesas Operacionais & Administrativas", desc: "Cartórios, softwares, assessoria contábil/fiscal e serviços de terceiros" },
        fr: { name: "Charges d'Exploitation & Administratives", desc: "Notaires, logiciels informatiques, honoraires comptables et prestataires" },
        en: { name: "Operating & Administrative Expenses", desc: "Notary fees, software systems, accounting/tax fees, and third-party services" }
    },
    "trib": {
        pt: { name: "Despesas Tributárias Municipais & Taxas", desc: "Taxas e impostos municipais da Prefeitura de Tibau do Sul" },
        fr: { name: "Charges Fiscales Municipales & Taxes Locales", desc: "Taxes et impôts municipaux de la Mairie de Tibau do Sul" },
        en: { name: "Municipal Tax Expenses & Local Fees", desc: "Municipal taxes and operating fees from Municipality of Tibau do Sul" }
    },
    "desp_fin": {
        pt: { name: "Despesas Financeiras & Tarifas Bancárias", desc: "Tarifas de manutenção de conta, tarifas Banco do Brasil e IOF" },
        fr: { name: "Charges Financières & Frais Bancaires", desc: "Frais de tenue de compte, virements Banco do Brasil et impôt IOF" },
        en: { name: "Financial Expenses & Banking Fees", desc: "Account maintenance fees, Banco do Brasil transfers, and IOF taxes" }
    },
    "trib_lucro": {
        pt: { name: "Provisões Tributárias s/ Lucro (IRPJ & CSLL)", desc: "Impostos federais sobre o lucro da empresa (Receita Federal do Brasil)" },
        fr: { name: "Provisions Fiscales sur Bénéfice (IRPJ & CSLL)", desc: "Impôts fédéraux sur le bénéfice des sociétés (Receita Federal du Brésil)" },
        en: { name: "Tax Provisions on Profits (IRPJ & CSLL)", desc: "Corporate federal taxes on profit (Receita Federal do Brasil)" }
    },
    "lucro": {
        pt: { name: "LUCRO LÍQUIDO DO EXERCÍCIO (RESULTADO FINAL)", desc: "Resultado líquido final certificado pela Contabilidade CRC e Administração (DRE)" },
        fr: { name: "BÉNÉFICE NET DE L'EXERCICE (RÉSULTAT NET)", desc: "Résultat net final certifié par l'expert-comptable CRC et l'Administration (DRE)" },
        en: { name: "NET PROFIT FOR THE YEAR (FINAL RESULT)", desc: "Final certified net result attested by CRC accountant and Executive Management" }
    }
};

function getItemLocalized(it) {
    const lang = getBrLang();
    if (BR_ITEM_I18N[it.id] && BR_ITEM_I18N[it.id][lang]) {
        return {
            name: BR_ITEM_I18N[it.id][lang].name,
            desc: BR_ITEM_I18N[it.id][lang].desc
        };
    }
    return { name: it.name, desc: it.desc };
}

function toggleAllBrDrawers() {
    const drawers = document.querySelectorAll('.compta-accordion-drawer');
    const btnText = document.getElementById('btn-toggle-all-text');
    if (drawers.length === 0) return;

    let anyClosed = false;
    drawers.forEach(d => {
        if (d.style.display === 'none' || !d.style.display) anyClosed = true;
    });

    drawers.forEach(drawer => {
        const id = drawer.id;
        const rowId = id.replace('br-', 'row-');
        const btnId = id.replace('br-', 'btn-');
        const row = document.getElementById(rowId);
        const btn = document.getElementById(btnId);

        if (anyClosed) {
            drawer.style.display = 'table-row';
            if (row) row.classList.add('row-expanded');
            if (btn) btn.classList.add('chevron-open');
        } else {
            drawer.style.display = 'none';
            if (row) row.classList.remove('row-expanded');
            if (btn) btn.classList.remove('chevron-open');
        }
    });

    if (btnText) {
        btnText.innerText = anyClosed ? getBrUIText('collapse_all') : getBrUIText('expand_all');
    }
}

// ============================================================
// RENDERING BALANÇO PATRIMONIAL
// ============================================================
function renderBalancoTable() {
    const tbody = document.getElementById('br-balanco-tbody');
    const thead = document.getElementById('br-balanco-thead');
    if (!tbody || !thead) return;

    const isSingle = (brFinMode === 'single');
    const y = brSingleYear;
    const y1 = brCompareY1;
    const y2 = brCompareY2;

    // Render THEAD
    if (isSingle) {
        thead.innerHTML = `
            <tr>
                <th>${getBrUIText('bp_th_rubrica')}</th>
                <th>${getBrUIText('bp_th_natura')}</th>
                <th class="text-right" style="width: 200px;">${getBrUIText('bp_th_saldo')}${y} (R$)</th>
                <th class="text-right" style="width: 140px;">${getBrUIText('bp_th_peso')}</th>
            </tr>
        `;
    } else {
        thead.innerHTML = `
            <tr>
                <th>${getBrUIText('bp_th_rubrica')}</th>
                <th>${getBrUIText('bp_th_natura')}</th>
                <th class="text-right" style="width: 160px;">31/12/${y1} (R$)</th>
                <th class="text-right" style="width: 160px;">31/12/${y2} (R$)</th>
                <th class="text-right" style="width: 150px;">${getBrUIText('bp_th_var')}</th>
                <th class="text-right" style="width: 110px;">${getBrUIText('bp_th_var_pct')}</th>
            </tr>
        `;
    }

    // Totali calcolati
    const totAtivo = {
        "2024": 5348180.83,
        "2025": 5298710.03
    };
    const totPassivo = {
        "2024": 5348180.83,
        "2025": 5298710.03
    };

    let html = '';

    // ATIVO HEADER
    html += `
        <tr style="background: rgba(16, 185, 129, 0.1); font-weight: 700;">
            <td colspan="${isSingle ? 4 : 6}" style="color: #34d399; font-size: 14px;">
                <i class="fa-solid fa-folder-tree"></i> ${getBrUIText('bp_sec_ativo')}
            </td>
        </tr>
    `;

    // Righe Ativo
    const ativoItems = BR_BALANCO_DATA.filter(it => it.category.startsWith('ativo'));
    ativoItems.forEach(it => {
        html += buildBalancoRowHtml(it, isSingle, y, y1, y2, totAtivo);
    });

    // ATIVO TOTAL ROW
    const atVal1 = totAtivo[y1] || 0;
    const atVal2 = totAtivo[y2] || 0;
    const atDiff = atVal2 - atVal1;
    const atPct = formatBRLPercent(atVal1, atVal2);

    if (isSingle) {
        html += `
            <tr style="font-weight: 800; background: rgba(16, 185, 129, 0.16); border-top: 2px solid rgba(16, 185, 129, 0.4);">
                <td colspan="2" style="text-align: right; color: #34d399; font-size: 14px;">${getBrUIText('bp_tot_ativo')}</td>
                <td class="text-right text-emerald" style="font-family: monospace; font-size: 14px;">${formatBRL(totAtivo[y])}</td>
                <td class="text-right text-emerald" style="font-family: monospace; font-size: 13px;">100,0%</td>
            </tr>
        `;
    } else {
        html += `
            <tr style="font-weight: 800; background: rgba(16, 185, 129, 0.16); border-top: 2px solid rgba(16, 185, 129, 0.4);">
                <td colspan="2" style="text-align: right; color: #34d399; font-size: 14px;">${getBrUIText('bp_tot_ativo')}</td>
                <td class="text-right text-emerald" style="font-family: monospace;">${formatBRL(atVal1)}</td>
                <td class="text-right text-emerald" style="font-family: monospace; font-size: 14px;">${formatBRL(atVal2)}</td>
                <td class="text-right text-muted" style="font-family: monospace;">${formatBRLSigned(atDiff)}</td>
                <td class="text-right text-muted" style="font-family: monospace;">${atPct}</td>
            </tr>
        `;
    }

    // PASSIVO HEADER
    html += `
        <tr style="background: rgba(245, 158, 11, 0.1); font-weight: 700;">
            <td colspan="${isSingle ? 4 : 6}" style="color: #fbbf24; font-size: 14px; padding-top: 1.5rem;">
                <i class="fa-solid fa-folder-tree"></i> ${getBrUIText('bp_sec_passivo')}
            </td>
        </tr>
    `;

    // Righe Passivo
    const passivoItems = BR_BALANCO_DATA.filter(it => !it.category.startsWith('ativo'));
    passivoItems.forEach(it => {
        html += buildBalancoRowHtml(it, isSingle, y, y1, y2, totPassivo);
    });

    // PASSIVO TOTAL ROW
    const psVal1 = totPassivo[y1] || 0;
    const psVal2 = totPassivo[y2] || 0;
    const psDiff = psVal2 - psVal1;
    const psPct = formatBRLPercent(psVal1, psVal2);

    if (isSingle) {
        html += `
            <tr style="font-weight: 800; background: rgba(245, 158, 11, 0.16); border-top: 2px solid rgba(245, 158, 11, 0.4);">
                <td colspan="2" style="text-align: right; color: #fbbf24; font-size: 14px;">${getBrUIText('bp_tot_passivo')}</td>
                <td class="text-right text-amber" style="font-family: monospace; font-size: 14px;">${formatBRL(totPassivo[y])}</td>
                <td class="text-right text-amber" style="font-family: monospace; font-size: 13px;">100,0%</td>
            </tr>
        `;
    } else {
        html += `
            <tr style="font-weight: 800; background: rgba(245, 158, 11, 0.16); border-top: 2px solid rgba(245, 158, 11, 0.4);">
                <td colspan="2" style="text-align: right; color: #fbbf24; font-size: 14px;">${getBrUIText('bp_tot_passivo')}</td>
                <td class="text-right text-amber" style="font-family: monospace;">${formatBRL(psVal1)}</td>
                <td class="text-right text-amber" style="font-family: monospace; font-size: 14px;">${formatBRL(psVal2)}</td>
                <td class="text-right text-muted" style="font-family: monospace;">${formatBRLSigned(psDiff)}</td>
                <td class="text-right text-muted" style="font-family: monospace;">${psPct}</td>
            </tr>
        `;
    }

    tbody.innerHTML = html;
    updateBalancoKpis(isSingle, y, y1, y2);
}

function buildBalancoRowHtml(it, isSingle, y, y1, y2, totRef) {
    const rowId = `row-bp-${it.id}`;
    const drawerId = `br-bp-${it.id}`;
    const btnId = `btn-bp-${it.id}`;
    const loc = getItemLocalized(it);

    let mainCells = '';
    const colSpan = isSingle ? 4 : 6;

    if (isSingle) {
        const val = it.vals[y] || 0;
        const tot = totRef[y] || 1;
        const weight = ((val / tot) * 100).toFixed(1).replace('.', ',') + '%';
        mainCells = `
            <td class="text-right text-bold" style="font-family: monospace;">${formatBRL(val)}</td>
            <td class="text-right text-muted" style="font-family: monospace;">${weight}</td>
        `;
    } else {
        const v1 = it.vals[y1] || 0;
        const v2 = it.vals[y2] || 0;
        const diff = v2 - v1;
        const pct = formatBRLPercent(v1, v2);
        const diffCls = diff > 0 ? 'text-emerald' : (diff < 0 ? 'text-rose' : 'text-muted');

        mainCells = `
            <td class="text-right" style="font-family: monospace;">${formatBRL(v1)}</td>
            <td class="text-right text-bold" style="font-family: monospace;">${formatBRL(v2)}</td>
            <td class="text-right ${diffCls}" style="font-family: monospace;">${formatBRLSigned(diff)}</td>
            <td class="text-right ${diffCls}" style="font-family: monospace;">${pct}</td>
        `;
    }

    // Dettaglio tendina
    let drawerDetailsRows = '';
    (it.details || []).forEach(d => {
        if (isSingle) {
            const dVal = d.vals[y] || 0;
            drawerDetailsRows += `
                <tr>
                    <td style="font-family: monospace; font-weight: 600;">${d.code}</td>
                    <td>${d.name}</td>
                    <td>${d.nature}</td>
                    <td class="text-right text-bold" style="font-family: monospace;">${formatBRL(dVal)}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${d.note}</td>
                </tr>
            `;
        } else {
            const dv1 = d.vals[y1] || 0;
            const dv2 = d.vals[y2] || 0;
            const dDiff = dv2 - dv1;
            const dCls = dDiff > 0 ? 'text-emerald' : (dDiff < 0 ? 'text-rose' : 'text-muted');
            drawerDetailsRows += `
                <tr>
                    <td style="font-family: monospace; font-weight: 600;">${d.code}</td>
                    <td>${d.name}</td>
                    <td>${d.nature}</td>
                    <td class="text-right" style="font-family: monospace;">${formatBRL(dv1)}</td>
                    <td class="text-right text-bold" style="font-family: monospace;">${formatBRL(dv2)}</td>
                    <td class="text-right ${dCls}" style="font-family: monospace;">${formatBRLSigned(dDiff)}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${d.note}</td>
                </tr>
            `;
        }
    });

    const drawerTableHeaders = isSingle ? `
        <tr>
            <th>${getBrUIText('bp_dr_cod')}</th>
            <th>${getBrUIText('bp_dr_desc')}</th>
            <th>${getBrUIText('bp_dr_nat')}</th>
            <th class="text-right">${getBrUIText('bp_dr_saldo')} ${y} (R$)</th>
            <th>${getBrUIText('bp_dr_notes')}</th>
        </tr>
    ` : `
        <tr>
            <th>${getBrUIText('bp_dr_cod')}</th>
            <th>${getBrUIText('bp_dr_desc')}</th>
            <th>${getBrUIText('bp_dr_nat')}</th>
            <th class="text-right">${y1} (R$)</th>
            <th class="text-right">${y2} (R$)</th>
            <th class="text-right">${getBrUIText('bp_dr_var')}</th>
            <th>${getBrUIText('bp_dr_notes')}</th>
        </tr>
    `;

    return `
        <tr class="compta-row" id="${rowId}" onclick="toggleBrDrawer('${drawerId}', '${rowId}', '${btnId}')">
            <td style="padding-left: 1rem; font-weight: 600;">
                <button class="btn-accordion-toggle" id="${btnId}" title="${getBrUIText('bp_dr_btn_title')}"><i class="fa-solid fa-chevron-right"></i></button>
                ${loc.name}
            </td>
            <td style="font-size: 12px; color: var(--text-muted);">${loc.desc}</td>
            ${mainCells}
        </tr>
        <tr id="${drawerId}" class="compta-accordion-drawer" style="display: none;">
            <td colspan="${colSpan}" class="compta-drawer-cell">
                <div class="compta-drawer-content">
                    <div class="drawer-header">
                        <div class="drawer-title"><i class="fa-solid fa-folder-open text-cyan"></i> ${getBrUIText('bp_dr_title')} ${loc.name}</div>
                        <span class="badge badge-cyan">${it.details.length} ${getBrUIText('bp_dr_badge')}</span>
                    </div>
                    <div class="compta-nested-table-wrap">
                        <table class="compta-nested-table">
                            <thead>
                                ${drawerTableHeaders}
                            </thead>
                            <tbody>
                                ${drawerDetailsRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </td>
        </tr>
    `;
}

function updateBalancoKpis(isSingle, y, y1, y2) {
    const kpiAtivo = document.getElementById('kpi-ativo-val');
    const kpiAtivoSub = document.getElementById('kpi-ativo-sub');
    const kpiCirc = document.getElementById('kpi-circ-val');
    const kpiCircSub = document.getElementById('kpi-circ-sub');
    const kpiPass = document.getElementById('kpi-pass-val');
    const kpiPassSub = document.getElementById('kpi-pass-sub');
    const kpiPl = document.getElementById('kpi-pl-val');
    const kpiPlSub = document.getElementById('kpi-pl-sub');

    if (!kpiAtivo) return;

    const lang = getBrLang();

    if (isSingle) {
        if (y === '2025') {
            kpiAtivo.innerText = "R$ 5.298.710,03";
            kpiCirc.innerText = "R$ 5.278.448,74";
            kpiPass.innerText = "R$ 631.421,07";
            kpiPl.innerText = "R$ 3.967.288,96";

            if (lang === 'pt') {
                kpiAtivoSub.innerText = "Ativo Total Certificado em 31/12/2025";
                kpiCircSub.innerText = "Disponibilidades R$ 976k + Imóveis R$ 3,6M";
                kpiPassSub.innerText = "Fornecedores R$ 88 + SCP R$ 583k + Impostos";
                kpiPlSub.innerText = "Capital R$ 3.000.525,45 + Lucros R$ 966k";
            } else if (lang === 'en') {
                kpiAtivoSub.innerText = "Certified Total Assets as of 31/12/2025";
                kpiCircSub.innerText = "Cash R$ 976k + Real Estate R$ 3.6M";
                kpiPassSub.innerText = "Suppliers R$ 88 + SCP R$ 583k + Taxes";
                kpiPlSub.innerText = "Capital R$ 3,000,525.45 + Retained R$ 966k";
            } else if (lang === 'it') {
                kpiAtivoSub.innerText = "Attivo Totale Certificato al 31/12/2025";
                kpiCircSub.innerText = "Disponibilità R$ 976k + Immobili R$ 3,6M";
                kpiPassSub.innerText = "Fornitori R$ 88 + SCP R$ 583k + Imposte";
                kpiPlSub.innerText = "Capitale R$ 3.000.525,45 + Utili R$ 966k";
            } else {
                kpiAtivoSub.innerText = "Actif Total Certifié au 31/12/2025";
                kpiCircSub.innerText = "Disponibilités R$ 976k + Immobilier R$ 3,6M";
                kpiPassSub.innerText = "Fournisseurs R$ 88 + SCP R$ 583k + Impôts";
                kpiPlSub.innerText = "Capital R$ 3.000.525,45 + Bénéfices R$ 966k";
            }
        } else {
            kpiAtivo.innerText = "R$ 5.348.180,83";
            kpiCirc.innerText = "R$ 5.335.550,12";
            kpiPass.innerText = "R$ 76.272,57";
            kpiPl.innerText = "R$ 4.633.908,26";

            if (lang === 'pt') {
                kpiAtivoSub.innerText = "Ativo Total Certificado em 31/12/2024";
                kpiCircSub.innerText = "Disponibilidades R$ 1,60M + Imóveis R$ 3,6M";
                kpiPassSub.innerText = "Fornecedores R$ 2,2k + Impostos diferidos R$ 74k";
                kpiPlSub.innerText = "Capital R$ 3.000.525,45 + Lucros R$ 1,63M";
            } else if (lang === 'en') {
                kpiAtivoSub.innerText = "Certified Total Assets as of 31/12/2024";
                kpiCircSub.innerText = "Cash R$ 1.60M + Real Estate R$ 3.6M";
                kpiPassSub.innerText = "Suppliers R$ 2.2k + Deferred Taxes R$ 74k";
                kpiPlSub.innerText = "Capital R$ 3,000,525.45 + Retained R$ 1.63M";
            } else if (lang === 'it') {
                kpiAtivoSub.innerText = "Attivo Totale Certificato al 31/12/2024";
                kpiCircSub.innerText = "Disponibilità R$ 1,60M + Immobili R$ 3,6M";
                kpiPassSub.innerText = "Fornitori R$ 2,2k + Imposte differite R$ 74k";
                kpiPlSub.innerText = "Capitale R$ 3.000.525,45 + Utili R$ 1,63M";
            } else {
                kpiAtivoSub.innerText = "Actif Total Certifié au 31/12/2024";
                kpiCircSub.innerText = "Disponibilités R$ 1,60M + Immobilier R$ 3,6M";
                kpiPassSub.innerText = "Fournisseurs R$ 2,2k + Impôts différés R$ 74k";
                kpiPlSub.innerText = "Capital R$ 3.000.525,45 + Bénéfices R$ 1,63M";
            }
        }
    } else {
        kpiAtivo.innerText = "R$ 5.298.710,03";
        kpiCirc.innerText = "R$ 5.278.448,74";
        kpiPass.innerText = "R$ 631.421,07";
        kpiPl.innerText = "R$ 3.967.288,96";

        if (lang === 'pt') {
            kpiAtivoSub.innerText = `Comparativo ${y1} (R$ 5.348k) vs ${y2} (-0,9%)`;
            kpiCircSub.innerText = "Disponibilidades BB + Terreno & 9 Vilas Resort";
            kpiPassSub.innerText = "Intercompany SCP + Fornecedores locais";
            kpiPlSub.innerText = "Patrimônio Líquido após distribuições";
        } else if (lang === 'en') {
            kpiAtivoSub.innerText = `Comparison ${y1} (R$ 5,348k) vs ${y2} (-0.9%)`;
            kpiCircSub.innerText = "Cash BB + Land & 9 Resort Villas";
            kpiPassSub.innerText = "Intercompany SCP + Local Suppliers";
            kpiPlSub.innerText = "Net Equity post-distributions";
        } else if (lang === 'it') {
            kpiAtivoSub.innerText = `Confronto ${y1} (R$ 5.348k) vs ${y2} (-0,9%)`;
            kpiCircSub.innerText = "Liquidità BB + Terreno & 9 Ville Resort";
            kpiPassSub.innerText = "Intercompany SCP + Fornitori locali";
            kpiPlSub.innerText = "Patrimonio Netto post-distribuzioni";
        } else {
            kpiAtivoSub.innerText = `Comparaison ${y1} (R$ 5.348k) vs ${y2} (-0,9%)`;
            kpiCircSub.innerText = "Liquidités BB + Terrain & 9 Villas Resort";
            kpiPassSub.innerText = "Intercompany SCP + Fournisseurs locaux";
            kpiPlSub.innerText = "Capitaux Propres après distributions";
        }
    }
}


// ============================================================
// RENDERING DRE (PERDITE E PROFITTI / CONTO ECONOMICO)
// ============================================================
function renderDreTable() {
    const tbody = document.getElementById('br-dre-tbody');
    const thead = document.getElementById('br-dre-thead');
    if (!tbody || !thead) return;

    const isSingle = (brFinMode === 'single');
    const y = brSingleYear;
    const y1 = brCompareY1;
    const y2 = brCompareY2;
    const colSpan = isSingle ? 4 : 6;

    if (isSingle) {
        thead.innerHTML = `
            <tr>
                <th>${getBrUIText('dre_th_voce')}</th>
                <th>${getBrUIText('dre_th_cat')}</th>
                <th class="text-right" style="width: 200px;">${getBrUIText('dre_th_importo')} ${y} (R$)</th>
                <th class="text-right" style="width: 140px;">${getBrUIText('dre_th_natura')}</th>
            </tr>
        `;
    } else {
        thead.innerHTML = `
            <tr>
                <th>${getBrUIText('dre_th_voce')}</th>
                <th>${getBrUIText('dre_th_cat')}</th>
                <th class="text-right" style="width: 160px;">${y1} (R$)</th>
                <th class="text-right" style="width: 160px;">${y2} (R$)</th>
                <th class="text-right" style="width: 150px;">${getBrUIText('dre_th_var')}</th>
                <th class="text-right" style="width: 110px;">${getBrUIText('dre_th_var_pct')}</th>
            </tr>
        `;
    }

    const ricaviItems = BR_DRE_DATA.filter(it => it.group === 'ricavi');
    const costiItems = BR_DRE_DATA.filter(it => it.group === 'costi');
    const risultatoItems = BR_DRE_DATA.filter(it => it.group === 'risultato');

    const sumGroup = (items, yr) => items.reduce((acc, it) => acc + (it.vals[yr] || 0), 0);

    const recY = sumGroup(ricaviItems, y);
    const recY1 = sumGroup(ricaviItems, y1);
    const recY2 = sumGroup(ricaviItems, y2);
    const recDiff = recY2 - recY1;
    const recPct = formatBRLPercent(recY1, recY2);

    const costY = sumGroup(costiItems, y);
    const costY1 = sumGroup(costiItems, y1);
    const costY2 = sumGroup(costiItems, y2);
    const costDiff = costY2 - costY1;
    const costPct = formatBRLPercent(Math.abs(costY1), Math.abs(costY2));

    let html = '';

    // ============================================================
    // 1. BLOCCO RICAVI E PROVENTI
    // ============================================================
    html += `
        <tr style="background: rgba(16, 185, 129, 0.12); font-weight: 700;">
            <td colspan="${colSpan}" style="color: #34d399; font-size: 13.5px; padding: 0.85rem 1rem;">
                <i class="fa-solid fa-arrow-trend-up text-emerald" style="margin-right: 8px;"></i>
                ${getBrUIText('dre_sec_rec')}
            </td>
        </tr>
    `;

    ricaviItems.forEach(it => {
        html += buildDreRowHtml(it, isSingle, y, y1, y2);
    });

    // Subtotale Ricavi
    if (isSingle) {
        html += `
            <tr style="font-weight: 800; background: rgba(16, 185, 129, 0.18); border-top: 2px solid rgba(16, 185, 129, 0.4); border-bottom: 2px solid rgba(16, 185, 129, 0.4);">
                <td colspan="2" style="text-align: right; color: #34d399; font-size: 13.5px; padding-right: 1.5rem;">
                    ${getBrUIText('dre_tot_rec')}
                </td>
                <td class="text-right text-emerald" style="font-family: monospace; font-size: 14px;">${formatBRLSigned(recY)}</td>
                <td class="text-right text-emerald" style="font-size: 12px; font-weight: 600;">${getBrUIText('dre_rec_badge')}</td>
            </tr>
        `;
    } else {
        html += `
            <tr style="font-weight: 800; background: rgba(16, 185, 129, 0.18); border-top: 2px solid rgba(16, 185, 129, 0.4); border-bottom: 2px solid rgba(16, 185, 129, 0.4);">
                <td colspan="2" style="text-align: right; color: #34d399; font-size: 13.5px; padding-right: 1.5rem;">
                    ${getBrUIText('dre_tot_rec')}
                </td>
                <td class="text-right text-emerald" style="font-family: monospace;">${formatBRLSigned(recY1)}</td>
                <td class="text-right text-emerald" style="font-family: monospace; font-size: 14px;">${formatBRLSigned(recY2)}</td>
                <td class="text-right text-emerald" style="font-family: monospace;">${formatBRLSigned(recDiff)}</td>
                <td class="text-right text-emerald" style="font-family: monospace;">${recPct}</td>
            </tr>
        `;
    }

    // ============================================================
    // 2. BLOCCO COSTI, SPESE OPERATIVE E IMPOSTE
    // ============================================================
    html += `
        <tr style="background: rgba(244, 63, 94, 0.12); font-weight: 700;">
            <td colspan="${colSpan}" style="color: #fb7185; font-size: 13.5px; padding: 1.2rem 1rem 0.85rem 1rem;">
                <i class="fa-solid fa-arrow-trend-down text-rose" style="margin-right: 8px;"></i>
                ${getBrUIText('dre_sec_costi')}
            </td>
        </tr>
    `;

    costiItems.forEach(it => {
        html += buildDreRowHtml(it, isSingle, y, y1, y2);
    });

    // Subtotale Costi
    if (isSingle) {
        html += `
            <tr style="font-weight: 800; background: rgba(244, 63, 94, 0.18); border-top: 2px solid rgba(244, 63, 94, 0.4); border-bottom: 2px solid rgba(244, 63, 94, 0.4);">
                <td colspan="2" style="text-align: right; color: #fb7185; font-size: 13.5px; padding-right: 1.5rem;">
                    ${getBrUIText('dre_tot_costi')}
                </td>
                <td class="text-right text-rose" style="font-family: monospace; font-size: 14px;">${formatBRLSigned(costY)}</td>
                <td class="text-right text-rose" style="font-size: 12px; font-weight: 600;">${getBrUIText('dre_costi_badge')}</td>
            </tr>
        `;
    } else {
        html += `
            <tr style="font-weight: 800; background: rgba(244, 63, 94, 0.18); border-top: 2px solid rgba(244, 63, 94, 0.4); border-bottom: 2px solid rgba(244, 63, 94, 0.4);">
                <td colspan="2" style="text-align: right; color: #fb7185; font-size: 13.5px; padding-right: 1.5rem;">
                    ${getBrUIText('dre_tot_costi')}
                </td>
                <td class="text-right text-rose" style="font-family: monospace;">${formatBRLSigned(costY1)}</td>
                <td class="text-right text-rose" style="font-family: monospace; font-size: 14px;">${formatBRLSigned(costY2)}</td>
                <td class="text-right text-rose" style="font-family: monospace;">${formatBRLSigned(costDiff)}</td>
                <td class="text-right text-rose" style="font-family: monospace;">${costPct}</td>
            </tr>
        `;
    }

    // ============================================================
    // 3. BLOCCO SINTESI E RISULTATO D'ESERCIZIO
    // ============================================================
    html += `
        <tr style="background: rgba(59, 130, 246, 0.12); font-weight: 700;">
            <td colspan="${colSpan}" style="color: #60a5fa; font-size: 13.5px; padding: 1.2rem 1rem 0.85rem 1rem;">
                <i class="fa-solid fa-scale-balanced text-cyan" style="margin-right: 8px;"></i>
                ${getBrUIText('dre_sec_res')}
            </td>
        </tr>
    `;

    risultatoItems.forEach(it => {
        html += buildDreRowHtml(it, isSingle, y, y1, y2);
    });

    tbody.innerHTML = html;
    updateDreKpis(isSingle, y, y1, y2);
}

function buildDreRowHtml(it, isSingle, y, y1, y2) {
    const rowId = `row-dre-${it.id}`;
    const drawerId = `br-dre-${it.id}`;
    const btnId = `btn-dre-${it.id}`;
    const colSpan = isSingle ? 4 : 6;
    const isLucro = (it.id === 'lucro');
    const loc = getItemLocalized(it);

    let mainCells = '';
    if (isSingle) {
        const val = it.vals[y] || 0;
        const valCls = val > 0 ? 'text-emerald' : (val < 0 ? 'text-rose' : 'text-muted');
        const nature = val >= 0 ? getBrUIText('dre_nature_pos') : getBrUIText('dre_nature_neg');
        mainCells = `
            <td class="text-right text-bold ${valCls}" style="font-family: monospace; font-size: ${isLucro ? '15px' : '13px'};">${formatBRLSigned(val)}</td>
            <td class="text-right text-muted" style="font-size: 12px;">${nature}</td>
        `;
    } else {
        const v1 = it.vals[y1] || 0;
        const v2 = it.vals[y2] || 0;
        const diff = v2 - v1;
        const pct = formatBRLPercent(v1, v2);
        const v1Cls = v1 > 0 ? 'text-emerald' : (v1 < 0 ? 'text-rose' : 'text-muted');
        const v2Cls = v2 > 0 ? 'text-emerald' : (v2 < 0 ? 'text-rose' : 'text-muted');
        const diffCls = diff > 0 ? 'text-emerald' : (diff < 0 ? 'text-rose' : 'text-muted');

        mainCells = `
            <td class="text-right ${v1Cls}" style="font-family: monospace;">${formatBRLSigned(v1)}</td>
            <td class="text-right text-bold ${v2Cls}" style="font-family: monospace; font-size: ${isLucro ? '15px' : '13px'};">${formatBRLSigned(v2)}</td>
            <td class="text-right ${diffCls}" style="font-family: monospace;">${formatBRLSigned(diff)}</td>
            <td class="text-right ${diffCls}" style="font-family: monospace;">${pct}</td>
        `;
    }

    let drawerRows = '';
    (it.details || []).forEach(d => {
        if (isSingle) {
            const dVal = d.vals[y] || 0;
            const dCls = dVal > 0 ? 'text-emerald' : (dVal < 0 ? 'text-rose' : 'text-muted');
            drawerRows += `
                <tr>
                    <td style="font-family: monospace; font-weight: 600;">${d.code}</td>
                    <td>${d.name}</td>
                    <td>${d.nature}</td>
                    <td class="text-right text-bold ${dCls}" style="font-family: monospace;">${formatBRLSigned(dVal)}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${d.note}</td>
                </tr>
            `;
        } else {
            const dv1 = d.vals[y1] || 0;
            const dv2 = d.vals[y2] || 0;
            const dDiff = dv2 - dv1;
            const dv1Cls = dv1 > 0 ? 'text-emerald' : (dv1 < 0 ? 'text-rose' : 'text-muted');
            const dv2Cls = dv2 > 0 ? 'text-emerald' : (dv2 < 0 ? 'text-rose' : 'text-muted');
            const dDiffCls = dDiff > 0 ? 'text-emerald' : (dDiff < 0 ? 'text-rose' : 'text-muted');

            drawerRows += `
                <tr>
                    <td style="font-family: monospace; font-weight: 600;">${d.code}</td>
                    <td>${d.name}</td>
                    <td>${d.nature}</td>
                    <td class="text-right ${dv1Cls}" style="font-family: monospace;">${formatBRLSigned(dv1)}</td>
                    <td class="text-right text-bold ${dv2Cls}" style="font-family: monospace;">${formatBRLSigned(dv2)}</td>
                    <td class="text-right ${dDiffCls}" style="font-family: monospace;">${formatBRLSigned(dDiff)}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${d.note}</td>
                </tr>
            `;
        }
    });

    const drawerTableHeaders = isSingle ? `
        <tr>
            <th>${getBrUIText('dre_dr_cod')}</th>
            <th>${getBrUIText('dre_dr_desc')}</th>
            <th>${getBrUIText('dre_dr_fonte')}</th>
            <th class="text-right">${getBrUIText('dre_th_importo')} ${y} (R$)</th>
            <th>${getBrUIText('dre_dr_notes')}</th>
        </tr>
    ` : `
        <tr>
            <th>${getBrUIText('dre_dr_cod')}</th>
            <th>${getBrUIText('dre_dr_desc')}</th>
            <th>${getBrUIText('dre_dr_fonte')}</th>
            <th class="text-right">${y1} (R$)</th>
            <th class="text-right">${y2} (R$)</th>
            <th class="text-right">${getBrUIText('bp_dr_var')}</th>
            <th>${getBrUIText('dre_dr_notes')}</th>
        </tr>
    `;

    const rowBg = isLucro ? 'background: rgba(16, 185, 129, 0.22); font-weight: 800; border-top: 2px solid #10b981; border-bottom: 2px solid #10b981;' : '';

    return `
        <tr class="compta-row" id="${rowId}" style="${rowBg}" onclick="toggleBrDrawer('${drawerId}', '${rowId}', '${btnId}')">
            <td style="padding-left: 1rem; font-weight: 600; color: ${isLucro ? '#34d399' : 'inherit'};">
                <button class="btn-accordion-toggle" id="${btnId}" title="${getBrUIText('bp_dr_btn_title')}"><i class="fa-solid fa-chevron-right"></i></button>
                ${loc.name}
            </td>
            <td style="font-size: 12px; color: var(--text-muted);">${loc.desc}</td>
            ${mainCells}
        </tr>
        <tr id="${drawerId}" class="compta-accordion-drawer" style="display: none;">
            <td colspan="${colSpan}" class="compta-drawer-cell">
                <div class="compta-drawer-content">
                    <div class="drawer-header">
                        <div class="drawer-title"><i class="fa-solid fa-receipt text-emerald"></i> ${getBrUIText('dre_dr_title')} ${loc.name}</div>
                        <span class="badge badge-emerald">${it.details.length} ${getBrUIText('dre_dr_badge')}</span>
                    </div>
                    <div class="compta-nested-table-wrap">
                        <table class="compta-nested-table">
                            <thead>
                                ${drawerTableHeaders}
                            </thead>
                            <tbody>
                                ${drawerRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </td>
        </tr>
    `;
}

function updateDreKpis(isSingle, y, y1, y2) {
    const kpiRec = document.getElementById('kpi-rec-val');
    const kpiRecSub = document.getElementById('kpi-rec-sub');
    const kpiDesp = document.getElementById('kpi-desp-val');
    const kpiDespSub = document.getElementById('kpi-desp-sub');
    const kpiFin = document.getElementById('kpi-fin-val');
    const kpiLucro = document.getElementById('kpi-lucro-val');
    const kpiLucroSub = document.getElementById('kpi-lucro-sub');

    if (!kpiRec) return;

    const lang = getBrLang();

    if (isSingle) {
        if (y === '2025') {
            kpiRec.innerText = "+ R$ 201.149,12";
            kpiDesp.innerText = "- R$ 63.838,67";
            kpiFin.innerText = "+ R$ 135.280,27";
            kpiLucro.innerText = "+ R$ 137.310,45";

            if (lang === 'pt') {
                if (kpiRecSub) kpiRecSub.innerText = "Rendimentos BB (R$ 136k) + Proventos SCP (R$ 64k)";
                if (kpiDespSub) kpiDespSub.innerText = "Despesas adm. R$ 29,6k, tributos R$ 33,1k, bancárias R$ 1,1k";
                if (kpiLucroSub) kpiLucroSub.innerText = "Lucro líquido do exercício certificado CRC";
            } else if (lang === 'en') {
                if (kpiRecSub) kpiRecSub.innerText = "BB Returns (R$ 136k) + SCP Income (R$ 64k)";
                if (kpiDespSub) kpiDespSub.innerText = "Admin exp. R$ 29.6k, taxes R$ 33.1k, bank fees R$ 1.1k";
                if (kpiLucroSub) kpiLucroSub.innerText = "Certified Net Profit for the year by CRC";
            } else if (lang === 'it') {
                if (kpiRecSub) kpiRecSub.innerText = "Rendimenti BB (R$ 136k) + Proventi SCP (R$ 64k)";
                if (kpiDespSub) kpiDespSub.innerText = "Spese amm. R$ 29,6k, tributi R$ 33,1k, banche R$ 1,1k";
                if (kpiLucroSub) kpiLucroSub.innerText = "Utile netto d'esercizio asseverato CRC";
            } else {
                if (kpiRecSub) kpiRecSub.innerText = "Rendements BB (R$ 136k) + Produits SCP (R$ 64k)";
                if (kpiDespSub) kpiDespSub.innerText = "Dépenses adm. R$ 29,6k, impôts R$ 33,1k, banques R$ 1,1k";
                if (kpiLucroSub) kpiLucroSub.innerText = "Bénéfice net d'exercice certifié CRC";
            }
        } else {
            kpiRec.innerText = "+ R$ 81.243,96";
            kpiDesp.innerText = "- R$ 36.645,10";
            kpiFin.innerText = "+ R$ 80.359,95";
            kpiLucro.innerText = "+ R$ 44.598,86";

            if (lang === 'pt') {
                if (kpiRecSub) kpiRecSub.innerText = "Rendimentos brutos da conta de liquidez BB";
                if (kpiDespSub) kpiDespSub.innerText = "Despesas adm. R$ 14,8k, impostos R$ 19,5k, tarifas R$ 2,3k";
                if (kpiLucroSub) kpiLucroSub.innerText = "Lucro líquido do exercício certificado 2024";
            } else if (lang === 'en') {
                if (kpiRecSub) kpiRecSub.innerText = "Gross returns on BB liquidity account";
                if (kpiDespSub) kpiDespSub.innerText = "Admin exp. R$ 14.8k, taxes R$ 19.5k, bank fees R$ 2.3k";
                if (kpiLucroSub) kpiLucroSub.innerText = "Certified Net Profit for fiscal year 2024";
            } else if (lang === 'it') {
                if (kpiRecSub) kpiRecSub.innerText = "Rendimenti lordi conto liquidità BB";
                if (kpiDespSub) kpiDespSub.innerText = "Spese amm. R$ 14,8k, imposte R$ 19,5k, oneri R$ 2,3k";
                if (kpiLucroSub) kpiLucroSub.innerText = "Utile netto d'esercizio asseverato 2024";
            } else {
                if (kpiRecSub) kpiRecSub.innerText = "Rendements bruts compte de liquidité BB";
                if (kpiDespSub) kpiDespSub.innerText = "Dépenses adm. R$ 14,8k, impôts R$ 19,5k, frais R$ 2,3k";
                if (kpiLucroSub) kpiLucroSub.innerText = "Bénéfice net d'exercice certifié 2024";
            }
        }
    } else {
        kpiRec.innerText = "+ R$ 201.149,12";
        kpiDesp.innerText = "- R$ 63.838,67";
        kpiFin.innerText = "+ R$ 135.280,27";
        kpiLucro.innerText = "+ R$ 137.310,45";

        if (lang === 'pt') {
            if (kpiRecSub) kpiRecSub.innerText = "Incremento das receitas totais: +147,6%";
            if (kpiDespSub) kpiDespSub.innerText = "Variação dos custos totais: +74,2%";
            if (kpiLucroSub) kpiLucroSub.innerText = "Crescimento do lucro líquido: +207,9% (+ R$ 92.711,59)";
        } else if (lang === 'en') {
            if (kpiRecSub) kpiRecSub.innerText = "Total revenue increase: +147.6%";
            if (kpiDespSub) kpiDespSub.innerText = "Total costs variance: +74.2%";
            if (kpiLucroSub) kpiLucroSub.innerText = "Net profit growth: +207.9% (+ R$ 92,711.59)";
        } else if (lang === 'it') {
            if (kpiRecSub) kpiRecSub.innerText = "Incremento proventi totali: +147,6%";
            if (kpiDespSub) kpiDespSub.innerText = "Variazione costi totali: +74,2%";
            if (kpiLucroSub) kpiLucroSub.innerText = "Crescita utile netto: +207,9% (+ R$ 92.711,59)";
        } else {
            if (kpiRecSub) kpiRecSub.innerText = "Augmentation des produits totaux : +147,6%";
            if (kpiDespSub) kpiDespSub.innerText = "Variation des charges totales : +74,2%";
            if (kpiLucroSub) kpiLucroSub.innerText = "Croissance du bénéfice net : +207,9% (+ R$ 92.711,59)";
        }
    }
}

// Render based on current page
function renderCurrentBrPage() {
    if (document.getElementById('br-balanco-tbody')) {
        renderBalancoTable();
    }
    if (document.getElementById('br-dre-tbody')) {
        renderDreTable();
    }
}

// Inizializzazione al caricamento e reattività lingua
document.addEventListener('DOMContentLoaded', () => {
    renderCurrentBrPage();
});

window.addEventListener('sr:languageChanged', () => {
    renderCurrentBrPage();
});
