/**
 * brasil_finances.js
 * SOMBRA RESORT BRASIL SOCIEDADE UNIPESSOAL LTDA (CNPJ 43.730.206/0001-80)
 * Gestione dinamica:
 * - Scelta dell'anno singolo da esaminare (2024, 2025, 2026 YTD Excel BB)
 * - Confronto dinamico tra due anni (es. 2025 vs 2026, 2024 vs 2025)
 * - Accordion tendina per ciascuna voce e sottoconto analitico
 */

let brFinMode = 'compare'; // 'single' oppure 'compare'
let brSingleYear = '2026';
let brCompareY1 = '2025';
let brCompareY2 = '2026';
let brDreBasis = 'cash'; // 'cash' = Flussi BB Excel Pivot cons | 'crc' = Contabilità Ufficiale Asseverata CRC

function getDreYrVal(node, yr) {
    if (brDreBasis === 'cash' && node && node.cashVals && node.cashVals[yr] !== undefined) {
        return node.cashVals[yr];
    }
    return (node && node.vals && node.vals[yr]) || 0;
}

function setBrDreBasis(basis) {
    brDreBasis = basis === 'crc' ? 'crc' : 'cash';
    document.getElementById('btn-dre-basis-cash')?.classList.toggle('active', brDreBasis === 'cash');
    document.getElementById('btn-dre-basis-crc')?.classList.toggle('active', brDreBasis === 'crc');
    renderCurrentBrPage();
}

function getBrDateLabel(yr) {
    return yr === '2026' ? '31/10/2026' : `31/12/${yr}`;
}

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
// 2024 & 2025: da Balanço Patrimonial Assinado 31/12/2025
// 2026: 31/12/2025 rettificato con movimenti Excel BB al 31/10/2026
// ============================================================
const BR_BALANCO_DATA = [
    {
        id: "disp",
        category: "ativo_circ",
        code: "1.1.1",
        name: "Ativo Circulante - Disponibilidades (Cassa e Banche)",
        desc: "Banco do Brasil C/C e Fondo Investimento Renda Fixa",
        vals: { "2024": 976766.78, "2025": 1600579.12, "2026": 1774989.28 },
        details: [
            { code: "1.1.1.01.002", name: "Banco do Brasil S.A. - C/C 48649-3", nature: "Conto Corrente ordinario (Ag. 1066-9 Goianinha)", vals: { "2024": 0.00, "2025": 8856.39, "2026": 21578.01 }, note: "2025 da Balanço CRC; 2026 saldo al 30/10/2026 da estratto Excel Banco do Brasil" },
            { code: "1.1.1.02.001", name: "BB Renda Fixa Simples LP", nature: "Fondo d'Investimento Monetario a Breve Termine", vals: { "2024": 976766.78, "2025": 1591722.73, "2026": 1753411.27 }, note: "Liquidità remunerata a rendimento CDI (+R$ 156.589,49 lordi, -R$ 18.614,73 IRRF, +R$ 23.713,78 netto versamenti/prelievi nel 2026)" }
        ]
    },
    {
        id: "cred",
        category: "ativo_circ",
        code: "1.1.2",
        name: "Ativo Circulante - Outros Créditos & Adiantamentos",
        desc: "Anticipi fornitori, Crediti fiscali RFB & Dividendi SCP a ricevere",
        vals: { "2024": 701156.51, "2025": 134445.55, "2026": 134445.55 },
        details: [
            { code: "1.1.2.05.001", name: "Adiantamentos a Fornecedores", nature: "Yapay Pagamentos (2024) & C N Palaoro Eireli (2025-2026)", vals: { "2024": 6764.79, "2025": 13337.99, "2026": 13337.99 }, note: "Acconti a fornitori; nel 2026 nessuna variazione su C N Palaoro Eireli" },
            { code: "1.1.2.06.002", name: "Impostos a Compensar (IRRF / IRPJ)", nature: "Crediti tributari verso Receita Federal do Brasil (RFB)", vals: { "2024": 36557.38, "2025": 56373.52, "2026": 56373.52 }, note: "Crediti IRPJ/IRRF certificati 2025; ritenuta IRRF 2026 (R$ 18.614,73) spesata nel DRE provvisorio fino a chiusura ECF" },
            { code: "1.1.2.08.001", name: "Dividendos e Lucros a Receber SCP (Locação Resort)", nature: "J.M. Empreendimentos Imobiliários SCP", vals: { "2024": 657834.34, "2025": 64734.04, "2026": 64734.04 }, note: "Credito fine 2025 mantenuto provvisoriamente invariato; gli incassi 2026 (R$ 64.734,05 tra ago e ott) sono esposti in DRE 2026 alla voce Locazione/SCP (salvo conguaglio CRC a fine esercizio)" }
        ]
    },
    {
        id: "est",
        category: "ativo_circ",
        code: "1.1.3",
        name: "Ativo Circulante - Estoques & Ativos Imobiliários",
        desc: "Terreno Praia do Amor e Complesso Case/Villas Sombra Resort",
        vals: { "2024": 3600525.45, "2025": 3600525.45, "2026": 3600525.45 },
        details: [
            { code: "1.1.3.01.001", name: "Terreno Urbano Praia do Amor", nature: "Lotto 1.044,81 m² - Praia de Pipa / Tibau do Sul (RN)", vals: { "2024": 600000.00, "2025": 600000.00, "2026": 600000.00 }, note: "Valore d'acquisto e registrazione notarile al Catasto di Tibau do Sul" },
            { code: "1.1.3.02.001", name: "Empreendimento 09 Casas/Villas Sombra Resort", nature: "Complesso Residenziale Turistico Sombra Resort Brasil", vals: { "2024": 3000525.45, "2025": 3000525.45, "2026": 3000525.45 }, note: "Valore storico di conferimento di capitale e sviluppo edilizio del villaggio" }
        ]
    },
    {
        id: "anc",
        category: "ativo_nc",
        code: "1.2",
        name: "Ativo Não Circulante - Investimentos & Imobilizzato",
        desc: "Partecipazione SCP J.M. Empreendimentos & Mobili",
        vals: { "2024": 20261.29, "2025": 12630.71, "2026": 12630.71 },
        details: [
            { code: "1.2.1.01.001", name: "Participação Societária J.M. Empreendimentos SCP", nature: "Quota di partecipazione societaria", vals: { "2024": 6000.00, "2025": 6000.00, "2026": 6000.00 }, note: "Quota sociale nominale detenuta quale socio partecipante (sócio participante)" },
            { code: "1.2.1.02.001", name: "Equivalência Patrimonial SCP", nature: "Rivalutazione a Patrimonio Netto quota SCP", vals: { "2024": 14261.29, "2025": 0.00, "2026": 0.00 }, note: "Adeguamento equivalenza patrimoniale SCP al 31/12/2025" },
            { code: "1.2.2.01.001", name: "Móveis e Utensílios de Escritório (Líquido)", nature: "Cespiti materiali al netto ammortamenti (R$ 7.425,04 - R$ 794,33)", vals: { "2024": 0.00, "2025": 6630.71, "2026": 6630.71 }, note: "Arredi acquistati nel 2025 (valore netto contabile invariato in attesa ammortamento fine 2026)" }
        ]
    },
    {
        id: "forn",
        category: "passivo_circ",
        code: "2.1.1",
        name: "Passivo Circulante - Fornecedores & Imposte da Versare",
        desc: "Debiti commerciali a breve termine e imposte correnti/differite",
        vals: { "2024": 47473.96, "2025": 76272.57, "2026": 76272.57 },
        details: [
            { code: "2.1.1.01.001", name: "Fornecedores Nacionais de Bens e Serviços", nature: "Elenice Soares (2024), JJ Assessoria & LRT Soluções (2025)", vals: { "2024": 88.25, "2025": 2224.00, "2026": 2224.00 }, note: "Saldo chiusura 2025 (R$ 2.224,00) mantenuto invariato nel provvisorio 2026; i pagamenti Gestão Empresarial gen-ott (R$ 23.767,31) sono esposti integralmente in DRE 3.2.1.01.010" },
            { code: "2.1.2.01.002", name: "CSLL a Recolher (Tributi sul Reddito)", nature: "Receita Federal do Brasil (RFB)", vals: { "2024": 521.45, "2025": 2167.32, "2026": 2167.32 }, note: "Imposta CSLL da versare riportata da chiusura 2025" },
            { code: "2.1.2.03.001", name: "Tributos Federais Diferidos s/ Aplicações", nature: "IRPJ (R$ 44.925,79) e CSLL (R$ 26.955,46) al 31/12/2025", vals: { "2024": 46864.26, "2025": 71881.25, "2026": 71881.25 }, note: "Fondo imposte differite sui rendimenti BB RF da chiusura ufficiale 2025" }
        ]
    },
    {
        id: "rel",
        category: "passivo_circ",
        code: "2.1.3",
        name: "Passivo Circulante - Partes Relacionadas (SCP J.M.)",
        desc: "Debiti di regolamento intercompany verso J.M. Empreendimentos SCP",
        vals: { "2024": 583947.11, "2025": 0.00, "2026": 0.00 },
        details: [
            { code: "2.1.3.01.001", name: "Intercompany Partes Relacionadas", nature: "J.M. Empreendimentos Imobiliários SCP", vals: { "2024": 583947.11, "2025": 0.00, "2026": 0.00 }, note: "Saldo intercompany regolato e compensato nell'esercizio 2025" }
        ]
    },
    {
        id: "pnc",
        category: "passivo_nc",
        code: "2.2.1",
        name: "Passivo Não Circulante - Financiamento Sócios (Holding Lux)",
        desc: "Finanziamento soci a lungo termine da Sombra e Agua Fresca Resort S.à r.l.",
        vals: { "2024": 700000.00, "2025": 638000.00, "2026": 638000.00 },
        details: [
            { code: "2.2.1.01.001", name: "Financiamento / Mútuo de Sócios Estrangeiros", nature: "Sombra e Agua Fresca Resort S.à r.l. (RCS B263295)", vals: { "2024": 700000.00, "2025": 638000.00, "2026": 638000.00 }, note: "Ridotto di R$ 62.000 nel dic 2025 (cessione credito Franco Toscano); invariato nel 2026" }
        ]
    },
    {
        id: "cap",
        category: "pl",
        code: "2.3.1",
        name: "Patrimônio Líquido - Capital Social Subscrito Estrangeiro",
        desc: "100% detenuto da Sombra e Agua Fresca Resort S.à r.l.",
        vals: { "2024": 3000525.45, "2025": 3000525.45, "2026": 3000525.45 },
        details: [
            { code: "2.3.1.01.001", name: "Sombra e Agua Fresca Resort S.à r.l.", nature: "Lussemburgo (RCS B263295) - 3.000.525 quote (100%)", vals: { "2024": 3000525.45, "2025": 3000525.45, "2026": 3000525.45 }, note: "Capitale sociale interamente versato registrato RDE-IED presso Banco Central do Brasil" }
        ]
    },
    {
        id: "luc",
        category: "pl",
        code: "2.3.2",
        name: "Patrimônio Líquido - Lucros Acumulados & Riserve",
        desc: "Risultati economici riportati a nuovo e utili netti d'esercizio",
        vals: { "2024": 966763.51, "2025": 1633382.81, "2026": 1807792.97 },
        details: [
            { code: "2.3.2.01.001", name: "Saldo Anterior de Lucros Acumulados", nature: "Utili di esercizi precedenti riportati a nuovo", vals: { "2024": 922164.65, "2025": 966763.51, "2026": 1633382.81 }, note: "Riserva utili accumulati all'inizio di ciascun esercizio contabile" },
            { code: "2.3.2.01.002", name: "Lucro Líquido Apurado no Exercício", nature: "Risultato netto da DRE (2024-2025 CRC; 2026 YTD al 31/10 Excel BB)", vals: { "2024": 44598.86, "2025": 137310.45, "2026": 174410.16 }, note: "2024-2025 asseverati CRC; 2026 provvisorio gen-ott da movimenti bancari Excel BB (incl. R$ 64.734,05 locazione/SCP)" },
            { code: "2.3.2.01.003", name: "Distribuições, Destinações e Ajustes SCP", nature: "Rettifiche e compensazioni patrimoniali approvate", vals: { "2024": 0.00, "2025": 529308.85, "2026": 0.00 }, note: "Rettifica contabile 2025 su saldi SCP/riserve; nessuna distribuzione nel 2026" }
        ]
    }
];

// ============================================================
// BASE DATI: DRE (PERDITE E PROFITTI / CONTO ECONOMICO)
// 2024 & 2025: da DRE Assinado 31/12/2025
// 2026: YTD 01/01-31/10/2026 da Excel Banco do Brasil rettificato
// ============================================================
const BR_DRE_DATA = [
    // ------------------------------------------------------------
    // SEZIONE I: RICAVI E PROVENTI (RECEITAS E RENDIMENTOS)
    // ------------------------------------------------------------
    {
        id: "rec",
        group: "ricavi",
        code: "3.1.1",
        name: "Receita Líquida Operacional (Vendas Imobiliárias)",
        desc: "Vendita unità immobiliari (i canoni di locazione del Resort sono contabilizzati in 3.1.3 via SCP)",
        vals: { "2024": 0.00, "2025": 0.00, "2026": 0.00 },
        details: [
            { code: "3.1.1.01.001", name: "Vendas de Unidades Imobiliárias", nature: "Vendita diretta unità abitative Sombra Resort", vals: { "2024": 0.00, "2025": 0.00, "2026": 0.00 }, note: "Nessuna compravendita immobiliare nel periodo; i proventi di locazione del Resort transitano dalla SCP (voce 3.1.3)" }
        ]
    },
    {
        id: "rec_fin",
        group: "ricavi",
        code: "3.1.2",
        name: "Receitas Financeiras (Rendimenti Banco do Brasil & Interessi)",
        desc: "Rendimenti lordi fondo liquidità CDI Banco do Brasil e proventi finanziari",
        vals: { "2024": 81243.96, "2025": 136415.08, "2026": 156589.49 },
        cashVals: { "2024": 80942.61, "2025": 135991.31, "2026": 156589.49 },
        details: [
            { code: "3.1.2.01.001", name: "Receita Financeira - Aplicações BB RF Simples", nature: "Fondo d'Investimento BB Renda Fixa Simples LP", vals: { "2024": 80942.61, "2025": 135991.31, "2026": 156589.49 }, cashVals: { "2024": 80942.61, "2025": 135991.31, "2026": 156589.49 }, note: "2026: Somma dei 10 rendimenti lordi mensili (gen-ott 2026) da Conto Investimento Excel BB" },
            { code: "3.1.2.01.002", name: "Juros Ativos & Proventi Accessori", nature: "Interessi attivi bancari maturati su giacenze", vals: { "2024": 0.00, "2025": 423.77, "2026": 0.00 }, cashVals: { "2024": 0.00, "2025": 0.00, "2026": 0.00 }, note: "Interessi attivi bancari ordinari (solo CRC 2025)" },
            { code: "3.1.2.01.003", name: "Variação Monetária Ativa", nature: "Rettifiche valutarie e rivalutazioni monetarie attive", vals: { "2024": 301.35, "2025": 0.00, "2026": 0.00 }, cashVals: { "2024": 0.00, "2025": 0.00, "2026": 0.00 }, note: "Rettifiche attive di cambio e oscillazioni monetarie (solo CRC 2024)" }
        ]
    },
    {
        id: "rec_scp",
        group: "ricavi",
        code: "3.1.3",
        name: "Outras Receitas Operacionais (Locação Resort / Participação SCP)",
        desc: "Remunerazione affitto Resort tramite J.M. Empreendimentos Imobiliários SCP",
        vals: { "2024": 0.00, "2025": 64734.04, "2026": 64734.05 },
        cashVals: { "2024": 0.00, "2025": 617509.26, "2026": 64734.05 },
        details: [
            { code: "3.1.3.01.001", name: "Locação Resort / Resultado Positivo SCP", nature: "Canoni di affitto Hotel Sombra liquidati come proventi SCP (Sócio Participante)", vals: { "2024": 0.00, "2025": 64734.04, "2026": 64734.05 }, cashVals: { "2024": 0.00, "2025": 617509.26, "2026": 64734.05 }, note: "2025 Cassa BB: R$ 617.509,26 (07/02: R$ 258.299,87 • 13/10: R$ 150.000,00 • 15/12: R$ 209.209,39) | CRC 2025: R$ 64.734,04 residuo appostato a DRE; 2026: R$ 64.734,05" }
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
        desc: "Spese legali, notai, domiciliazione, servizi PJ e onorari contabili",
        vals: { "2024": -14798.93, "2025": -29585.61, "2026": -27015.70 },
        cashVals: { "2024": -21475.47, "2025": -40914.87, "2026": -27015.70 },
        details: [
            { code: "3.2.1.01.002", name: "Cartórios, Certidões e Registri", nature: "Cartório Notarile di Tibau do Sul e Goianinha", vals: { "2024": -1049.08, "2025": 0.00, "2026": 0.00 }, cashVals: { "2024": -1049.08, "2025": 0.00, "2026": 0.00 }, note: "Certificati di vigenza societaria, autentiche e atti notarili" },
            { code: "3.2.1.01.005", name: "Manutenção/Licença de Software", nature: "Licenze informatiche, domini e sistemi gestionali", vals: { "2024": -7621.60, "2025": 0.00, "2026": 0.00 }, cashVals: { "2024": 0.00, "2025": 0.00, "2026": 0.00 }, note: "Riclassificazione contabile CRC 2024 (in cassa BB rilevato sotto forniture/materiali)" },
            { code: "3.2.1.01.008", name: "Serviços Prestados PJ & Domiciliação", nature: "Consulenze PJ e domiciliazione sede (Varias)", vals: { "2024": -184.00, "2025": -15007.20, "2026": -935.39 }, cashVals: { "2024": -1034.00, "2025": -8212.65, "2026": -935.39 }, note: "2026: Seahub Coworking (-R$ 935,39). 2025 Cassa BB: ONE Domiciliazione, C N Palaoro, Nu Pagamento, storno Global Tech" },
            { code: "3.2.1.01.009", name: "Serviços de Terceiros & Manutenção", nature: "Servizi operativi esterni (Varias)", vals: { "2024": -5944.25, "2025": 0.00, "2026": -2313.00 }, cashVals: { "2024": -10464.79, "2025": -9609.38, "2026": -2313.00 }, note: "2026: Art Korten Design (-R$ 2.313,00). 2025 Cassa BB: Comercial Dist. Natal (-R$ 4.809,38) + Magnolia (-R$ 4.800,00)" },
            { code: "3.2.1.01.010", name: "Honorários Contábeis & Gestão Empresarial", nature: "Essencial/LRT Soluções & JJ Assessoria Contábil", vals: { "2024": 0.00, "2025": -9178.00, "2026": -23767.31 }, cashVals: { "2024": -1306.00, "2025": -15610.00, "2026": -23767.31 }, note: "2025 Cassa BB: -R$ 15.610,00; 2026 Cassa BB: -R$ 23.767,31 (Essencial, LRT & JJ Assessoria)" },
            { code: "3.2.1.02.001", name: "Material de Manutenção e Reparo", nature: "Opere di custodia ordinaria e fornitura materiali", vals: { "2024": 0.00, "2025": -4657.97, "2026": 0.00 }, cashVals: { "2024": -7621.60, "2025": 0.00, "2026": 0.00 }, note: "2024 Cassa BB: L&M Costruzioni + Mac Madeira (-R$ 7.621,60); 2025 CRC: -R$ 4.657,97" },
            { code: "3.2.1.02.002", name: "Móveis Casa H (Importação Butzke)", nature: "Acquisto mobili Casa H (in CRC capitalizzato nell'Imobilizado 1.2.2)", vals: { "2024": 0.00, "2025": 0.00, "2026": 0.00 }, cashVals: { "2024": 0.00, "2025": -7482.84, "2026": 0.00 }, cashOnly: true, note: "2025 Cassa BB: 3 bonifici Butzke Importação (-R$ 2.498,14 • -R$ 2.480,79 • -R$ 2.503,91 = -R$ 7.482,84)" },
            { code: "3.2.1.03.001", name: "Depreciação & Ammortamenti", nature: "Ammortamento attrezzature e arredi", vals: { "2024": 0.00, "2025": -742.44, "2026": 0.00 }, cashVals: { "2024": 0.00, "2025": 0.00, "2026": 0.00 }, note: "Quota ammortamento 2025 CRC (posta non monetaria)" }
        ]
    },
    {
        id: "trib",
        group: "costi",
        code: "3.2.2",
        name: "Despesas Tributárias Comunali & Tasse Locali",
        desc: "Tasse municipali, licenze di funzionamento ed oneri tributari comunali",
        vals: { "2024": -1463.63, "2025": -378.61, "2026": -398.75 },
        cashVals: { "2024": -817.60, "2025": -378.61, "2026": -398.75 },
        details: [
            { code: "3.2.2.01.001", name: "Impostos e Taxas Municipais", nature: "Prefeitura Municipal de Natal / Tibau do Sul (RN)", vals: { "2024": -363.63, "2025": -378.61, "2026": -398.75 }, cashVals: { "2024": -817.60, "2025": -378.61, "2026": -398.75 }, note: "Cassa BB: 2024 Taxas 2023+2024 (-R$ 817,60), 2025 (-R$ 378,61), 2026 (-R$ 398,75)" },
            { code: "3.2.2.01.003", name: "Multas Fiscais e Ravvedimenti", nature: "Receita Federal / Enti Locali", vals: { "2024": -1100.00, "2025": 0.00, "2026": 0.00 }, cashVals: { "2024": 0.00, "2025": 0.00, "2026": 0.00 }, note: "Solo competenza CRC 2024" }
        ]
    },
    {
        id: "desp_fin",
        group: "costi",
        code: "3.2.3",
        name: "Despesas Financeiras & Oneri Bancari",
        desc: "Spese tenuta conto, bonifici Banco do Brasil e imposta IOF",
        vals: { "2024": -884.01, "2025": -1134.81, "2026": -884.20 },
        cashVals: { "2024": -729.00, "2025": -925.60, "2026": -884.20 },
        details: [
            { code: "3.2.3.01.001", name: "Despesas Bancárias (Tarifas BB)", nature: "Canoni tenuta conto Banco do Brasil", vals: { "2024": -729.00, "2025": -925.60, "2026": -884.20 }, cashVals: { "2024": -729.00, "2025": -925.60, "2026": -884.20 }, note: "Tarifa Pacote de Serviços Banco do Brasil da estratto Excel" },
            { code: "3.2.3.02.001", name: "Juros e Multas Passivi / IOF", nature: "Imposta sulle operazioni finanziarie e oneri", vals: { "2024": -155.01, "2025": -209.21, "2026": 0.00 }, cashVals: { "2024": 0.00, "2025": 0.00, "2026": 0.00 }, note: "Solo rilevazioni contabili CRC 2024-2025" }
        ]
    },
    {
        id: "trib_lucro",
        group: "costi",
        code: "3.2.4",
        name: "Provisões & Retenções Tributárias s/ Lucro (IRPJ / CSLL / IRRF)",
        desc: "Imposte federali sul reddito e ritenute IRRF Banco do Brasil",
        vals: { "2024": -19498.53, "2025": -32739.64, "2026": -18614.73 },
        cashVals: { "2024": -16073.35, "2025": -25469.15, "2026": -18614.73 },
        details: [
            { code: "3.2.4.01.001", name: "IRPJ / IRRF Retido na Fonte (BB RF)", nature: "CRC: Provisão IRPJ | Cassa BB: IRRF come-cotas sul Fondo RF", vals: { "2024": -12186.58, "2025": -20462.28, "2026": -18614.73 }, cashVals: { "2024": -16073.35, "2025": -25469.15, "2026": -18614.73 }, note: "IRRF trattenuto da BB nel Fondo Renda Fixa (2024: -R$ 16.073,35 • 2025: -R$ 25.469,15 • 2026: -R$ 18.614,73)" },
            { code: "3.2.4.01.002", name: "Provisão para CSLL (Contribuição Social s/ Lucro)", nature: "Receita Federal do Brasil (9% base imponibile)", vals: { "2024": -7311.95, "2025": -12277.36, "2026": 0.00 }, cashVals: { "2024": 0.00, "2025": 0.00, "2026": 0.00 }, note: "Accantonamento fiscale di chiusura CRC" }
        ]
    },
    {
        id: "cessao",
        group: "costi",
        cashOnly: true,
        code: "3.2.5",
        name: "Cessão de Crédito / Rimborso Finanziamento Socio",
        desc: "Uscita di cassa BB per rimborso parziale debito verso Holding (in CRC contabilizzata a Balanço 2.2.1)",
        vals: { "2024": 0.00, "2025": 0.00, "2026": 0.00 },
        cashVals: { "2024": 0.00, "2025": -62000.00, "2026": 0.00 },
        details: [
            { code: "3.2.5.01.001", name: "Cessão de Crédito (Franco Toscano)", nature: "Rimborso parziale Mútuo Sombra e Agua Fresca S.à r.l.", vals: { "2024": 0.00, "2025": 0.00, "2026": 0.00 }, cashVals: { "2024": 0.00, "2025": -62000.00, "2026": 0.00 }, note: "2025 Cassa BB (Pivot cons): -R$ 62.000,00 (03-05/12/2025: 25k+25k+12k). In CRC riduce Passivo Não Circulante da R$ 700k a R$ 638k" }
        ]
    },

    // ------------------------------------------------------------
    // SEZIONE III: RISULTATO D'ESERCIZIO (UTILE NETTO)
    // ------------------------------------------------------------
    {
        id: "lucro",
        group: "risultato",
        code: "3.3",
        name: "LUCRO LÍQUIDO / FLUSSO NETTO D'ESERCIZIO",
        desc: "Cassa BB (Pivot cons) vs Risultato netto asseverato CRC",
        vals: { "2024": 44598.86, "2025": 137310.45, "2026": 174410.16 },
        cashVals: { "2024": 41847.19, "2025": 623812.34, "2026": 174410.16 },
        details: [
            { code: "3.3.01", name: "Totale Ricavi e Proventi d'Esercizio", nature: "Somma ricavi locazione SCP e proventi finanziari BB RF", vals: { "2024": 81243.96, "2025": 201149.12, "2026": 221323.54 }, cashVals: { "2024": 80942.61, "2025": 753500.57, "2026": 221323.54 }, note: "Cassa BB = Totale ENTRADAS Pivot cons (2025: R$ 617.509,26 locazione + R$ 135.991,31 juros)" },
            { code: "3.3.02", name: "(-) Totale Costi, Oneri, Imposte & Uscite BB", nature: "Somma spese generali, tributi, oneri bancari, IRPJ/CSLL/IRRF e cessão", vals: { "2024": -36645.10, "2025": -63838.67, "2026": -46913.38 }, cashVals: { "2024": -39095.42, "2025": -129688.23, "2026": -46913.38 }, note: "Cassa BB = Totale SAIDAS Pivot cons" },
            { code: "3.3.03", name: "Risultato Operativo / Ante Imposte (LAIR)", nature: "Risultato lordo prima di IRPJ, CSLL/IRRF (e Cessão in vista cassa)", vals: { "2024": 64097.39, "2025": 170050.09, "2026": 193024.89 }, cashVals: { "2024": 57920.54, "2025": 711281.49, "2026": 193024.89 }, note: "Margine lordo ante ritenute IRRF/IRPJ/CSLL e movimenti finanziari soci" },
            { code: "3.3.04", name: "RISULTATO NETTO FINALE (UTILE CRC / FLUSSO BB)", nature: "Risultato finale del periodo", vals: { "2024": 44598.86, "2025": 137310.45, "2026": 174410.16 }, cashVals: { "2024": 41847.19, "2025": 623812.34, "2026": 174410.16 }, note: "Cassa BB = variazione netta giacenze Banco do Brasil (2025: +R$ 623.812,34 • 2026 YTD: +R$ 174.410,16)" }
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
        dre_tot_res_cash: "FLUX NET DE TRÉSORERIE BB (PIVOT EXCEL) :",
        dre_res_badge_cash: "Flux Net Caisse BB",
        dre_banner_cash: "<strong>Vue Flux de Trésorerie Banco do Brasil (Excel Pivot cons)</strong> — Reflète les encaissements et décaissements effectifs sur les comptes BB : en <strong>2025</strong>, Loyers SCP encaissés <strong>+R$ 617.509,26</strong>, Rendements BB <strong>+R$ 135.991,31</strong> (Total Entrées +R$ 753.500,57), Frais Généraux <strong>-R$ 40.914,87</strong>, Cession de Crédit <strong>-R$ 62.000,00</strong> et Flux Net <strong>+R$ 623.812,34</strong>. Basculez sur <em>Comptabilité Officielle (CRC)</em> pour le DRE statutaire (Utile 2025 +R$ 137.310,45).",
        dre_banner_crc: "<strong>Vue Comptabilité Officielle Asseverée CRC (2024–2025 PDF)</strong> — Sur le DRE statutaire 2025, la comptabilité a enregistré uniquement <strong>+R$ 64.734,04</strong> en résultat SCP (solde restant à recevoir encaissé en août–oct. 2026 pour R$ 64.734,05), les <strong>R$ 617.509,26</strong> encaissés en 2025 ayant soldé d'anciens comptes SCP (R$ 657.834,34 fin 2024) et majoré directement les Bénéfices Reportés (+R$ 529.308,85). En 2026 YTD, les deux vues sont identiques.",
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
        dre_tot_res_cash: "FLUSSO NETTO DI CASSA BB (PIVOT EXCEL) :",
        dre_res_badge_cash: "Flusso Netto Cassa BB",
        dre_banner_cash: "<strong>Vista Flussi di Cassa Banco do Brasil (Excel Pivot cons)</strong> — Mostra gli incassi e i pagamenti effettivi sui conti BB: nel <strong>2025</strong>, Locazioni SCP <strong>+R$ 617.509,26</strong>, Interessi BB <strong>+R$ 135.991,31</strong> (Totale Entrate +R$ 753.500,57), Spese Generali <strong>-R$ 40.914,87</strong>, Cessão de Crédito <strong>-R$ 62.000,00</strong> e Flusso Netto <strong>+R$ 623.812,34</strong>. Passa a <em>Contabilità Ufficiale (CRC)</em> per il DRE statutario (Utile 2025 +R$ 137.310,45).",
        dre_banner_crc: "<strong>Vista Contabilità Ufficiale Asseverata CRC (2024–2025 PDF)</strong> — Nel DRE ufficiale 2025 risultano solo <strong>+R$ 64.734,04</strong> di proventi SCP (credito residuo poi incassato ago–ott 2026 per R$ 64.734,05), poiché i <strong>R$ 617.509,26</strong> incassati nel 2025 hanno chiuso i crediti SCP 2024 (R$ 657.834,34) e rettificato direttamente gli Utili Accumulati (+R$ 529.308,85). Per il 2026 YTD entrambe le viste coincidono.",
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
        dre_tot_res_cash: "FLUXO LÍQUIDO DE CAIXA BB (PIVOT EXCEL) :",
        dre_res_badge_cash: "Fluxo Líquido Caixa BB",
        dre_banner_cash: "<strong>Visão Fluxo de Caixa Banco do Brasil (Excel Pivot cons)</strong> — Reflete as entradas e saídas efetivas nas contas BB: em <strong>2025</strong>, Locação SCP <strong>+R$ 617.509,26</strong>, Rendimentos BB <strong>+R$ 135.991,31</strong> (Total Entradas +R$ 753.500,57), Despesas Gerais <strong>-R$ 40.914,87</strong>, Cessão de Crédito <strong>-R$ 62.000,00</strong> e Fluxo Líquido <strong>+R$ 623.812,34</strong>. Alterne para <em>Contabilidade Oficial (CRC)</em> para a DRE estatutária (Lucro 2025 +R$ 137.310,45).",
        dre_banner_crc: "<strong>Visão Contabilidade Oficial Certificada CRC (2024–2025 PDF)</strong> — Na DRE oficial 2025 constam apenas <strong>+R$ 64.734,04</strong> de resultado SCP (saldo a receber liquidado em ago–out 2026 por R$ 64.734,05), pois os <strong>R$ 617.509,26</strong> recebidos em 2025 baixaram créditos SCP de 2024 (R$ 657.834,34) e ajustaram diretamente Lucros Acumulados (+R$ 529.308,85). Em 2026 YTD as duas visões são idênticas.",
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
        dre_tot_res_cash: "NET BB CASH FLOW (EXCEL PIVOT) :",
        dre_res_badge_cash: "Net BB Cash Flow",
        dre_banner_cash: "<strong>Banco do Brasil Cash Flows View (Excel Pivot cons)</strong> — Shows actual bank inflows and outflows: in <strong>2025</strong>, Resort Lease SCP <strong>+R$ 617,509.26</strong>, BB Interest <strong>+R$ 135,991.31</strong> (Total Inflows +R$ 753,500.57), General Expenses <strong>-R$ 40,914.87</strong>, Loan Repayment (Cessão) <strong>-R$ 62,000.00</strong> and Net Cash Flow <strong>+R$ 623,812.34</strong>. Switch to <em>Certified Accounting (CRC)</em> for the statutory P&L (2025 Net Profit +R$ 137,310.45).",
        dre_banner_crc: "<strong>Certified Accounting CRC View (2024–2025 Signed PDF)</strong> — The statutory 2025 P&L recognized only <strong>+R$ 64,734.04</strong> as SCP income (the year-end receivable later collected in Aug–Oct 2026 for R$ 64,734.05), because the <strong>R$ 617,509.26</strong> cash collected in 2025 settled prior 2024 SCP receivables (R$ 657,834.34) and went directly to Retained Earnings (+R$ 529,308.85). In 2026 YTD both views are identical.",
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
        it: { name: "Attivo Circolante - Disponibilità Liquide (Cassa e Banche)", desc: "Banco do Brasil C/C e Fondo d'Investimento Renda Fixa" },
        pt: { name: "Ativo Circulante - Disponibilidades (Caixa e Bancos)", desc: "Banco do Brasil C/C e Fundo de Investimento Renda Fixa" },
        fr: { name: "Actif Circulant - Disponibilités (Caisse & Banques)", desc: "Banco do Brasil C/C et Fonds de Placement Renda Fixa" },
        en: { name: "Current Assets - Cash and Cash Equivalents", desc: "Banco do Brasil Checking & Fixed Income Investment Fund" }
    },
    "cred": {
        it: { name: "Attivo Circolante - Altri Crediti e Acconti", desc: "Acconti a fornitori, Crediti fiscali RFB e Dividendi SCP da incassare" },
        pt: { name: "Ativo Circulante - Outros Créditos & Adiantamentos", desc: "Adiantamentos a fornecedores, Créditos tributários RFB & Dividendos SCP a receber" },
        fr: { name: "Actif Circulant - Autres Créances & Avances", desc: "Avances aux fournisseurs, Crédits fiscaux RFB & Dividendes SCP à recevoir" },
        en: { name: "Current Assets - Other Receivables & Advances", desc: "Supplier advances, Federal tax credits & SCP dividends receivable" }
    },
    "est": {
        it: { name: "Attivo Circolante - Rimanenze e Attività Immobiliari", desc: "Terreno Praia do Amor e Complesso 09 Case/Ville Sombra Resort" },
        pt: { name: "Ativo Circulante - Estoques & Ativos Imobiliários", desc: "Terreno Praia do Amor e Empreendimento 09 Casas/Vilas Sombra Resort" },
        fr: { name: "Actif Circulant - Stocks & Actifs Immobiliers", desc: "Terrain Praia do Amor et Complexe 09 Villas Sombra Resort" },
        en: { name: "Current Assets - Real Estate Assets & Inventory", desc: "Praia do Amor Land & 9-Villa Sombra Resort Development" }
    },
    "anc": {
        it: { name: "Attivo Non Circolante - Partecipazioni e Immobilizzazioni", desc: "Partecipazione SCP J.M. Empreendimentos e Arredi d'ufficio" },
        pt: { name: "Ativo Não Circulante - Investimentos & Imobilizado", desc: "Participação Societária SCP J.M. Empreendimentos & Móveis" },
        fr: { name: "Actif Non Circulant - Participations & Immobilisations", desc: "Participation SCP J.M. Empreendimentos & Mobilier" },
        en: { name: "Non-Current Assets - Investments & Fixed Assets", desc: "Equity stake in SCP J.M. Empreendimentos & Office Furniture" }
    },
    "forn": {
        it: { name: "Passivo Circolante - Fornitori e Imposte da Versare", desc: "Debiti commerciali a breve termine e imposte correnti/differite" },
        pt: { name: "Passivo Circulante - Fornecedores & Obrigações Fiscais", desc: "Fornecedores locais e impostos correntes/diferidos a recolher" },
        fr: { name: "Passif Circulant - Fournisseurs & Impôts à Payer", desc: "Fournisseurs locaux et impôts courants/différés" },
        en: { name: "Current Liabilities - Suppliers & Tax Obligations", desc: "Local suppliers and current/deferred corporate taxes" }
    },
    "rel": {
        it: { name: "Passivo Circolante - Parti Correlate (SCP J.M.)", desc: "Debiti di regolamento intercompany verso J.M. Empreendimentos SCP" },
        pt: { name: "Passivo Circulante - Partes Relacionadas (SCP J.M.)", desc: "Débitos de acerto intercompany com J.M. Empreendimentos SCP" },
        fr: { name: "Passif Circulant - Parties Liées (SCP J.M.)", desc: "Dettes intercompany envers J.M. Empreendimentos SCP" },
        en: { name: "Current Liabilities - Related Parties (SCP J.M.)", desc: "Intercompany settlement payables to J.M. Empreendimentos SCP" }
    },
    "pnc": {
        it: { name: "Passivo Non Circolante - Finanziamento Soci (Holding Lux)", desc: "Mutuo a lungo termine da Sombra e Agua Fresca Resort S.à r.l." },
        pt: { name: "Passivo Não Circulante - Financiamento Sócios (Holding Lux)", desc: "Mútuo de longo prazo de Sombra e Agua Fresca Resort S.à r.l." },
        fr: { name: "Passif Non Circulant - Prêt d'Associé (Holding Lux)", desc: "Financement long terme de Sombra e Agua Fresca Resort S.à r.l." },
        en: { name: "Non-Current Liabilities - Shareholder Loan (Holding Lux)", desc: "Long-term loan from Sombra e Agua Fresca Resort S.à r.l." }
    },
    "cap": {
        it: { name: "Patrimonio Netto - Capitale Sociale Sottoscritto Estero", desc: "Detenuto al 100% da Sombra e Agua Fresca Resort S.à r.l." },
        pt: { name: "Patrimônio Líquido - Capital Social Subscrito Estrangeiro", desc: "100% detido por Sombra e Agua Fresca Resort S.à r.l." },
        fr: { name: "Capitaux Propres - Capital Social Souscrit Étranger", desc: "Détenu à 100% par Sombra e Agua Fresca Resort S.à r.l." },
        en: { name: "Shareholders' Equity - Foreign Subscribed Share Capital", desc: "100% held by Sombra e Agua Fresca Resort S.à r.l." }
    },
    "luc": {
        it: { name: "Patrimonio Netto - Utili Accumulati e Riserve", desc: "Risultati economici riportati a nuovo e utili netti d'esercizio" },
        pt: { name: "Patrimônio Líquido - Lucros Acumulados & Reservas", desc: "Resultados acumulados de exercícios anteriores e lucro líquido do período" },
        fr: { name: "Capitaux Propres - Bénéfices Reportés & Réserves", desc: "Résultats cumulés reportés et bénéfice net de l'exercice" },
        en: { name: "Shareholders' Equity - Retained Earnings & Reserves", desc: "Prior retained earnings and net profit for the period" }
    },
    // DRE
    "rec": {
        it: { name: "Ricavi Netti Operativi (Vendita Immobili)", desc: "Vendita unità immobiliari (i canoni di locazione del Resort transitano in 3.1.3 via SCP)" },
        pt: { name: "Receita Líquida Operacional (Venda de Imóveis)", desc: "Venda de unidades imobiliárias (aluguéis do Resort via SCP em 3.1.3)" },
        fr: { name: "Chiffre d'Affaires Net d'Exploitation (Ventes)", desc: "Ventes d'unités immobilières (loyers du Resort via SCP en 3.1.3)" },
        en: { name: "Net Operating Revenue (Real Estate Sales)", desc: "Sale of real estate units (Resort lease income via SCP in 3.1.3)" }
    },
    "rec_fin": {
        it: { name: "Proventi Finanziari (Rendimenti Banco do Brasil & Interessi)", desc: "Rendimenti lordi del fondo CDI Banco do Brasil e interessi attivi su giacenze" },
        pt: { name: "Receitas Financeiras (Rendimentos Banco do Brasil & Juros)", desc: "Rendimentos brutos do fundo CDI Banco do Brasil e receitas de aplicações" },
        fr: { name: "Produits Financiers (Rendements Banco do Brasil & Intérêts)", desc: "Rendements bruts du fonds CDI Banco do Brasil et produits financiers" },
        en: { name: "Financial Revenues (Banco do Brasil Returns & Interest)", desc: "Gross yields on Banco do Brasil CDI liquidity fund and financial earnings" }
    },
    "rec_scp": {
        it: { name: "Altri Ricavi Operativi (Locazione Resort / Proventi SCP)", desc: "Remunerazione per locazione del Resort tramite J.M. Empreendimentos SCP" },
        pt: { name: "Outras Receitas Operacionais (Locação Resort / Participação SCP)", desc: "Remuneração de locação do Resort via J.M. Empreendimentos SCP" },
        fr: { name: "Autres Produits d'Exploitation (Loyers Resort / Participation SCP)", desc: "Rémunération locative du Resort via J.M. Empreendimentos SCP" },
        en: { name: "Other Operating Revenues (Resort Lease / SCP Income)", desc: "Resort lease remuneration via J.M. Empreendimentos SCP profit share" }
    },
    "adm": {
        it: { name: "Spese Operative e Amministrative (Spese Generali)", desc: "Notai, software, domiciliazione, gestione aziendale (Gestão Empresarial) e spese varie" },
        pt: { name: "Despesas Operacionais & Administrativas", desc: "Cartórios, softwares, assessoria contábil/gestão empresarial e despesas diversas" },
        fr: { name: "Charges d'Exploitation & Administratives", desc: "Notaires, logiciels, gestion d'entreprise (Gestão Empresarial) et frais divers" },
        en: { name: "Operating & Administrative Expenses", desc: "Notary fees, software, corporate management (Gestão Empresarial) and miscellaneous costs" }
    },
    "trib": {
        it: { name: "Imposte e Tasse Municipali", desc: "Tasse e tributi municipali della Prefettura di Tibau do Sul (Taxa de Localização)" },
        pt: { name: "Despesas Tributárias Municipais & Taxas", desc: "Taxas e impostos municipais da Prefeitura de Tibau do Sul" },
        fr: { name: "Charges Fiscales Municipales & Taxes Locales", desc: "Taxes et impôts municipaux de la Mairie de Tibau do Sul" },
        en: { name: "Municipal Tax Expenses & Local Fees", desc: "Municipal taxes and operating fees from Municipality of Tibau do Sul" }
    },
    "desp_fin": {
        it: { name: "Oneri Finanziari e Commissioni Bancarie", desc: "Canoni tenuta conto, commissioni Banco do Brasil e imposta IOF" },
        pt: { name: "Despesas Financeiras & Tarifas Bancárias", desc: "Tarifas de manutenção de conta, tarifas Banco do Brasil e IOF" },
        fr: { name: "Charges Financières & Frais Bancaires", desc: "Frais de tenue de compte, virements Banco do Brasil et impôt IOF" },
        en: { name: "Financial Expenses & Banking Fees", desc: "Account maintenance fees, Banco do Brasil transfers, and IOF taxes" }
    },
    "trib_lucro": {
        it: { name: "Imposte sul Reddito (IRPJ, CSLL e IRRF)", desc: "Imposte federali sugli utili societari e ritenute IRRF sui fondi (Receita Federal)" },
        pt: { name: "Provisões Tributárias s/ Lucro (IRPJ, CSLL & IRRF)", desc: "Impostos federais sobre o lucro e retenções na fonte (Receita Federal do Brasil)" },
        fr: { name: "Provisions Fiscales sur Bénéfice (IRPJ, CSLL & IRRF)", desc: "Impôts fédéraux sur les bénéfices et retenues IRRF (Receita Federal du Brésil)" },
        en: { name: "Tax Provisions on Profits (IRPJ, CSLL & IRRF)", desc: "Federal corporate income taxes and withholding taxes (Receita Federal do Brasil)" }
    },
    "cessao": {
        it: { name: "Cessão de Crédito / Rimborso Finanziamento Soci", desc: "Uscita di cassa BB 2025 per rimborso parziale socio (in CRC riduce Passivo 2.2.1)" },
        pt: { name: "Cessão de Crédito / Amortização Mútuo Sócios", desc: "Saída de caixa BB em 2025 (na contabilidade CRC reduz Passivo 2.2.1)" },
        fr: { name: "Cession de Crédit / Remboursement Prêt d'Associé", desc: "Sortie de trésorerie BB 2025 (en comptabilité CRC réduit le Passif 2.2.1)" },
        en: { name: "Debt Assignment / Shareholder Loan Repayment", desc: "2025 BB cash outflow (under CRC accounting reduces Liability 2.2.1)" }
    },
    "lucro": {
        it: { name: "RISULTATO NETTO D'ESERCIZIO (CASSA BB / CRC)", desc: "Flusso netto di cassa Banco do Brasil (Excel Pivot cons) o Utile netto asseverato CRC" },
        pt: { name: "RESULTADO LÍQUIDO DO EXERCÍCIO (CAIXA BB / CRC)", desc: "Fluxo líquido de caixa Banco do Brasil (Excel Pivot cons) ou Lucro líquido CRC" },
        fr: { name: "RÉSULTAT NET DE L'EXERCICE (TRÉSORERIE BB / CRC)", desc: "Flux net de trésorerie Banco do Brasil (Excel Pivot cons) ou Bénéfice net CRC" },
        en: { name: "NET RESULT FOR THE PERIOD (BB CASH / CRC)", desc: "Banco do Brasil net cash flow (Excel Pivot cons) or certified CRC net profit" }
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

const BR_DETAIL_I18N = {
    // Balanço Patrimonial — Sub-accounts (19)
    "1.1.1.01.002": {
        it: { name: "Banco do Brasil S.A. - C/C 48649-3", nature: "Conto Corrente ordinario (Ag. 1066-9 Goianinha)", note: "2025 da Balanço CRC; 2026 saldo al 30/10/2026 da estratto Excel Banco do Brasil" },
        pt: { name: "Banco do Brasil S.A. - C/C 48649-3", nature: "Conta Corrente ordinária (Ag. 1066-9 Goianinha)", note: "2025 conforme Balanço CRC; 2026 saldo em 30/10/2026 do extrato Excel Banco do Brasil" },
        fr: { name: "Banco do Brasil S.A. - C/C 48649-3", nature: "Compte Courant ordinaire (Ag. 1066-9 Goianinha)", note: "2025 selon Bilan CRC ; 2026 solde au 30/10/2026 d'après relevé Excel Banco do Brasil" },
        en: { name: "Banco do Brasil S.A. - Checking Acc. 48649-3", nature: "Ordinary Checking Account (Branch 1066-9 Goianinha)", note: "2025 per CRC Balance Sheet; 2026 balance as of 30/10/2026 from Banco do Brasil Excel" }
    },
    "1.1.1.02.001": {
        it: { name: "BB Renda Fixa Simples LP", nature: "Fondo d'Investimento Monetario a Breve Termine", note: "Liquidità remunerata a rendimento CDI (+R$ 156.589,49 lordi, -R$ 18.614,73 IRRF, +R$ 23.713,78 netto versamenti/prelievi nel 2026)" },
        pt: { name: "BB Renda Fixa Simples LP", nature: "Fundo de Investimento Monetário de Curto Prazo", note: "Liquidez remunerada pelo CDI (+R$ 156.589,49 brutos, -R$ 18.614,73 IRRF, +R$ 23.713,78 líquido aplicações/resgates em 2026)" },
        fr: { name: "BB Renda Fixa Simples LP", nature: "Fonds de Placement Monétaire à Court Terme", note: "Liquidité rémunérée au taux CDI (+R$ 156.589,49 bruts, -R$ 18.614,73 IRRF, +R$ 23.713,78 solde net versements/rachats en 2026)" },
        en: { name: "BB Renda Fixa Simples LP", nature: "Short-Term Money Market Investment Fund", note: "CDI-linked cash reserve (+R$ 156,589.49 gross, -R$ 18,614.73 IRRF, +R$ 23,713.78 net subscriptions/redemptions in 2026)" }
    },
    "1.1.2.05.001": {
        it: { name: "Acconti a Fornitori", nature: "Yapay Pagamentos (2024) & C N Palaoro Eireli (2025-2026)", note: "Acconti a fornitori; nel 2026 nessuna variazione su C N Palaoro Eireli" },
        pt: { name: "Adiantamentos a Fornecedores", nature: "Yapay Pagamentos (2024) & C N Palaoro Eireli (2025-2026)", note: "Adiantamentos operacionais; sem movimentação em C N Palaoro Eireli em 2026" },
        fr: { name: "Avances aux Fournisseurs", nature: "Yapay Pagamentos (2024) & C N Palaoro Eireli (2025-2026)", note: "Avances versées aux fournisseurs ; aucun mouvement sur C N Palaoro Eireli en 2026" },
        en: { name: "Advances to Suppliers", nature: "Yapay Pagamentos (2024) & C N Palaoro Eireli (2025-2026)", note: "Supplier prepayments; no 2026 movement on C N Palaoro Eireli" }
    },
    "1.1.2.06.002": {
        it: { name: "Imposte da Compensare (IRRF / IRPJ)", nature: "Crediti tributari verso Receita Federal do Brasil (RFB)", note: "Crediti IRPJ/IRRF certificati 2025; ritenuta IRRF 2026 (R$ 18.614,73) spesata nel DRE provvisorio fino a chiusura ECF" },
        pt: { name: "Impostos a Compensar (IRRF / IRPJ)", nature: "Créditos tributários junto à Receita Federal do Brasil (RFB)", note: "Créditos IRPJ/IRRF certificados 2025; retenção IRRF 2026 (R$ 18.614,73) lançada no DRE provisório até fechamento ECF" },
        fr: { name: "Impôts à Compenser (IRRF / IRPJ)", nature: "Crédits d'impôt auprès de la Receita Federal do Brasil (RFB)", note: "Crédits IRPJ/IRRF certifiés 2025 ; retenue IRRF 2026 (R$ 18.614,73) enregistrée en charges DRE jusqu'à clôture ECF" },
        en: { name: "Tax Credits to Offset (IRRF / IRPJ)", nature: "Federal Tax Credits with Receita Federal do Brasil (RFB)", note: "Certified 2025 IRPJ/IRRF credits; 2026 IRRF withholding (R$ 18,614.73) expensed in provisional P&L pending year-end ECF" }
    },
    "1.1.2.08.001": {
        it: { name: "Dividendi e Utili da Incassare SCP (Locazione Resort)", nature: "J.M. Empreendimentos Imobiliários SCP", note: "Credito fine 2025 mantenuto provvisoriamente invariato; gli incassi 2026 (R$ 64.734,05 tra ago e ott) sono esposti in DRE 2026 alla voce Locazione/SCP" },
        pt: { name: "Dividendos e Lucros a Receber SCP (Locação Resort)", nature: "J.M. Empreendimentos Imobiliários SCP", note: "Saldo de 2025 mantido provisoriamente; recebimentos 2026 (R$ 64.734,05 ago-out) apresentados no DRE 2026 em Locação/SCP" },
        fr: { name: "Dividendes et Bénéfices à Recevoir SCP (Loyers Resort)", nature: "J.M. Empreendimentos Imobiliários SCP", note: "Créance fin 2025 maintenue provisoirement ; les encaissements 2026 (R$ 64.734,05 août-oct.) figurent en DRE 2026 sous Loyers/SCP" },
        en: { name: "Dividends & Profit Share Receivable SCP (Resort Lease)", nature: "J.M. Empreendimentos Imobiliários SCP", note: "End-2025 receivable kept unchanged provisionally; 2026 receipts (R$ 64,734.05 Aug-Oct) presented in 2026 DRE under Lease/SCP" }
    },
    "1.1.3.01.001": {
        it: { name: "Terreno Urbano Praia do Amor", nature: "Lotto 1.044,81 m² - Praia de Pipa / Tibau do Sul (RN)", note: "Valore d'acquisto e registrazione notarile al Catasto di Tibau do Sul" },
        pt: { name: "Terreno Urbano Praia do Amor", nature: "Lote 1.044,81 m² - Praia de Pipa / Tibau do Sul (RN)", note: "Valor histórico de aquisição e registro em cartório em Tibau do Sul" },
        fr: { name: "Terrain Urbain Praia do Amor", nature: "Parcelle 1.044,81 m² - Praia de Pipa / Tibau do Sul (RN)", note: "Valeur d'acquisition historique et enregistrement notarié à Tibau do Sul" },
        en: { name: "Urban Land Plot Praia do Amor", nature: "1,044.81 m² Lot - Praia de Pipa / Tibau do Sul (RN)", note: "Historical purchase cost and deed registration in Tibau do Sul" }
    },
    "1.1.3.02.001": {
        it: { name: "Complesso 09 Case/Ville Sombra Resort", nature: "Complesso Residenziale Turistico Sombra Resort Brasil", note: "Valore storico di conferimento di capitale e sviluppo edilizio del villaggio" },
        pt: { name: "Empreendimento 09 Casas/Villas Sombra Resort", nature: "Complexo Residencial Turístico Sombra Resort Brasil", note: "Valor histórico de integralização de capital e custo de construção" },
        fr: { name: "Complexe 09 Villas Sombra Resort", nature: "Complexe Touristique Résidentiel Sombra Resort Brasil", note: "Valeur historique d'apport en capital et coûts de développement immobilier" },
        en: { name: "09 Villas Development Sombra Resort", nature: "Sombra Resort Brasil Residential Hospitality Complex", note: "Historical capital contribution and construction development value" }
    },
    "1.2.1.01.001": {
        it: { name: "Partecipazione Societaria J.M. Empreendimentos SCP", nature: "Quota di partecipazione societaria", note: "Quota sociale nominale detenuta quale socio partecipante (sócio participante)" },
        pt: { name: "Participação Societária J.M. Empreendimentos SCP", nature: "Cota de participação societária", note: "Participação nominal detida como sócio participante na SCP" },
        fr: { name: "Participation Sociétaire J.M. Empreendimentos SCP", nature: "Quote-part de participation sociétaire", note: "Participation nominale détenue en qualité d'associé commanditaire (sócio participante)" },
        en: { name: "Equity Stake in J.M. Empreendimentos SCP", nature: "Partnership equity quota", note: "Nominal stake held as silent partner (sócio participante)" }
    },
    "1.2.1.02.001": {
        it: { name: "Equivalenza Patrimoniale SCP", nature: "Rivalutazione a Patrimonio Netto quota SCP", note: "Adeguamento equivalenza patrimoniale SCP al 31/12/2025" },
        pt: { name: "Equivalência Patrimonial SCP", nature: "Avaliação pelo Método da Equivalência Patrimonial (MEP)", note: "Ajuste de equivalência patrimonial da SCP em 31/12/2025" },
        fr: { name: "Mise en Équivalence SCP", nature: "Réévaluation par mise en équivalence de la quote-part SCP", note: "Ajustement de mise en équivalence SCP au 31/12/2025" },
        en: { name: "Equity Method Adjustment SCP", nature: "Equity-method carrying adjustment for SCP stake", note: "Equity-method valuation adjustment as of 31/12/2025" }
    },
    "1.2.2.01.001": {
        it: { name: "Mobili e Arredi d'Ufficio (Netto)", nature: "Cespiti materiali al netto ammortamenti (R$ 7.425,04 - R$ 794,33)", note: "Arredi acquistati nel 2025 (valore netto contabile invariato in attesa ammortamento fine 2026)" },
        pt: { name: "Móveis e Utensílios de Escritório (Líquido)", nature: "Imobilizado líquido de depreciação (R$ 7.425,04 - R$ 794,33)", note: "Móveis adquiridos em 2025 (valor contábil mantido até depreciação de encerramento 2026)" },
        fr: { name: "Mobilier et Équipements de Bureau (Net)", nature: "Immobilisations corporelles nettes d'amortissement (R$ 7.425,04 - R$ 794,33)", note: "Mobilier acquis en 2025 (valeur nette maintenue avant amortissement annuel 2026)" },
        en: { name: "Office Furniture & Fixtures (Net)", nature: "Property & Equipment net of depreciation (R$ 7,425.04 - R$ 794.33)", note: "Furniture acquired in 2025 (net book value held pending 2026 year-end depreciation)" }
    },
    "2.1.1.01.001": {
        it: { name: "Fornitori Nazionali di Beni e Servizi", nature: "Elenice Soares (2024), JJ Assessoria & LRT Soluções (2025)", note: "Saldo chiusura 2025 (R$ 2.224,00) mantenuto invariato nel provvisorio 2026; i pagamenti Gestão Empresarial gen-ott (R$ 23.767,31) sono esposti integralmente in DRE 3.2.1.01.010" },
        pt: { name: "Fornecedores Nacionais de Bens e Serviços", nature: "Elenice Soares (2024), JJ Assessoria & LRT Soluções (2025)", note: "Saldo final 2025 (R$ 2.224,00) mantido no balanço provisório 2026; os pagamentos de Gestão Empresarial jan-out (R$ 23.767,31) constam integralmente no DRE 3.2.1.01.010" },
        fr: { name: "Fournisseurs Nationaux de Biens et Services", nature: "Elenice Soares (2024), JJ Assessoria & LRT Soluções (2025)", note: "Solde clôture 2025 (R$ 2.224,00) maintenu au bilan provisoire 2026 ; les paiements Gestão Empresarial janv.-oct. (R$ 23.767,31) sont comptabilisés en totalité en DRE 3.2.1.01.010" },
        en: { name: "Domestic Suppliers of Goods & Services", nature: "Elenice Soares (2024), JJ Assessoria & LRT Soluções (2025)", note: "Closing 2025 balance (R$ 2,224.00) retained in provisional 2026 Balance Sheet; full Gestão Empresarial Jan-Oct payments (R$ 23,767.31) are recorded in DRE 3.2.1.01.010" }
    },
    "2.1.2.01.002": {
        it: { name: "CSLL da Versare (Tributi sul Reddito)", nature: "Receita Federal do Brasil (RFB)", note: "Imposta CSLL da versare riportata da chiusura 2025" },
        pt: { name: "CSLL a Recolher (Tributos sobre o Lucro)", nature: "Receita Federal do Brasil (RFB)", note: "Obrigação fiscal CSLL reportada do encerramento de 2025" },
        fr: { name: "CSLL à Payer (Impôts sur les Bénéfices)", nature: "Receita Federal do Brasil (RFB)", note: "Dette fiscale CSLL reportée de la clôture 2025" },
        en: { name: "CSLL Payable (Corporate Income Tax)", nature: "Receita Federal do Brasil (RFB)", note: "CSLL tax liability carried forward from 2025 closing" }
    },
    "2.1.2.03.001": {
        it: { name: "Imposte Federali Differite su Applicazioni", nature: "IRPJ (R$ 44.925,79) e CSLL (R$ 26.955,46) al 31/12/2025", note: "Fondo imposte differite sui rendimenti BB RF da chiusura ufficiale 2025" },
        pt: { name: "Tributos Federais Diferidos s/ Aplicações", nature: "IRPJ (R$ 44.925,79) e CSLL (R$ 26.955,46) em 31/12/2025", note: "Passivo fiscal diferido sobre rendimentos BB RF do balanço oficial 2025" },
        fr: { name: "Impôts Fédéraux Différés sur Placements", nature: "IRPJ (R$ 44.925,79) et CSLL (R$ 26.955,46) au 31/12/2025", note: "Provision d'impôts différés sur rendements BB RF issue de la clôture officielle 2025" },
        en: { name: "Deferred Federal Taxes on Investments", nature: "IRPJ (R$ 44,925.79) & CSLL (R$ 26,955.46) as of 31/12/2025", note: "Deferred tax liability on BB RF yields from audited 2025 closing" }
    },
    "2.1.3.01.001": {
        it: { name: "Parti Correlate Intercompany", nature: "J.M. Empreendimentos Imobiliários SCP", note: "Saldo intercompany regolato e compensato nell'esercizio 2025" },
        pt: { name: "Intercompany Partes Relacionadas", nature: "J.M. Empreendimentos Imobiliários SCP", note: "Saldo intercompany quitado e compensado no exercício de 2025" },
        fr: { name: "Comptes Intercompany Parties Liées", nature: "J.M. Empreendimentos Imobiliários SCP", note: "Solde intercompany réglé et compensé au cours de l'exercice 2025" },
        en: { name: "Related Parties Intercompany", nature: "J.M. Empreendimentos Imobiliários SCP", note: "Intercompany payable settled and offset during fiscal year 2025" }
    },
    "2.2.1.01.001": {
        it: { name: "Finanziamento / Mutuo Soci Esteri", nature: "Sombra e Agua Fresca Resort S.à r.l. (RCS B263295)", note: "Ridotto di R$ 62.000 nel dic 2025 (cessione credito Franco Toscano); invariato nel 2026" },
        pt: { name: "Financiamento / Mútuo de Sócios Estrangeiros", nature: "Sombra e Agua Fresca Resort S.à r.l. (RCS B263295)", note: "Reduzido em R$ 62.000 em dez/2025 (cessão de crédito Franco Toscano); inalterado em 2026" },
        fr: { name: "Prêt / Compte Courant d'Associés Étrangers", nature: "Sombra e Agua Fresca Resort S.à r.l. (RCS B263295)", note: "Réduit de R$ 62.000 en déc. 2025 (cession créance Franco Toscano) ; inchangé en 2026" },
        en: { name: "Foreign Shareholder Loan", nature: "Sombra e Agua Fresca Resort S.à r.l. (RCS B263295)", note: "Reduced by R$ 62,000 in Dec 2025 (Franco Toscano debt assignment); unchanged in 2026" }
    },
    "2.3.1.01.001": {
        it: { name: "Sombra e Agua Fresca Resort S.à r.l.", nature: "Lussemburgo (RCS B263295) - 3.000.525 quote (100%)", note: "Capitale sociale interamente versato registrato RDE-IED presso Banco Central do Brasil" },
        pt: { name: "Sombra e Agua Fresca Resort S.à r.l.", nature: "Luxemburgo (RCS B263295) - 3.000.525 cotas (100%)", note: "Capital social totalmente integralizado com registro RDE-IED no Banco Central do Brasil" },
        fr: { name: "Sombra e Agua Fresca Resort S.à r.l.", nature: "Luxembourg (RCS B263295) - 3.000.525 parts sociales (100%)", note: "Capital social entièrement libéré enregistré RDE-IED auprès de la Banque Centrale du Brésil" },
        en: { name: "Sombra e Agua Fresca Resort S.à r.l.", nature: "Luxembourg (RCS B263295) - 3,000,525 shares (100%)", note: "Fully paid-in share capital registered under RDE-IED with Central Bank of Brazil" }
    },
    "2.3.2.01.001": {
        it: { name: "Saldo Precedente Utili Accumulati", nature: "Utili di esercizi precedenti riportati a nuovo", note: "Riserva utili accumulati all'inizio di ciascun esercizio contabile" },
        pt: { name: "Saldo Anterior de Lucros Acumulados", nature: "Lucros de exercícios anteriores acumulados", note: "Saldo inicial de reserva de lucros no início de cada exercício" },
        fr: { name: "Report à Nouveau Bénéficiaire (Solde Initial)", nature: "Bénéfices des exercices antérieurs reportés à nouveau", note: "Réserve de bénéfices accumulés à l'ouverture de chaque exercice comptable" },
        en: { name: "Opening Retained Earnings Balance", nature: "Accumulated profits brought forward from prior years", note: "Opening retained earnings reserve at the start of each fiscal year" }
    },
    "2.3.2.01.002": {
        it: { name: "Utile Netto Rilevato nell'Esercizio", nature: "Risultato netto da DRE (2024-2025 CRC; 2026 YTD al 31/10 Excel BB)", note: "2024-2025 asseverati CRC; 2026 provvisorio gen-ott da movimenti bancari Excel BB (incl. R$ 64.734,05 locazione/SCP)" },
        pt: { name: "Lucro Líquido Apurado no Exercício", nature: "Resultado líquido do DRE (2024-2025 CRC; 2026 YTD 31/10 Excel BB)", note: "2024-2025 certificados CRC; 2026 provisório jan-out da movimentação bancária Excel BB (incl. R$ 64.734,05 locação/SCP)" },
        fr: { name: "Bénéfice Net Constaté de l'Exercice", nature: "Résultat net du DRE (2024-2025 CRC ; 2026 YTD au 31/10 Excel BB)", note: "2024-2025 certifiés CRC ; 2026 provisoire janv.-oct. selon flux bancaires Excel BB (dont R$ 64.734,05 loyers/SCP)" },
        en: { name: "Net Profit Recognized for the Period", nature: "Net income per DRE (2024-2025 CRC; 2026 YTD Oct 31 Excel BB)", note: "2024-2025 CRC audited; 2026 provisional Jan-Oct per Banco do Brasil Excel (incl. R$ 64,734.05 lease/SCP)" }
    },
    "2.3.2.01.003": {
        it: { name: "Distribuzioni, Destinazioni e Rettifiche SCP", nature: "Rettifiche e compensazioni patrimoniali approvate", note: "Rettifica contabile 2025 su saldi SCP/riserve; nessuna distribuzione nel 2026" },
        pt: { name: "Distribuições, Destinações e Ajustes SCP", nature: "Ajustes e compensações patrimoniais aprovadas", note: "Ajuste contábil em 2025 sobre saldos SCP/reservas; sem distribuições em 2026" },
        fr: { name: "Distributions, Affectations et Ajustements SCP", nature: "Ajustements et compensations de capitaux propres approuvés", note: "Régularisation comptable 2025 sur soldes SCP/réserves ; aucune distribution en 2026" },
        en: { name: "Distributions, Allocations & SCP Adjustments", nature: "Approved equity adjustments and compensations", note: "2025 accounting adjustment on SCP balances/reserves; no distributions in 2026" }
    },
    // DRE — Sub-accounts (22)
    "3.1.1.01.001": {
        it: { name: "Vendita Unità Immobiliari", nature: "Vendita diretta unità abitative Sombra Resort", note: "Nessuna compravendita immobiliare nel periodo; i proventi di locazione del Resort transitano dalla SCP (voce 3.1.3)" },
        pt: { name: "Vendas de Unidades Imobiliárias", nature: "Venda direta de unidades habitacionais Sombra Resort", note: "Nenhuma venda de imóveis no período; as receitas de locação do Resort transitam via SCP (rubrica 3.1.3)" },
        fr: { name: "Ventes d'Unités Immobilières", nature: "Vente directe de villas/logements Sombra Resort", note: "Aucune cession immobilière sur la période ; les revenus locatifs du Resort transitent via SCP (poste 3.1.3)" },
        en: { name: "Sales of Real Estate Units", nature: "Direct sale of Sombra Resort residential units", note: "No real estate unit sales in the period; Resort lease revenues flow through SCP (line 3.1.3)" }
    },
    "3.1.2.01.001": {
        it: { name: "Proventi Finanziari - Applicazioni BB RF Simples", nature: "Fondo d'Investimento BB Renda Fixa Simples LP", note: "2026: Somma dei 10 rendimenti lordi mensili (gen-ott 2026) da Conto Investimento Excel BB" },
        pt: { name: "Receita Financeira - Aplicações BB RF Simples", nature: "Fundo de Investimento BB Renda Fixa Simples LP", note: "2026: Soma dos 10 rendimentos brutos mensais (jan-out 2026) da Conta Investimento Excel BB" },
        fr: { name: "Produits Financiers - Placements BB RF Simples", nature: "Fonds de Placement BB Renda Fixa Simples LP", note: "2026 : Somme des 10 rendements mensuels bruts (janv.-oct. 2026) du Compte Investissement Excel BB" },
        en: { name: "Financial Income - BB RF Simples Fund", nature: "BB Renda Fixa Simples LP Investment Fund", note: "2026: Sum of 10 monthly gross yields (Jan-Oct 2026) from Banco do Brasil Investment Excel" }
    },
    "3.1.2.01.002": {
        it: { name: "Interessi Attivi e Proventi Accessori", nature: "Interessi attivi bancari maturati su giacenze", note: "Interessi attivi bancari ordinari" },
        pt: { name: "Juros Ativos & Proventos Acessórios", nature: "Juros bancários recebidos sobre disponibilidades", note: "Rendimento de juros bancários ordinários" },
        fr: { name: "Intérêts Créditeurs & Produits Accessoires", nature: "Intérêts bancaires perçus sur liquidités", note: "Intérêts créditeurs bancaires ordinaires" },
        en: { name: "Interest Income & Ancillary Returns", nature: "Bank interest earned on cash balances", note: "Ordinary bank interest earnings" }
    },
    "3.1.2.01.003": {
        it: { name: "Variazione Monetaria Attiva", nature: "Rettifiche valutarie e rivalutazioni monetarie attive", note: "Rettifiche attive di cambio e oscillazioni monetarie" },
        pt: { name: "Variação Monetária Ativa", nature: "Atualizações monetárias e variações cambiais ativas", note: "Ajustes positivos de variação cambial e monetária" },
        fr: { name: "Variation Monétaire Active", nature: "Ajustements de change et actualisations monétaires positives", note: "Écarts de conversion positifs et réévaluations monétaires" },
        en: { name: "Positive Monetary Variation", nature: "Foreign exchange gains & monetary restatements", note: "Positive currency exchange and monetary restatement gains" }
    },
    "3.1.3.01.001": {
        it: { name: "Locazione Resort / Risultato Positivo SCP", nature: "Canoni di affitto Hotel Sombra liquidati tramite SCP (Sócio Participante)", note: "2025 Cassa BB: R$ 617.509,26 (07/02: R$ 258.299,87 • 13/10: R$ 150.000,00 • 15/12: R$ 209.209,39) | CRC 2025: R$ 64.734,04 residuo a DRE | 2026: R$ 64.734,05" },
        pt: { name: "Locação Resort / Resultado Positivo SCP", nature: "Aluguéis do Hotel Sombra recebidos via SCP (Sócio Participante)", note: "2025 Caixa BB: R$ 617.509,26 (07/02: R$ 258.299,87 • 13/10: R$ 150.000,00 • 15/12: R$ 209.209,39) | CRC 2025: R$ 64.734,04 em DRE | 2026: R$ 64.734,05" },
        fr: { name: "Loyers Resort / Résultat Positif SCP", nature: "Loyers de l'Hôtel Sombra perçus en tant qu'associé SCP (Sócio Participante)", note: "2025 Caisse BB : R$ 617.509,26 (07/02 : 258.299,87 • 13/10 : 150.000,00 • 15/12 : 209.209,39) | CRC 2025 : R$ 64.734,04 au DRE | 2026 : R$ 64.734,05" },
        en: { name: "Resort Lease / Positive SCP Share", nature: "Sombra Hotel lease remuneration collected via SCP (Sócio Participante)", note: "2025 BB Cash: R$ 617,509.26 (07/02: 258,299.87 • 13/10: 150,000.00 • 15/12: 209,209.39) | CRC 2025: R$ 64,734.04 accrued | 2026: R$ 64,734.05" }
    },
    "3.2.1.01.002": {
        it: { name: "Notai, Certificati e Registri", nature: "Cartório Notarile di Tibau do Sul e Goianinha", note: "Certificati di vigenza societaria, autentiche e atti notarili" },
        pt: { name: "Cartórios, Certidões e Registros", nature: "Cartório de Tibau do Sul e Goianinha", note: "Certidões societárias, autenticações e atos notariais" },
        fr: { name: "Notaires, Certificats et Registres", nature: "Étude Notariale de Tibau do Sul et Goianinha", note: "Extraits K-bis/certificats, légalisations et actes notariés" },
        en: { name: "Notary Offices, Certificates & Filings", nature: "Notary Offices of Tibau do Sul & Goianinha", note: "Corporate good-standing certificates, notarizations, and deeds" }
    },
    "3.2.1.01.005": {
        it: { name: "Manutenzione / Licenze Software", nature: "Licenze informatiche, domini e sistemi gestionali", note: "Piattaforme di sicurezza, gestione documentale cloud e servizi web" },
        pt: { name: "Manutenção / Licença de Software", nature: "Licenças de TI, domínios e sistemas de gestão", note: "Plataformas de segurança, gestão documental em nuvem e serviços web" },
        fr: { name: "Maintenance / Licences Logicielles", nature: "Licences informatiques, domaines et systèmes de gestion", note: "Plateformes de sécurité, gestion documentaire cloud et services web" },
        en: { name: "Software Maintenance & Licensing", nature: "IT licenses, domains, and management software", note: "Security platforms, cloud document management, and web services" }
    },
    "3.2.1.01.008": {
        it: { name: "Servizi PJ e Domiciliazione Sede (Varie)", nature: "Consulenze PJ e domiciliazione sede (Varias)", note: "2026: Seahub (-R$ 935,39). 2025 Cassa BB: ONE Domiciliazione (-898,20), C N Palaoro (-13.337,99), Nu (-88,25), storno Global Tech (+6.764,79)" },
        pt: { name: "Serviços Prestados PJ & Domiciliação (Várias)", nature: "Consultorias PJ e domiciliação fiscal (Várias)", note: "2026: Seahub (-R$ 935,39). 2025 Caixa BB: ONE Domiciliação (-898,20), C N Palaoro (-13.337,99), Nu (-88,25), estorno Global Tech (+6.764,79)" },
        fr: { name: "Services PJ & Domiciliation du Siège (Divers)", nature: "Prestations PJ et domiciliation (Frais Divers)", note: "2026 : Seahub (-R$ 935,39). 2025 Caisse BB : ONE Domiciliation (-898,20), C N Palaoro (-13.337,99), Nu (-88,25), annulation Global Tech (+6.764,79)" },
        en: { name: "PJ Corporate Services & Registered Office (Misc.)", nature: "Corporate services & registered address (Misc.)", note: "2026: Seahub (-R$ 935.39). 2025 BB Cash: ONE Office (-898.20), C N Palaoro (-13,337.99), Nu (-88.25), Global Tech reversal (+6,764.79)" }
    },
    "3.2.1.01.009": {
        it: { name: "Servizi di Terzi e Manutenzione (Varie)", nature: "Servizi operativi esterni (Varias)", note: "2026: Art Korten Design (-R$ 2.313,00). 2025 Cassa BB: Comercial Dist. Natal (-R$ 4.809,38) + Magnolia (-R$ 4.800,00)" },
        pt: { name: "Serviços de Terceiros & Manutenção (Várias)", nature: "Serviços externos e fornecimentos (Várias)", note: "2026: Art Korten Design (-R$ 2.313,00). 2025 Caixa BB: Comercial Dist. Natal (-R$ 4.809,38) + Magnolia (-R$ 4.800,00)" },
        fr: { name: "Prestations de Tiers & Maintenance (Divers)", nature: "Prestataires externes et fournitures (Frais Divers)", note: "2026 : Art Korten Design (-R$ 2.313,00). 2025 Caisse BB : Comercial Dist. Natal (-R$ 4.809,38) + Magnolia (-R$ 4.800,00)" },
        en: { name: "Third-Party Services & Maintenance (Misc.)", nature: "External services & supplies (Misc.)", note: "2026: Art Korten Design (-R$ 2,313.00). 2025 BB Cash: Comercial Dist. Natal (-R$ 4,809.38) + Magnolia (-R$ 4,800.00)" }
    },
    "3.2.1.01.010": {
        it: { name: "Onorari Contabili e Gestione Aziendale (Gestão Empresarial)", nature: "Essencial/LRT Soluções & JJ Assessoria Contábil", note: "2025 Cassa BB: -R$ 15.610,00 (CRC: -R$ 9.178,00) • 2026 Cassa BB: -R$ 23.767,31" },
        pt: { name: "Honorários Contábeis & Gestão Empresarial", nature: "Essencial/LRT Soluções & JJ Assessoria Contábil", note: "2025 Caixa BB: -R$ 15.610,00 (CRC: -R$ 9.178,00) • 2026 Caixa BB: -R$ 23.767,31" },
        fr: { name: "Honoraires Comptables & Gestion d'Entreprise (Gestão Empresarial)", nature: "Essencial/LRT Soluções & JJ Assessoria Contábil", note: "2025 Caisse BB : -R$ 15.610,00 (CRC : -R$ 9.178,00) • 2026 Caisse BB : -R$ 23.767,31" },
        en: { name: "Accounting & Business Management Fees (Gestão Empresarial)", nature: "Essencial/LRT Soluções & JJ Assessoria Contábil", note: "2025 BB Cash: -R$ 15,610.00 (CRC: -R$ 9,178.00) • 2026 BB Cash: -R$ 23,767.31" }
    },
    "3.2.1.02.001": {
        it: { name: "Materiale di Manutenzione e Riparazioni", nature: "Opere di custodia ordinaria e fornitura materiali", note: "2024 Cassa BB: L&M Costruzioni + Mac Madeira (-R$ 7.621,60); 2025 CRC: -R$ 4.657,97" },
        pt: { name: "Material de Manutenção e Reparo", nature: "Obras de conservação ordinária e materiais", note: "2024 Caixa BB: L&M Construção + Mac Madeira (-R$ 7.621,60); 2025 CRC: -R$ 4.657,97" },
        fr: { name: "Fournitures d'Entretien et Réparations", nature: "Travaux d'entretien courant et matériaux", note: "2024 Caisse BB : L&M Construção + Mac Madeira (-R$ 7.621,60) ; 2025 CRC : -R$ 4.657,97" },
        en: { name: "Maintenance & Repair Supplies", nature: "Routine asset upkeep and construction supplies", note: "2024 BB Cash: L&M Construção + Mac Madeira (-R$ 7,621.60); 2025 CRC: -R$ 4,657.97" }
    },
    "3.2.1.02.002": {
        it: { name: "Mobili Casa H (Importazione Butzke)", nature: "Acquisto arredi Casa H (in CRC capitalizzato nell'Imobilizado 1.2.2)", note: "2025 Cassa BB: 3 bonifici Butzke Importação (-R$ 2.498,14 • -R$ 2.480,79 • -R$ 2.503,91 = -R$ 7.482,84)" },
        pt: { name: "Móveis Casa H (Importação Butzke)", nature: "Aquisição de móveis Casa H (no Balanço CRC capitalizado em 1.2.2)", note: "2025 Caixa BB: 3 remessas Butzke Importação (-R$ 2.498,14 • -R$ 2.480,79 • -R$ 2.503,91 = -R$ 7.482,84)" },
        fr: { name: "Mobilier Casa H (Importation Butzke)", nature: "Acquisition mobilier Casa H (immobilisé au bilan CRC en 1.2.2)", note: "2025 Caisse BB : 3 paiements Butzke Importação (-R$ 2.498,14 • -R$ 2.480,79 • -R$ 2.503,91 = -R$ 7.482,84)" },
        en: { name: "Casa H Furniture (Butzke Import)", nature: "Casa H furniture purchases (capitalized under 1.2.2 in CRC Balance Sheet)", note: "2025 BB Cash: 3 Butzke Importação transfers (-R$ 2,498.14 • -R$ 2,480.79 • -R$ 2,503.91 = -R$ 7,482.84)" }
    },
    "3.2.1.03.001": {
        it: { name: "Ammortamenti e Svalutazioni", nature: "Ammortamento attrezzature e arredi", note: "Quota ammortamento 2025 (2026 da contabilizzare a chiusura esercizio)" },
        pt: { name: "Depreciação & Amortizações", nature: "Depreciação de móveis e utensílios", note: "Cota de depreciação 2025 (2026 a ser apurada no fechamento anual)" },
        fr: { name: "Dotations aux Amortissements", nature: "Amortissement du mobilier et des équipements", note: "Dotation aux amortissements 2025 (2026 comptabilisée à la clôture annuelle)" },
        en: { name: "Depreciation & Amortization", nature: "Depreciation of office furniture and fixtures", note: "2025 depreciation charge (2026 to be recorded at year-end close)" }
    },
    "3.2.2.01.001": {
        it: { name: "Imposte e Tasse Municipali", nature: "Prefettura Municipale di Natal / Tibau do Sul (RN)", note: "Cassa BB: 2024 Taxas 2023+2024 (-R$ 817,60), 2025 (-R$ 378,61), 2026 (-R$ 398,75)" },
        pt: { name: "Impostos e Taxas Municipais", nature: "Prefeitura Municipal de Natal / Tibau do Sul (RN)", note: "Caixa BB: 2024 Taxas 2023+2024 (-R$ 817,60), 2025 (-R$ 378,61), 2026 (-R$ 398,75)" },
        fr: { name: "Impôts et Taxes Municipales", nature: "Municipalité de Natal / Tibau do Sul (RN)", note: "Caisse BB : 2024 Taxes 2023+2024 (-R$ 817,60), 2025 (-R$ 378,61), 2026 (-R$ 398,75)" },
        en: { name: "Municipal Taxes & Operating Fees", nature: "Municipality of Natal / Tibau do Sul (RN)", note: "BB Cash: 2024 Fees 2023+2024 (-R$ 817.60), 2025 (-R$ 378.61), 2026 (-R$ 398.75)" }
    },
    "3.2.2.01.003": {
        it: { name: "Sanzioni Fiscali e Ravvedimenti", nature: "Receita Federal / Enti Locali", note: "Sanzioni estinte nel 2024 (CRC); nessuna sanzione nel 2025 e 2026" },
        pt: { name: "Multas Fiscais e Encargos", nature: "Receita Federal / Órgãos Municipais", note: "Multas quitadas em 2024 (CRC); sem autuações em 2025 e 2026" },
        fr: { name: "Pénalités Fiscales et Régularisations", nature: "Receita Federal / Collectivités Locales", note: "Pénalités apurées en 2024 (CRC) ; aucune amende en 2025 ni en 2026" },
        en: { name: "Tax Penalties & Late Fees", nature: "Receita Federal / Municipal Authorities", note: "Penalties cleared in 2024 (CRC); zero penalties in 2025 and 2026" }
    },
    "3.2.3.01.001": {
        it: { name: "Commissioni Bancarie (Tariffe BB)", nature: "Canoni tenuta conto Banco do Brasil (4x81,40 + 6x93,10 nel 2026)", note: "Estratto Excel BB: 2024 (-R$ 729,00) • 2025 (-R$ 925,60) • 2026 (-R$ 884,20)" },
        pt: { name: "Despesas Bancárias (Tarifas BB)", nature: "Tarifas de manutenção de conta Banco do Brasil", note: "Extrato Excel BB: 2024 (-R$ 729,00) • 2025 (-R$ 925,60) • 2026 (-R$ 884,20)" },
        fr: { name: "Frais Bancaires (Tarifs Banco do Brasil)", nature: "Frais de tenue de compte Banco do Brasil", note: "Relevé Excel BB : 2024 (-R$ 729,00) • 2025 (-R$ 925,60) • 2026 (-R$ 884,20)" },
        en: { name: "Bank Charges (Banco do Brasil Fees)", nature: "BB account service packages", note: "BB Excel statement: 2024 (-R$ 729.00) • 2025 (-R$ 925.60) • 2026 (-R$ 884.20)" }
    },
    "3.2.3.02.001": {
        it: { name: "Interessi, Commissioni Passive e IOF", nature: "Imposta sulle operazioni finanziarie (IOF) e oneri", note: "IOF e oneri accessori rilevati nella contabilità CRC 2024-2025" },
        pt: { name: "Juros Passivos & IOF", nature: "Imposto sobre Operações Financeiras (IOF) e encargos", note: "IOF e encargos registrados na contabilidade CRC 2024-2025" },
        fr: { name: "Intérêts Débiteurs & Taxe IOF", nature: "Impôt sur les Opérations Financières (IOF) et frais annexes", note: "IOF et frais comptabilisés en comptabilité CRC 2024-2025" },
        en: { name: "Interest Expense & IOF Tax", nature: "Financial Transaction Tax (IOF) & charges", note: "IOF tax and ancillary charges booked under CRC accounting 2024-2025" }
    },
    "3.2.4.01.001": {
        it: { name: "IRPJ / IRRF Ritenuta alla Fonte (BB RF)", nature: "CRC: Accantonamento IRPJ | Cassa BB: IRRF sul Fondo RF", note: "IRRF trattenuto da BB (2024: -R$ 16.073,35 • 2025: -R$ 25.469,15 • 2026: -R$ 18.614,73)" },
        pt: { name: "IRPJ / IRRF Retido na Fonte (BB RF)", nature: "CRC: Provisão IRPJ | Caixa BB: IRRF no Fundo RF", note: "IRRF retido pelo BB (2024: -R$ 16.073,35 • 2025: -R$ 25.469,15 • 2026: -R$ 18.614,73)" },
        fr: { name: "IRPJ / IRRF Retenu à la Source (BB RF)", nature: "CRC : Provision IRPJ | Caisse BB : IRRF sur Fonds RF", note: "IRRF prélevé par BB (2024 : -R$ 16.073,35 • 2025 : -R$ 25.469,15 • 2026 : -R$ 18.614,73)" },
        en: { name: "IRPJ / IRRF Withholding Tax (BB RF)", nature: "CRC: IRPJ Provision | BB Cash: IRRF withheld on RF Fund", note: "IRRF withheld by BB (2024: -R$ 16,073.35 • 2025: -R$ 25,469.15 • 2026: -R$ 18,614.73)" }
    },
    "3.2.4.01.002": {
        it: { name: "Accantonamento CSLL (Contributo Sociale sugli Utili)", nature: "Receita Federal do Brasil (aliquota 9%)", note: "Contributo sociale calcolato a chiusura d'esercizio dal commercialista CRC" },
        pt: { name: "Provisão para CSLL (Contribuição Social s/ Lucro)", nature: "Receita Federal do Brasil (9% sobre base tributável)", note: "Contribuição social apurada no encerramento do exercício pelo contador CRC" },
        fr: { name: "Provision pour CSLL (Contribution Sociale sur Bénéfice)", nature: "Receita Federal do Brasil (9 % assiette fiscale)", note: "Contribution sociale calculée à la clôture annuelle par le comptable CRC" },
        en: { name: "CSLL Tax Provision (Social Contribution on Net Profit)", nature: "Receita Federal do Brasil (9% taxable base)", note: "Social contribution calculated at fiscal year-end by CRC accountant" }
    },
    "3.2.5.01.001": {
        it: { name: "Cessão de Crédito (Franco Toscano)", nature: "Rimborso parziale Mutuo Sombra e Agua Fresca S.à r.l.", note: "2025 Cassa BB (Pivot cons): -R$ 62.000,00 (03-05/12/2025). In CRC riduce Passivo Não Circulante 2.2.1 da R$ 700k a R$ 638k" },
        pt: { name: "Cessão de Crédito (Franco Toscano)", nature: "Amortização parcial de mútuo com Sombra e Agua Fresca S.à r.l.", note: "2025 Caixa BB (Pivot cons): -R$ 62.000,00 (03-05/12/2025). No Balanço CRC reduz o Passivo 2.2.1 de R$ 700k para R$ 638k" },
        fr: { name: "Cession de Crédit (Franco Toscano)", nature: "Remboursement partiel du prêt Sombra e Agua Fresca S.à r.l.", note: "2025 Caisse BB (Pivot cons) : -R$ 62.000,00 (03-05/12/2025). En CRC réduit le Passif 2.2.1 de R$ 700k à R$ 638k" },
        en: { name: "Debt Assignment (Franco Toscano)", nature: "Partial repayment of loan from Sombra e Agua Fresca S.à r.l.", note: "2025 BB Cash (Pivot cons): -R$ 62,000.00 (03-05/12/2025). Reduces Non-Current Liability 2.2.1 from R$ 700k to R$ 638k under CRC" }
    },
    "3.3.01": {
        it: { name: "Totale Ricavi e Proventi d'Esercizio", nature: "Somma ricavi locazione SCP e proventi finanziari BB RF", note: "Cassa BB = Totale ENTRADAS Pivot cons (2025: R$ 617.509,26 locazione + R$ 135.991,31 juros; 2026: R$ 64.734,05 + R$ 156.589,49)" },
        pt: { name: "Total de Receitas e Rendimentos do Exercício", nature: "Soma de receitas de locação SCP e rendimentos financeiros BB RF", note: "Caixa BB = Total ENTRADAS Pivot cons (2025: R$ 617.509,26 locação + R$ 135.991,31 juros; 2026: R$ 64.734,05 + R$ 156.589,49)" },
        fr: { name: "Total des Revenus et Produits de l'Exercice", nature: "Somme des loyers SCP et produits financiers BB RF", note: "Caisse BB = Total ENTRADAS Pivot cons (2025 : R$ 617.509,26 loyers + R$ 135.991,31 intérêts ; 2026 : R$ 64.734,05 + R$ 156.589,49)" },
        en: { name: "Total Revenues & Income for the Period", nature: "Sum of SCP lease income and BB RF financial returns", note: "BB Cash = Total ENTRADAS Pivot cons (2025: R$ 617,509.26 lease + R$ 135,991.31 interest; 2026: R$ 64,734.05 + R$ 156,589.49)" }
    },
    "3.3.02": {
        it: { name: "(-) Totale Costi, Oneri, Imposte & Uscite BB", nature: "Somma spese generali, tributi, oneri bancari, imposte (e Cessão in vista cassa)", note: "Cassa BB = Totale SAIDAS Pivot cons (2024: -R$ 39.095,42 • 2025: -R$ 129.688,23 • 2026: -R$ 46.913,38)" },
        pt: { name: "(-) Total de Custos, Despesas e Saídas BB", nature: "Soma de despesas gerais, tributos, tarifas bancárias, impostos e cessão BB", note: "Caixa BB = Total SAIDAS Pivot cons (2024: -R$ 39.095,42 • 2025: -R$ 129.688,23 • 2026: -R$ 46.913,38)" },
        fr: { name: "(-) Total des Coûts, Charges et Sorties BB", nature: "Somme frais généraux, taxes, frais bancaires, impôts et cession BB", note: "Caisse BB = Total SAIDAS Pivot cons (2024 : -R$ 39.095,42 • 2025 : -R$ 129.688,23 • 2026 : -R$ 46.913,38)" },
        en: { name: "(-) Total Costs, Expenses & BB Outflows", nature: "Sum of general expenses, taxes, bank fees, withholding tax & cessão", note: "BB Cash = Total SAIDAS Pivot cons (2024: -R$ 39,095.42 • 2025: -R$ 129,688.23 • 2026: -R$ 46,913.38)" }
    },
    "3.3.03": {
        it: { name: "Risultato Operativo / Ante Imposte (LAIR)", nature: "Risultato lordo prima di IRPJ, CSLL/IRRF e rimborsi soci", note: "Margine lordo operativo prima delle ritenute IRRF/IRPJ/CSLL (e Cessão -62k in cassa 2025)" },
        pt: { name: "Resultado Operacional / Antes dos Tributos (LAIR)", nature: "Lucro bruto antes de IRPJ, CSLL/IRRF e amortização de mútuo", note: "Margem bruta antes das retenções IRRF/IRPJ/CSLL (e Cessão -62k no caixa 2025)" },
        fr: { name: "Résultat Opérationnel / Avant Impôts (LAIR)", nature: "Résultat brut avant IRPJ, CSLL/IRRF et remboursement associé", note: "Marge brute avant retenues IRRF/IRPJ/CSLL (et Cession -62k en caisse 2025)" },
        en: { name: "Operating Income / EBT (Before Taxes)", nature: "Gross margin before IRPJ, CSLL/IRRF and shareholder debt repayment", note: "Operating margin before IRRF/IRPJ/CSLL withholding (and Cessão -62k in 2025 cash)" }
    },
    "3.3.04": {
        it: { name: "RISULTATO NETTO FINALE (FLUSSO BB / UTILE CRC)", nature: "Variazione netta cassa BB o Utile netto CRC", note: "Cassa BB (Pivot cons): 2024 +R$ 41.847,19 • 2025 +R$ 623.812,34 • 2026 +R$ 174.410,16 | CRC 2025: +R$ 137.310,45" },
        pt: { name: "RESULTADO LÍQUIDO FINAL (FLUXO BB / LUCRO CRC)", nature: "Variação líquida de caixa BB ou Lucro líquido CRC", note: "Caixa BB (Pivot cons): 2024 +R$ 41.847,19 • 2025 +R$ 623.812,34 • 2026 +R$ 174.410,16 | CRC 2025: +R$ 137.310,45" },
        fr: { name: "RÉSULTAT NET FINAL (FLUX BB / BÉNÉFICE CRC)", nature: "Variation nette trésorerie BB ou Bénéfice net CRC", note: "Caisse BB (Pivot cons) : 2024 +R$ 41.847,19 • 2025 +R$ 623.812,34 • 2026 +R$ 174.410,16 | CRC 2025 : +R$ 137.310,45" },
        en: { name: "FINAL NET RESULT (BB CASH FLOW / CRC PROFIT)", nature: "Net BB cash change or certified CRC profit", note: "BB Cash (Pivot cons): 2024 +R$ 41,847.19 • 2025 +R$ 623,812.34 • 2026 +R$ 174,410.16 | CRC 2025: +R$ 137,310.45" }
    }
};

function getDetailLocalized(d) {
    const lang = getBrLang();
    const tr = BR_DETAIL_I18N[d.code] && BR_DETAIL_I18N[d.code][lang];
    if (tr) return tr;
    return { name: d.name, nature: d.nature, note: d.note };
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
        const saldoLabel = getBrUIText('bp_th_saldo').replace('31/12/', '') + getBrDateLabel(y);
        thead.innerHTML = `
            <tr>
                <th>${getBrUIText('bp_th_rubrica')}</th>
                <th>${getBrUIText('bp_th_natura')}</th>
                <th class="text-right" style="width: 200px;">${saldoLabel} (R$)</th>
                <th class="text-right" style="width: 140px;">${getBrUIText('bp_th_peso')}</th>
            </tr>
        `;
    } else {
        thead.innerHTML = `
            <tr>
                <th>${getBrUIText('bp_th_rubrica')}</th>
                <th>${getBrUIText('bp_th_natura')}</th>
                <th class="text-right" style="width: 160px;">${getBrDateLabel(y1)} (R$)</th>
                <th class="text-right" style="width: 160px;">${getBrDateLabel(y2)} (R$)</th>
                <th class="text-right" style="width: 150px;">${getBrUIText('bp_th_var')}</th>
                <th class="text-right" style="width: 110px;">${getBrUIText('bp_th_var_pct')}</th>
            </tr>
        `;
    }

    // Totali calcolati dinamicamente da BR_BALANCO_DATA
    const sumCat = (prefix, yr) => BR_BALANCO_DATA
        .filter(it => it.category.startsWith(prefix))
        .reduce((acc, it) => acc + (it.vals[yr] || 0), 0);

    const totAtivo = {
        "2024": sumCat('ativo', '2024'),
        "2025": sumCat('ativo', '2025'),
        "2026": sumCat('ativo', '2026')
    };
    const totPassivo = {
        "2024": sumCat('passivo', '2024') + sumCat('pl', '2024'),
        "2025": sumCat('passivo', '2025') + sumCat('pl', '2025'),
        "2026": sumCat('passivo', '2026') + sumCat('pl', '2026')
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
        const dl = getDetailLocalized(d);
        if (isSingle) {
            const dVal = d.vals[y] || 0;
            drawerDetailsRows += `
                <tr>
                    <td style="font-family: monospace; font-weight: 600;">${d.code}</td>
                    <td>${dl.name}</td>
                    <td>${dl.nature}</td>
                    <td class="text-right text-bold" style="font-family: monospace;">${formatBRL(dVal)}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${dl.note}</td>
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
                    <td>${dl.name}</td>
                    <td>${dl.nature}</td>
                    <td class="text-right" style="font-family: monospace;">${formatBRL(dv1)}</td>
                    <td class="text-right text-bold" style="font-family: monospace;">${formatBRL(dv2)}</td>
                    <td class="text-right ${dCls}" style="font-family: monospace;">${formatBRLSigned(dDiff)}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${dl.note}</td>
                </tr>
            `;
        }
    });

    const drawerTableHeaders = isSingle ? `
        <tr>
            <th>${getBrUIText('bp_dr_cod')}</th>
            <th>${getBrUIText('bp_dr_desc')}</th>
            <th>${getBrUIText('bp_dr_nat')}</th>
            <th class="text-right">${getBrUIText('bp_dr_saldo')} ${getBrDateLabel(y)} (R$)</th>
            <th>${getBrUIText('bp_dr_notes')}</th>
        </tr>
    ` : `
        <tr>
            <th>${getBrUIText('bp_dr_cod')}</th>
            <th>${getBrUIText('bp_dr_desc')}</th>
            <th>${getBrUIText('bp_dr_nat')}</th>
            <th class="text-right">${getBrDateLabel(y1)} (R$)</th>
            <th class="text-right">${getBrDateLabel(y2)} (R$)</th>
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
    const sumByCat = (cat, yr) => BR_BALANCO_DATA
        .filter(it => it.category === cat)
        .reduce((acc, it) => acc + (it.vals[yr] || 0), 0);

    const targetYr = isSingle ? y : y2;
    const atTot = sumByCat('ativo_circ', targetYr) + sumByCat('ativo_nc', targetYr);
    const atCirc = sumByCat('ativo_circ', targetYr);
    const psCirc = sumByCat('passivo_circ', targetYr);
    const plTot = sumByCat('pl', targetYr);
    const dispVal = BR_BALANCO_DATA.find(it => it.id === 'disp')?.vals[targetYr] || 0;
    const lucVal = BR_BALANCO_DATA.find(it => it.id === 'luc')?.vals[targetYr] || 0;

    kpiAtivo.innerText = formatBRL(atTot);
    kpiCirc.innerText = formatBRL(atCirc);
    kpiPass.innerText = formatBRL(psCirc);
    kpiPl.innerText = formatBRL(plTot);

    const dateTarget = getBrDateLabel(targetYr);
    const isProvisional2026 = (targetYr === '2026');

    if (isSingle) {
        if (lang === 'pt') {
            kpiAtivoSub.innerText = isProvisional2026 ? `Provisório em ${dateTarget} (Excel BB)` : `Ativo Total Certificado em ${dateTarget}`;
            kpiCircSub.innerText = `Disponibilidades ${formatBRL(dispVal)} + Imóveis R$ 3,6M`;
            kpiPassSub.innerText = targetYr === '2024' ? "Fornecedores + SCP R$ 584k + Impostos" : "Fornecedores R$ 2,2k + Impostos R$ 74k";
            kpiPlSub.innerText = `Capital R$ 3.000.525,45 + Lucros ${formatBRL(lucVal)}`;
        } else if (lang === 'en') {
            kpiAtivoSub.innerText = isProvisional2026 ? `Provisional as of ${dateTarget} (Excel BB)` : `Certified Total Assets as of ${dateTarget}`;
            kpiCircSub.innerText = `Cash ${formatBRL(dispVal)} + Real Estate R$ 3.6M`;
            kpiPassSub.innerText = targetYr === '2024' ? "Suppliers + SCP R$ 584k + Taxes" : "Suppliers R$ 2.2k + Taxes R$ 74k";
            kpiPlSub.innerText = `Capital R$ 3,000,525.45 + Retained ${formatBRL(lucVal)}`;
        } else if (lang === 'it') {
            kpiAtivoSub.innerText = isProvisional2026 ? `Provvisorio al ${dateTarget} (Excel BB)` : `Attivo Totale Certificato al ${dateTarget}`;
            kpiCircSub.innerText = `Disponibilità ${formatBRL(dispVal)} + Immobili R$ 3,6M`;
            kpiPassSub.innerText = targetYr === '2024' ? "Fornitori + SCP R$ 584k + Imposte" : "Fornitori R$ 2,2k + Imposte R$ 74k";
            kpiPlSub.innerText = `Capitale R$ 3.000.525,45 + Utili ${formatBRL(lucVal)}`;
        } else {
            kpiAtivoSub.innerText = isProvisional2026 ? `Provisoire au ${dateTarget} (Excel BB)` : `Actif Total Certifié au ${dateTarget}`;
            kpiCircSub.innerText = `Disponibilités ${formatBRL(dispVal)} + Immobilier R$ 3,6M`;
            kpiPassSub.innerText = targetYr === '2024' ? "Fournisseurs + SCP R$ 584k + Impôts" : "Fournisseurs R$ 2,2k + Impôts R$ 74k";
            kpiPlSub.innerText = `Capital R$ 3.000.525,45 + Bénéfices ${formatBRL(lucVal)}`;
        }
    } else {
        const at1 = sumByCat('ativo_circ', y1) + sumByCat('ativo_nc', y1);
        const pctStr = formatBRLPercent(at1, atTot);
        if (lang === 'pt') {
            kpiAtivoSub.innerText = `Comparativo ${y1} (${formatBRL(at1)}) vs ${y2} (${pctStr})`;
            kpiCircSub.innerText = `Disponibilidades ${formatBRL(dispVal)} + Imóveis R$ 3,6M`;
            kpiPassSub.innerText = y2 === '2026' ? "Fornecedores R$ 2,2k + Tributos R$ 74k" : "Fornecedores locais + Obrigações fiscais";
            kpiPlSub.innerText = `Capital + Lucros Acumulados ${formatBRL(lucVal)}`;
        } else if (lang === 'en') {
            kpiAtivoSub.innerText = `Comparison ${y1} (${formatBRL(at1)}) vs ${y2} (${pctStr})`;
            kpiCircSub.innerText = `Cash ${formatBRL(dispVal)} + Real Estate R$ 3.6M`;
            kpiPassSub.innerText = y2 === '2026' ? "Suppliers R$ 2.2k + Taxes R$ 74k" : "Local Suppliers + Tax Liabilities";
            kpiPlSub.innerText = `Share Capital + Retained ${formatBRL(lucVal)}`;
        } else if (lang === 'it') {
            kpiAtivoSub.innerText = `Confronto ${y1} (${formatBRL(at1)}) vs ${y2} (${pctStr})`;
            kpiCircSub.innerText = `Disponibilità ${formatBRL(dispVal)} + Immobili R$ 3,6M`;
            kpiPassSub.innerText = y2 === '2026' ? "Fornitori R$ 2,2k + Imposte R$ 74k" : "Fornitori locali + Debiti fiscali";
            kpiPlSub.innerText = `Capitale + Utili Accumulati ${formatBRL(lucVal)}`;
        } else {
            kpiAtivoSub.innerText = `Comparaison ${y1} (${formatBRL(at1)}) vs ${y2} (${pctStr})`;
            kpiCircSub.innerText = `Disponibilités ${formatBRL(dispVal)} + Immobilier R$ 3,6M`;
            kpiPassSub.innerText = y2 === '2026' ? "Fournisseurs R$ 2,2k + Impôts R$ 74k" : "Fournisseurs locaux + Dettes fiscales";
            kpiPlSub.innerText = `Capital + Bénéfices Reportés ${formatBRL(lucVal)}`;
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

    const dreYrLabel = yr => yr === '2026' ? '2026 (YTD 31/10)' : yr;
    const basisBanner = document.getElementById('dre-basis-banner');
    if (basisBanner) {
        basisBanner.innerHTML = `<i class="fa-solid ${brDreBasis === 'cash' ? 'fa-money-bill-transfer text-emerald' : 'fa-file-signature text-amber'}" style="margin-right: 6px;"></i>` +
            getBrUIText(brDreBasis === 'cash' ? 'dre_banner_cash' : 'dre_banner_crc');
        basisBanner.style.borderLeftColor = brDreBasis === 'cash' ? 'var(--accent-emerald)' : 'var(--accent-amber)';
    }

    if (isSingle) {
        thead.innerHTML = `
            <tr>
                <th>${getBrUIText('dre_th_voce')}</th>
                <th>${getBrUIText('dre_th_cat')}</th>
                <th class="text-right" style="width: 220px;">${getBrUIText('dre_th_importo')} ${dreYrLabel(y)} (R$)</th>
                <th class="text-right" style="width: 140px;">${getBrUIText('dre_th_natura')}</th>
            </tr>
        `;
    } else {
        thead.innerHTML = `
            <tr>
                <th>${getBrUIText('dre_th_voce')}</th>
                <th>${getBrUIText('dre_th_cat')}</th>
                <th class="text-right" style="width: 170px;">${dreYrLabel(y1)} (R$)</th>
                <th class="text-right" style="width: 170px;">${dreYrLabel(y2)} (R$)</th>
                <th class="text-right" style="width: 150px;">${getBrUIText('dre_th_var')}</th>
                <th class="text-right" style="width: 110px;">${getBrUIText('dre_th_var_pct')}</th>
            </tr>
        `;
    }

    const ricaviItems = BR_DRE_DATA.filter(it => it.group === 'ricavi' && (!it.cashOnly || brDreBasis === 'cash'));
    const costiItems = BR_DRE_DATA.filter(it => it.group === 'costi' && (!it.cashOnly || brDreBasis === 'cash'));
    const risultatoItems = BR_DRE_DATA.filter(it => it.group === 'risultato');

    const sumGroup = (items, yr) => items.reduce((acc, it) => acc + getDreYrVal(it, yr), 0);

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
        const val = getDreYrVal(it, y);
        const valCls = val > 0 ? 'text-emerald' : (val < 0 ? 'text-rose' : 'text-muted');
        const nature = val >= 0 ? getBrUIText('dre_nature_pos') : getBrUIText('dre_nature_neg');
        mainCells = `
            <td class="text-right text-bold ${valCls}" style="font-family: monospace; font-size: ${isLucro ? '15px' : '13px'};">${formatBRLSigned(val)}</td>
            <td class="text-right text-muted" style="font-size: 12px;">${nature}</td>
        `;
    } else {
        const v1 = getDreYrVal(it, y1);
        const v2 = getDreYrVal(it, y2);
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

    const dreYrLabel = yr => yr === '2026' ? '2026 (YTD 31/10)' : yr;
    const visibleDetails = (it.details || []).filter(d => !d.cashOnly || brDreBasis === 'cash');
    let drawerRows = '';
    visibleDetails.forEach(d => {
        const dl = getDetailLocalized(d);
        if (isSingle) {
            const dVal = getDreYrVal(d, y);
            const dCls = dVal > 0 ? 'text-emerald' : (dVal < 0 ? 'text-rose' : 'text-muted');
            drawerRows += `
                <tr>
                    <td style="font-family: monospace; font-weight: 600;">${d.code}</td>
                    <td>${dl.name}</td>
                    <td>${dl.nature}</td>
                    <td class="text-right text-bold ${dCls}" style="font-family: monospace;">${formatBRLSigned(dVal)}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${dl.note}</td>
                </tr>
            `;
        } else {
            const dv1 = getDreYrVal(d, y1);
            const dv2 = getDreYrVal(d, y2);
            const dDiff = dv2 - dv1;
            const dv1Cls = dv1 > 0 ? 'text-emerald' : (dv1 < 0 ? 'text-rose' : 'text-muted');
            const dv2Cls = dv2 > 0 ? 'text-emerald' : (dv2 < 0 ? 'text-rose' : 'text-muted');
            const dDiffCls = dDiff > 0 ? 'text-emerald' : (dDiff < 0 ? 'text-rose' : 'text-muted');

            drawerRows += `
                <tr>
                    <td style="font-family: monospace; font-weight: 600;">${d.code}</td>
                    <td>${dl.name}</td>
                    <td>${dl.nature}</td>
                    <td class="text-right ${dv1Cls}" style="font-family: monospace;">${formatBRLSigned(dv1)}</td>
                    <td class="text-right text-bold ${dv2Cls}" style="font-family: monospace;">${formatBRLSigned(dv2)}</td>
                    <td class="text-right ${dDiffCls}" style="font-family: monospace;">${formatBRLSigned(dDiff)}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${dl.note}</td>
                </tr>
            `;
        }
    });

    const drawerTableHeaders = isSingle ? `
        <tr>
            <th>${getBrUIText('dre_dr_cod')}</th>
            <th>${getBrUIText('dre_dr_desc')}</th>
            <th>${getBrUIText('dre_dr_fonte')}</th>
            <th class="text-right">${getBrUIText('dre_th_importo')} ${dreYrLabel(y)} (R$)</th>
            <th>${getBrUIText('dre_dr_notes')}</th>
        </tr>
    ` : `
        <tr>
            <th>${getBrUIText('dre_dr_cod')}</th>
            <th>${getBrUIText('dre_dr_desc')}</th>
            <th>${getBrUIText('dre_dr_fonte')}</th>
            <th class="text-right">${dreYrLabel(y1)} (R$)</th>
            <th class="text-right">${dreYrLabel(y2)} (R$)</th>
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
                        <span class="badge badge-emerald">${visibleDetails.length} ${getBrUIText('dre_dr_badge')}</span>
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
    const sumGrp = (grp, yr) => BR_DRE_DATA
        .filter(it => it.group === grp && (!it.cashOnly || brDreBasis === 'cash'))
        .reduce((acc, it) => acc + getDreYrVal(it, yr), 0);
    const getVal = (id, yr) => getDreYrVal(BR_DRE_DATA.find(it => it.id === id), yr);

    const targetYr = isSingle ? y : y2;
    const recTot = sumGrp('ricavi', targetYr);
    const despTot = sumGrp('costi', targetYr);
    const finNet = getVal('rec_fin', targetYr) + getVal('desp_fin', targetYr);
    const lucroNet = getVal('lucro', targetYr);

    kpiRec.innerText = formatBRLSigned(recTot);
    kpiDesp.innerText = formatBRLSigned(despTot);
    kpiFin.innerText = formatBRLSigned(finNet);
    kpiLucro.innerText = formatBRLSigned(lucroNet);

    if (isSingle) {
        if (targetYr === '2026') {
            if (lang === 'pt') {
                if (kpiRecSub) kpiRecSub.innerText = "Rendimentos BB (R$ 156,6k) + Locação SCP (R$ 64,7k)";
                if (kpiDespSub) kpiDespSub.innerText = "Despesas adm. R$ 27,0k (Gestão 23,8k + Várias 3,2k), IRRF R$ 18,6k";
                if (kpiLucroSub) kpiLucroSub.innerText = "Lucro líquido provisório YTD 31/10/2026 (Excel BB)";
            } else if (lang === 'en') {
                if (kpiRecSub) kpiRecSub.innerText = "BB Returns (R$ 156.6k) + Resort Lease SCP (R$ 64.7k)";
                if (kpiDespSub) kpiDespSub.innerText = "Admin exp. R$ 27.0k (Gestão 23.8k + Misc. 3.2k), IRRF R$ 18.6k";
                if (kpiLucroSub) kpiLucroSub.innerText = "Provisional Net Profit YTD 31/10/2026 (Excel BB)";
            } else if (lang === 'it') {
                if (kpiRecSub) kpiRecSub.innerText = "Rendimenti BB (R$ 156,6k) + Locazione SCP (R$ 64,7k)";
                if (kpiDespSub) kpiDespSub.innerText = "Spese gen. R$ 27,0k (Gestão 23,8k + Varie 3,2k), IRRF R$ 18,6k";
                if (kpiLucroSub) kpiLucroSub.innerText = "Utile netto provvisorio YTD 31/10/2026 (Excel BB)";
            } else {
                if (kpiRecSub) kpiRecSub.innerText = "Rendements BB (R$ 156,6k) + Loyers SCP (R$ 64,7k)";
                if (kpiDespSub) kpiDespSub.innerText = "Dépenses adm. R$ 27,0k (Gestão 23,8k + Divers 3,2k), IRRF R$ 18,6k";
                if (kpiLucroSub) kpiLucroSub.innerText = "Bénéfice net provisoire YTD 31/10/2026 (Excel BB)";
            }
        } else if (targetYr === '2025') {
            if (brDreBasis === 'cash') {
                if (lang === 'pt') {
                    if (kpiRecSub) kpiRecSub.innerText = "Locação SCP BB (R$ 617,5k) + Rendimentos BB (R$ 136,0k)";
                    if (kpiDespSub) kpiDespSub.innerText = "Desp. gerais R$ 40,9k, IRRF R$ 25,5k, Cessão R$ 62k, BB R$ 1,3k";
                    if (kpiLucroSub) kpiLucroSub.innerText = "Fluxo líquido de caixa BB 2025 (Excel Pivot cons)";
                } else if (lang === 'en') {
                    if (kpiRecSub) kpiRecSub.innerText = "SCP Lease BB (R$ 617.5k) + BB Returns (R$ 136.0k)";
                    if (kpiDespSub) kpiDespSub.innerText = "General exp. R$ 40.9k, IRRF R$ 25.5k, Cessão R$ 62k, BB R$ 1.3k";
                    if (kpiLucroSub) kpiLucroSub.innerText = "2025 Net BB Cash Flow (Excel Pivot cons)";
                } else if (lang === 'it') {
                    if (kpiRecSub) kpiRecSub.innerText = "Locazione SCP BB (R$ 617,5k) + Interessi BB (R$ 136,0k)";
                    if (kpiDespSub) kpiDespSub.innerText = "Spese gen. R$ 40,9k, IRRF R$ 25,5k, Cessão R$ 62k, BB R$ 1,3k";
                    if (kpiLucroSub) kpiLucroSub.innerText = "Flusso netto di cassa BB 2025 (Excel Pivot cons)";
                } else {
                    if (kpiRecSub) kpiRecSub.innerText = "Loyers SCP BB (R$ 617,5k) + Rendements BB (R$ 136,0k)";
                    if (kpiDespSub) kpiDespSub.innerText = "Frais gén. R$ 40,9k, IRRF R$ 25,5k, Cession R$ 62k, BB R$ 1,3k";
                    if (kpiLucroSub) kpiLucroSub.innerText = "Flux net trésorerie BB 2025 (Excel Pivot cons)";
                }
            } else {
                if (lang === 'pt') {
                    if (kpiRecSub) kpiRecSub.innerText = "Rendimentos BB (R$ 136,4k) + Proventos SCP CRC (R$ 64,7k)";
                    if (kpiDespSub) kpiDespSub.innerText = "Despesas adm. R$ 29,6k, tributos R$ 33,1k, bancárias R$ 1,1k";
                    if (kpiLucroSub) kpiLucroSub.innerText = "Lucro líquido do exercício certificado CRC";
                } else if (lang === 'en') {
                    if (kpiRecSub) kpiRecSub.innerText = "BB Returns (R$ 136.4k) + SCP Income CRC (R$ 64.7k)";
                    if (kpiDespSub) kpiDespSub.innerText = "Admin exp. R$ 29.6k, taxes R$ 33.1k, bank fees R$ 1.1k";
                    if (kpiLucroSub) kpiLucroSub.innerText = "Certified Net Profit for the year by CRC";
                } else if (lang === 'it') {
                    if (kpiRecSub) kpiRecSub.innerText = "Rendimenti BB (R$ 136,4k) + Proventi SCP CRC (R$ 64,7k)";
                    if (kpiDespSub) kpiDespSub.innerText = "Spese amm. R$ 29,6k, tributi R$ 33,1k, banche R$ 1,1k";
                    if (kpiLucroSub) kpiLucroSub.innerText = "Utile netto d'esercizio asseverato CRC";
                } else {
                    if (kpiRecSub) kpiRecSub.innerText = "Rendements BB (R$ 136,4k) + Produits SCP CRC (R$ 64,7k)";
                    if (kpiDespSub) kpiDespSub.innerText = "Dépenses adm. R$ 29,6k, impôts R$ 33,1k, banques R$ 1,1k";
                    if (kpiLucroSub) kpiLucroSub.innerText = "Bénéfice net d'exercice certifié CRC";
                }
            }
        } else {
            if (brDreBasis === 'cash') {
                if (lang === 'pt') {
                    if (kpiRecSub) kpiRecSub.innerText = "Rendimentos BB Excel 2024 (R$ 80,9k)";
                    if (kpiDespSub) kpiDespSub.innerText = "Desp. gerais R$ 21,5k, IRRF R$ 16,1k, taxas R$ 1,5k";
                    if (kpiLucroSub) kpiLucroSub.innerText = "Fluxo líquido de caixa BB 2024 (Excel Pivot cons)";
                } else if (lang === 'en') {
                    if (kpiRecSub) kpiRecSub.innerText = "BB Excel Returns 2024 (R$ 80.9k)";
                    if (kpiDespSub) kpiDespSub.innerText = "General exp. R$ 21.5k, IRRF R$ 16.1k, fees R$ 1.5k";
                    if (kpiLucroSub) kpiLucroSub.innerText = "2024 Net BB Cash Flow (Excel Pivot cons)";
                } else if (lang === 'it') {
                    if (kpiRecSub) kpiRecSub.innerText = "Rendimenti BB Excel 2024 (R$ 80,9k)";
                    if (kpiDespSub) kpiDespSub.innerText = "Spese gen. R$ 21,5k, IRRF R$ 16,1k, oneri R$ 1,5k";
                    if (kpiLucroSub) kpiLucroSub.innerText = "Flusso netto di cassa BB 2024 (Excel Pivot cons)";
                } else {
                    if (kpiRecSub) kpiRecSub.innerText = "Rendements BB Excel 2024 (R$ 80,9k)";
                    if (kpiDespSub) kpiDespSub.innerText = "Frais gén. R$ 21,5k, IRRF R$ 16,1k, frais R$ 1,5k";
                    if (kpiLucroSub) kpiLucroSub.innerText = "Flux net trésorerie BB 2024 (Excel Pivot cons)";
                }
            } else {
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
        }
    } else {
        const rec1 = sumGrp('ricavi', y1);
        const desp1 = sumGrp('costi', y1);
        const lucro1 = getVal('lucro', y1);
        const recPct = formatBRLPercent(rec1, recTot);
        const despPct = formatBRLPercent(Math.abs(desp1), Math.abs(despTot));
        const lucroPct = formatBRLPercent(lucro1, lucroNet);
        const lucroDiff = formatBRLSigned(lucroNet - lucro1);
        const periodLabel = y2 === '2026' ? 'YTD 31/10/2026 vs ' + y1 : y2 + ' vs ' + y1;

        if (lang === 'pt') {
            if (kpiRecSub) kpiRecSub.innerText = `Variação receitas (${periodLabel}): ${recPct}`;
            if (kpiDespSub) kpiDespSub.innerText = `Variação custos totais (${periodLabel}): ${despPct}`;
            if (kpiLucroSub) kpiLucroSub.innerText = `Variação lucro líquido: ${lucroPct} (${lucroDiff})`;
        } else if (lang === 'en') {
            if (kpiRecSub) kpiRecSub.innerText = `Revenue variance (${periodLabel}): ${recPct}`;
            if (kpiDespSub) kpiDespSub.innerText = `Total costs variance (${periodLabel}): ${despPct}`;
            if (kpiLucroSub) kpiLucroSub.innerText = `Net profit variance: ${lucroPct} (${lucroDiff})`;
        } else if (lang === 'it') {
            if (kpiRecSub) kpiRecSub.innerText = `Variazione proventi (${periodLabel}): ${recPct}`;
            if (kpiDespSub) kpiDespSub.innerText = `Variazione costi totali (${periodLabel}): ${despPct}`;
            if (kpiLucroSub) kpiLucroSub.innerText = `Variazione utile netto: ${lucroPct} (${lucroDiff})`;
        } else {
            if (kpiRecSub) kpiRecSub.innerText = `Variation produits (${periodLabel}) : ${recPct}`;
            if (kpiDespSub) kpiDespSub.innerText = `Variation charges totales (${periodLabel}) : ${despPct}`;
            if (kpiLucroSub) kpiLucroSub.innerText = `Variation bénéfice net : ${lucroPct} (${lucroDiff})`;
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
