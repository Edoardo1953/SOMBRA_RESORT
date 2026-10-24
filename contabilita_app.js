/**
 * SOMBRA_RESORT - Comptabilité PCN Luxembourg & Comparatif Multi-Années
 * Société : SOMBRA E AGUA FRESCA RESORT S.à r.l. (RCS B263295)
 * Années supportées : 2024, 2025, 2026 YTD
 * Système d'accordéon en tendina pour Bilan Actif, Bilan Passif & P&P
 */

let comptaMode = 'single'; // 'single' ou 'comparatif'
let selectedSingleYear = '2025';
let compareYear1 = '2024';
let compareYear2 = '2025';
let currentActiveComptaTab = 'actif';

function formatCurrency(val) {
    if (val === null || val === undefined || isNaN(val)) return "0,00 €";
    const num = Number(val);
    const parts = num.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",") + " €";
}

function formatPercent(val) {
    if (val === null || val === undefined || isNaN(val)) return "-";
    const num = Number(val);
    const sign = num > 0 ? "+" : "";
    return `${sign}${num.toFixed(2).replace('.', ',')} %`;
}

// -------------------------------------------------------------
// BASE DE DONNÉES ANALYTIQUE DES SOUS-COMPTES (DRILLDOWN TENDINA)
// -------------------------------------------------------------
const COMPTA_DRILLDOWN_DB = {
    // BILAN ACTIF
    "2330010": [
        { ref: "2330010", desc: "Participation Sombra Resort Brasil Sociedade Unipessoal Ltda (100%)", tiers: "Sombra Resort Brasil Ltda", val_2024: 1004968.24, val_2025: 1004968.24, val_2026: 1004968.24, note: "Valeur souscrite filiale brésilienne (R$ 3.000.525,45 - CNPJ 43.730.206/0001-80)" }
    ],
    "4228800": [
        { ref: "4228800", desc: "Avance financière filiale brésilienne Sombra Resort Brasil (> 1 an)", tiers: "Sombra Resort Brasil Ltda", val_2024: 130689.67, val_2025: 120689.67, val_2026: 120689.67, note: "Prêt intercompany (R$ 638.000 / 700.000). Remboursement partiel Franco Toscano" }
    ],
    "5131000": [
        { ref: "5131000", desc: "Compte courant bancaire Olky Pay EUR (LU66 6060 0020 0000 3953)", tiers: "Olky Payment Services S.A.", val_2024: 4229.46, val_2025: 10193.23, val_2026: 0.00, note: "Compte clôturé le 21/05/2026" }
    ],
    "5132000": [
        { ref: "5132000", desc: "Compte opérationnel Revolut Business EUR (LT34 3250 0953 8055 9528)", tiers: "Revolut Bank UAB", val_2024: 0.00, val_2025: 0.00, val_2026: 8508.43, note: "Compte principal ouvert en 2026" }
    ],

    // BILAN PASSIF
    "1010000": [
        { ref: "1010000", desc: "Capital souscrit 15.000 parts de 1,00 € (Totalement libéré)", tiers: "Associés Sombra Resort Sàrl", val_2024: 15000.00, val_2025: 15000.00, val_2026: 15000.00, note: "Constitution notariée du 20/12/2021" }
    ],
    "1381000": [
        { ref: "1381000", desc: "Autres réserves disponibles / Réserve légale statutaire", tiers: "Luxembourg", val_2024: 888.85, val_2025: 888.85, val_2026: 888.85, note: "Affectation statutaire obligatoire" }
    ],
    "4411200": [
        { ref: "4411200", desc: "Factures non parvenues - Fiduciaire / Dépôt eCDF", tiers: "Cabinet Fiduciaire Luxembourg", val_2024: 4655.00, val_2025: 4680.00, val_2026: 4680.00, note: "Honoraires annuels de bilan et déclarations fiscales" }
    ],
    "4712100": [
        { ref: "4712101", desc: "Compte courant d'associé - Oliveira Da Costa Christine (ODC)", tiers: "Christine Oliveira", val_2024: 43688.90, val_2025: 43688.90, val_2026: 43688.90, note: "Financement d'associé Villa A" },
        { ref: "4712102", desc: "Compte courant d'associé - Liesen Jens (LJ)", tiers: "Jens Liesen", val_2024: 43688.90, val_2025: 43688.90, val_2026: 43688.90, note: "Financement d'associé Villa A" },
        { ref: "4712103", desc: "Compte courant d'associé - Vignolle Giorgio (VG)", tiers: "Giorgio Vignolle", val_2024: 28350.66, val_2025: 28350.66, val_2026: 28350.66, note: "Financement d'associé Villa B" },
        { ref: "4712104", desc: "Compte courant d'associé - Vignolle Gabriel (VGa)", tiers: "Gabriel Vignolle", val_2024: 39396.38, val_2025: 39396.38, val_2026: 39396.38, note: "Financement d'associé Villa B" },
        { ref: "4712105", desc: "Compte courant d'associé - Vignolle Matteo (VM)", tiers: "Matteo Vignolle", val_2024: 39399.38, val_2025: 39399.38, val_2026: 39399.38, note: "Financement d'associé Villa B" },
        { ref: "4712106", desc: "Compte courant d'associé - Raggi Giancarlo (RG)", tiers: "Giancarlo Raggi", val_2024: 49646.57, val_2025: 49646.57, val_2026: 49646.57, note: "Financement d'associé Villa D" },
        { ref: "4712107", desc: "Compte courant d'associé - Lambert Ingrid (Li)", tiers: "Ingrid Lambert", val_2024: 50638.85, val_2025: 50638.85, val_2026: 50638.85, note: "Financement d'associé Villa D" },
        { ref: "4712108", desc: "Compte courant d'associé - Tubia Enrico (TEn)", tiers: "Enrico Tubia", val_2024: 96313.63, val_2025: 96313.63, val_2026: 96313.63, note: "Financement d'associé Villa E" },
        { ref: "4712109", desc: "Compte courant d'associé - Tubia Edoardo (TEd)", tiers: "Edoardo Tubia", val_2024: 43434.36, val_2025: 43434.36, val_2026: 43434.36, note: "Financement d'associé Villa F" },
        { ref: "4712110", desc: "Compte courant d'associé - Tubia Silvia (TSi)", tiers: "Silvia Tubia", val_2024: 96313.63, val_2025: 96313.63, val_2026: 96313.63, note: "Financement d'associé Villa F" },
        { ref: "4712111", desc: "Compte courant d'associé - Hemawiti Susik (HS)", tiers: "Susik Hemawiti", val_2024: 119150.69, val_2025: 119150.69, val_2026: 119150.69, note: "Financement d'associé Villa G" },
        { ref: "4712112", desc: "Compte courant d'associé - New Life Sàrl", tiers: "New Life Sàrl", val_2024: 114440.52, val_2025: 114440.52, val_2026: 114440.52, note: "Financement d'associé Villa H" },
        { ref: "4712113", desc: "Compte courant d'associé - Barbancey Michel (BM)", tiers: "Michel Barbancey", val_2024: 98299.53, val_2025: 98299.53, val_2026: 98299.53, note: "Financement d'associé Villa I" },
        { ref: "4712114", desc: "Compte courant d'associé - Cofre Luxembourg Wind SA (CLW)", tiers: "Cofre Lux Wind SA", val_2024: 132148.59, val_2025: 132148.59, val_2026: 132148.59, note: "Financement d'associé Villa C" }
    ],
    "4718001": [
        { ref: "4718001", desc: "Autres dettes diverses - Edoardo Tubia (Avances gérance)", tiers: "Edoardo Tubia", val_2024: 27000.00, val_2025: 30000.00, val_2026: 30000.00, note: "Avances de trésorerie de gestion" }
    ],
    "4728000": [
        { ref: "4728000", desc: "Autres dettes diverses (> 1 an) - Avances à terme", tiers: "Dettes financières", val_2024: 130689.67, val_2025: 130689.67, val_2026: 130689.67, note: "Dettes à terme" }
    ],

    // COMPTE DE PERTES ET PROFITS (P&P)
    "6133300": [
        { ref: "6133301", desc: "Frais mensuels de tenue de compte bancaire Olky Pay", tiers: "Olky Payment Services S.A.", val_2024: -240.00, val_2025: -180.00, val_2026: -60.00, note: "Forfait bancaire mensuel de 20 €" },
        { ref: "6133302", desc: "Commissions sur virements et tenue Revolut Business", tiers: "Revolut Bank UAB", val_2024: -206.40, val_2025: -196.83, val_2026: -64.49, note: "Commissions de tenue et virements bancaires" }
    ],
    "6134200": [
        { ref: "6134201", desc: "Honoraires annuels fiduciaire tenue comptable et bilan PCN", tiers: "Cabinet Fiduciaire Luxembourg", val_2024: -4000.00, val_2025: -4000.00, val_2026: 0.00, note: "Établissement bilan annuel, grand-livre et balance" },
        { ref: "6134202", desc: "Frais de dépôt eCDF et publication officielle RCSL", tiers: "Centre Commun eCDF / RCSL", val_2024: -640.00, val_2025: -705.00, val_2026: 0.00, note: "Dépôt légal de la liasse financière officielle" }
    ],
    "6135000": [
        { ref: "6135001", desc: "Frais et actes notariés statutaires", tiers: "Étude Notariale Luxembourg", val_2024: 0.00, val_2025: -24.40, val_2026: 0.00, note: "Frais d'actes notariés et greffe RCSL" }
    ],
    "6187000": [
        { ref: "6187001", desc: "Cotisation annuelle obligatoire Chambre de Commerce", tiers: "Chambre de Commerce du Luxembourg", val_2024: -350.00, val_2025: -350.00, val_2026: 0.00, note: "Cotisation légale annuelle Soparfi" }
    ],
    "6811000": [
        { ref: "6811001", desc: "Impôt sur la Fortune minimum (IF forfaitaire annuel)", tiers: "Administration des Contributions Directes (ACD)", val_2024: -1605.00, val_2025: -1605.00, val_2026: 0.00, note: "Impôt forfaitaire SOPARFI (total bilan > 350.000 €)" }
    ]
};

// -------------------------------------------------------------
// NAVIGATION ONGLETS & MODES
// -------------------------------------------------------------
function switchComptaTab(tab) {
    currentActiveComptaTab = tab;
    document.querySelectorAll('.compta-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });

    document.getElementById('sec-compta-actif').style.display = (tab === 'actif') ? 'block' : 'none';
    document.getElementById('sec-compta-passif').style.display = (tab === 'passif') ? 'block' : 'none';
    document.getElementById('sec-compta-pnl').style.display = (tab === 'pnl') ? 'block' : 'none';
    document.getElementById('sec-compta-gl').style.display = (tab === 'gl') ? 'block' : 'none';
}

function setComptaMode(mode) {
    comptaMode = mode;
    document.getElementById('btn-mode-single')?.classList.toggle('active', mode === 'single');
    document.getElementById('btn-mode-comparatif')?.classList.toggle('active', mode === 'comparatif');
    document.getElementById('control-single-year')?.style.setProperty('display', mode === 'single' ? 'flex' : 'none');
    document.getElementById('control-compare-years')?.style.setProperty('display', mode === 'comparatif' ? 'flex' : 'none');
    renderComptaTables();
}

function onYearChange() {
    selectedSingleYear = document.getElementById('select-single-year').value;
    renderComptaTables();
}

function onCompareYearsChange() {
    compareYear1 = document.getElementById('select-compare-year-1').value;
    compareYear2 = document.getElementById('select-compare-year-2').value;
    renderComptaTables();
}

// -------------------------------------------------------------
// GESTION DU SYSTÈME À TENDINA (ACCORDÉON INLINE SOUS CHAQUE LIGNE)
// -------------------------------------------------------------
function toggleComptaDrawer(section, accountId) {
    const safeId = String(accountId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const drawer = document.getElementById(`drawer-${section}-${safeId}`);
    const row = document.getElementById(`row-${section}-${safeId}`);
    const btn = document.getElementById(`btn-chevron-${section}-${safeId}`);
    if (!drawer) return;

    const isHidden = drawer.style.display === 'none' || !drawer.style.display;
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

function buildDrawerHtml(it, section, mode, colSpan) {
    const accKey = String(it.account || it.code || '');
    const list = COMPTA_DRILLDOWN_DB[accKey] || [];
    const isPnl = (section === 'pnl');

    let contentHtml = '';

    if (list.length > 0) {
        if (mode === 'single') {
            let total = 0;
            let rowsHtml = '';
            list.forEach(sub => {
                const val = sub[`val_${selectedSingleYear}`] !== undefined ? sub[`val_${selectedSingleYear}`] : (sub.val_2025 || 0);
                total += val;
                const valClass = isPnl ? 'text-rose' : 'text-emerald';
                rowsHtml += `
                    <tr>
                        <td class="text-bold text-emerald" style="font-family: monospace;">${sub.ref}</td>
                        <td style="font-weight: 600; color: var(--text-main);">${sub.desc}</td>
                        <td><span class="badge ${sub.tiers ? 'badge-blue' : 'badge-status-all'}">${sub.tiers || '-'}</span></td>
                        <td style="font-size: 11.5px; color: var(--text-muted);">${sub.note || '-'}</td>
                        <td class="text-right text-bold ${valClass}" style="font-family: monospace; font-size: 13px;">${formatCurrency(val)}</td>
                    </tr>
                `;
            });

            contentHtml = `
                <div class="compta-nested-table-wrap">
                    <table class="compta-nested-table">
                        <thead>
                            <tr>
                                <th style="width: 120px;">Sous-Compte</th>
                                <th>Description / Opération sous-jacente</th>
                                <th style="width: 180px;">Bénéficiaire / Tiers</th>
                                <th>Note de gestion</th>
                                <th class="text-right" style="width: 160px;">Montant (${selectedSingleYear})</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                        <tfoot>
                            <tr class="nested-total-row">
                                <td colspan="4" class="text-right" style="color: var(--text-muted);">TOTAL SOUS-COMPTES (${selectedSingleYear}) :</td>
                                <td class="text-right ${isPnl ? 'text-rose' : 'text-emerald'}" style="font-family: monospace; font-size: 13.5px;">${formatCurrency(total)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `;
        } else {
            // Comparateur Multi-Années
            let tot1 = 0, tot2 = 0;
            let rowsHtml = '';
            list.forEach(sub => {
                const v1 = sub[`val_${compareYear1}`] !== undefined ? sub[`val_${compareYear1}`] : 0;
                const v2 = sub[`val_${compareYear2}`] !== undefined ? sub[`val_${compareYear2}`] : 0;
                const diff = v2 - v1;
                const pct = v1 !== 0 ? (diff / Math.abs(v1)) * 100 : 0;
                tot1 += v1;
                tot2 += v2;
                rowsHtml += `
                    <tr>
                        <td class="text-bold text-emerald" style="font-family: monospace;">${sub.ref}</td>
                        <td style="font-weight: 600; color: var(--text-main);">${sub.desc}</td>
                        <td><span class="badge ${sub.tiers ? 'badge-blue' : 'badge-status-all'}">${sub.tiers || '-'}</span></td>
                        <td class="text-right" style="font-family: monospace;">${formatCurrency(v1)}</td>
                        <td class="text-right" style="font-family: monospace;">${formatCurrency(v2)}</td>
                        <td class="text-right text-bold ${diff >= 0 ? 'text-emerald' : 'text-rose'}" style="font-family: monospace;">${diff >= 0 ? '+' : ''}${formatCurrency(diff)}</td>
                        <td class="text-right text-bold ${diff >= 0 ? 'text-emerald' : 'text-rose'}">${formatPercent(pct)}</td>
                    </tr>
                `;
            });

            const totDiff = tot2 - tot1;
            const totPct = tot1 !== 0 ? (totDiff / Math.abs(tot1)) * 100 : 0;

            contentHtml = `
                <div class="compta-nested-table-wrap">
                    <table class="compta-nested-table">
                        <thead>
                            <tr>
                                <th style="width: 120px;">Sous-Compte</th>
                                <th>Description / Opération sous-jacente</th>
                                <th style="width: 180px;">Bénéficiaire / Tiers</th>
                                <th class="text-right" style="width: 130px;">${compareYear1}</th>
                                <th class="text-right" style="width: 130px;">${compareYear2}</th>
                                <th class="text-right" style="width: 130px;">Variation (€)</th>
                                <th class="text-right" style="width: 110px;">Variation (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                        <tfoot>
                            <tr class="nested-total-row">
                                <td colspan="3" class="text-right" style="color: var(--text-muted);">TOTAL SOUS-COMPTES :</td>
                                <td class="text-right" style="font-family: monospace;">${formatCurrency(tot1)}</td>
                                <td class="text-right" style="font-family: monospace;">${formatCurrency(tot2)}</td>
                                <td class="text-right ${totDiff >= 0 ? 'text-emerald' : 'text-rose'}" style="font-family: monospace;">${totDiff >= 0 ? '+' : ''}${formatCurrency(totDiff)}</td>
                                <td class="text-right ${totDiff >= 0 ? 'text-emerald' : 'text-rose'}">${formatPercent(totPct)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `;
        }
    } else {
        // Pas de sous-comptes divisés : écriture directe au Grand-Livre PCN
        const valSingle = it[`val_${selectedSingleYear}`] || 0;
        contentHtml = `
            <div class="drawer-empty-card">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(56, 189, 248, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: #38bdf8;">
                            <i class="fa-solid fa-file-invoice"></i>
                        </div>
                        <div>
                            <div style="font-weight: 700; color: var(--text-main); font-size: 13.5px;">Écriture comptable principale • Grand-Livre PCN Luxembourg</div>
                            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                                Catégorie : <strong>${it.category || 'Compte Général'}</strong> &bull; Note officielle : <em>${it.note || 'Écriture conforme et certifiée eCDF'}</em>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="badge badge-emerald"><i class="fa-solid fa-circle-check"></i> Certifié eCDF</span>
                        <span style="font-family: monospace; font-size: 14px; font-weight: 800; color: ${isPnl ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
                            ${formatCurrency(valSingle)}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="compta-drawer-content">
            <div class="drawer-header">
                <div class="drawer-title">
                    <i class="fa-solid fa-folder-open text-emerald"></i>
                    <span>Détail &amp; Écritures sous-jacentes : Compte <strong>${accKey}</strong> — ${it.libelle}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge ${list.length > 0 ? 'badge-emerald' : 'badge-blue'}">
                        ${list.length > 0 ? list.length + ' sous-écritures' : 'Écriture directe'}
                    </span>
                    <button class="btn-icon" style="width: 24px; height: 24px; font-size: 11px;" onclick="event.stopPropagation(); toggleComptaDrawer('${section}', '${accKey}')" title="Fermer la tendina">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
            ${contentHtml}
        </div>
    `;
}

// -------------------------------------------------------------
// RENDU DES TABLEAUX DU BILAN & P&P
// -------------------------------------------------------------
function renderComptaTables() {
    const data = window.SOMBRA_RESORT_DATA;
    if (!data) return;

    renderBilanActif(data.pcn_bilan_actif || []);
    renderBilanPassif(data.pcn_bilan_passif || []);
    renderPnl(data.pcn_pnl || []);
    renderGrandLivre();
}

function renderBilanActif(items) {
    const tbody = document.getElementById('compta-actif-tbody');
    const thead = document.getElementById('compta-actif-thead');
    if (!tbody || !thead) return;

    let tot1 = 0, tot2 = 0;

    if (comptaMode === 'single') {
        thead.innerHTML = `
            <tr>
                <th style="width: 100px;">Code PCN</th>
                <th style="width: 120px;">Compte</th>
                <th>Libellé PCN</th>
                <th>Catégorie / Note</th>
                <th class="text-right" style="width: 180px;">Montant (${selectedSingleYear})</th>
                <th class="text-center" style="width: 75px;">Détail</th>
            </tr>
        `;
        let html = '';
        items.forEach(it => {
            const val = it[`val_${selectedSingleYear}`] || 0;
            tot1 += val;
            const safeAcc = String(it.account).replace(/[^a-zA-Z0-9_-]/g, '_');
            const drawerHtml = buildDrawerHtml(it, 'actif', 'single', 6);
            html += `
                <tr id="row-actif-${safeAcc}" class="compta-row" onclick="toggleComptaDrawer('actif', '${safeAcc}')">
                    <td class="text-bold text-cyan">${it.code}</td>
                    <td class="text-bold text-emerald" style="font-family: monospace;">${it.account}</td>
                    <td style="font-weight: 600; color: var(--text-main);">${it.libelle}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${it.note || it.category}</td>
                    <td class="text-right text-bold" style="font-family: monospace; font-size: 13.5px;">${formatCurrency(val)}</td>
                    <td class="text-center">
                        <button id="btn-chevron-actif-${safeAcc}" class="btn-accordion-toggle" title="Ouvrir la tendina">
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    </td>
                </tr>
                <tr id="drawer-actif-${safeAcc}" class="compta-accordion-drawer" style="display: none;">
                    <td colspan="6" class="compta-drawer-cell">
                        ${drawerHtml}
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
        document.getElementById('compta-actif-total').innerHTML = `
            <tr style="background: rgba(16, 185, 129, 0.15); font-weight: 800; font-size: 14px;">
                <td colspan="4" style="text-align: right; color: #34d399; padding: 0.8rem 1rem;">TOTAL ACTIF :</td>
                <td class="text-right text-emerald" style="font-family: monospace;">${formatCurrency(tot1)}</td>
                <td></td>
            </tr>
        `;
    } else {
        thead.innerHTML = `
            <tr>
                <th style="width: 100px;">Code PCN</th>
                <th style="width: 120px;">Compte</th>
                <th>Libellé PCN</th>
                <th class="text-right" style="width: 140px;">${compareYear1}</th>
                <th class="text-right" style="width: 140px;">${compareYear2}</th>
                <th class="text-right" style="width: 140px;">Variation (€)</th>
                <th class="text-right" style="width: 110px;">Variation (%)</th>
                <th class="text-center" style="width: 60px;">Détail</th>
            </tr>
        `;
        let html = '';
        items.forEach(it => {
            const v1 = it[`val_${compareYear1}`] || 0;
            const v2 = it[`val_${compareYear2}`] || 0;
            const diff = v2 - v1;
            const pct = v1 !== 0 ? (diff / Math.abs(v1)) * 100 : 0;
            tot1 += v1;
            tot2 += v2;
            const safeAcc = String(it.account).replace(/[^a-zA-Z0-9_-]/g, '_');
            const drawerHtml = buildDrawerHtml(it, 'actif', 'comparatif', 8);
            html += `
                <tr id="row-actif-${safeAcc}" class="compta-row" onclick="toggleComptaDrawer('actif', '${safeAcc}')">
                    <td class="text-bold text-cyan">${it.code}</td>
                    <td class="text-bold text-emerald" style="font-family: monospace;">${it.account}</td>
                    <td style="font-weight: 600; color: var(--text-main);">${it.libelle}</td>
                    <td class="text-right" style="font-family: monospace;">${formatCurrency(v1)}</td>
                    <td class="text-right" style="font-family: monospace;">${formatCurrency(v2)}</td>
                    <td class="text-right text-bold ${diff >= 0 ? 'text-emerald' : 'text-rose'}" style="font-family: monospace;">${diff >= 0 ? '+' : ''}${formatCurrency(diff)}</td>
                    <td class="text-right text-bold ${diff >= 0 ? 'text-emerald' : 'text-rose'}">${formatPercent(pct)}</td>
                    <td class="text-center">
                        <button id="btn-chevron-actif-${safeAcc}" class="btn-accordion-toggle" title="Ouvrir la tendina">
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    </td>
                </tr>
                <tr id="drawer-actif-${safeAcc}" class="compta-accordion-drawer" style="display: none;">
                    <td colspan="8" class="compta-drawer-cell">
                        ${drawerHtml}
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
        const totDiff = tot2 - tot1;
        const totPct = tot1 !== 0 ? (totDiff / Math.abs(tot1)) * 100 : 0;
        document.getElementById('compta-actif-total').innerHTML = `
            <tr style="background: rgba(16, 185, 129, 0.15); font-weight: 800; font-size: 14px;">
                <td colspan="3" style="text-align: right; color: #34d399; padding: 0.8rem 1rem;">TOTAL ACTIF :</td>
                <td class="text-right" style="font-family: monospace;">${formatCurrency(tot1)}</td>
                <td class="text-right" style="font-family: monospace;">${formatCurrency(tot2)}</td>
                <td class="text-right ${totDiff >= 0 ? 'text-emerald' : 'text-rose'}" style="font-family: monospace;">${totDiff >= 0 ? '+' : ''}${formatCurrency(totDiff)}</td>
                <td class="text-right ${totDiff >= 0 ? 'text-emerald' : 'text-rose'}">${formatPercent(totPct)}</td>
                <td></td>
            </tr>
        `;
    }
}

function renderBilanPassif(items) {
    const tbody = document.getElementById('compta-passif-tbody');
    const thead = document.getElementById('compta-passif-thead');
    if (!tbody || !thead) return;

    let tot1 = 0, tot2 = 0;

    if (comptaMode === 'single') {
        thead.innerHTML = `
            <tr>
                <th style="width: 100px;">Code PCN</th>
                <th style="width: 120px;">Compte</th>
                <th>Libellé PCN</th>
                <th>Catégorie / Note</th>
                <th class="text-right" style="width: 180px;">Montant (${selectedSingleYear})</th>
                <th class="text-center" style="width: 75px;">Détail</th>
            </tr>
        `;
        let html = '';
        items.forEach(it => {
            const val = it[`val_${selectedSingleYear}`] || 0;
            tot1 += val;
            const safeAcc = String(it.account).replace(/[^a-zA-Z0-9_-]/g, '_');
            const drawerHtml = buildDrawerHtml(it, 'passif', 'single', 6);
            html += `
                <tr id="row-passif-${safeAcc}" class="compta-row" onclick="toggleComptaDrawer('passif', '${safeAcc}')">
                    <td class="text-bold text-cyan">${it.code}</td>
                    <td class="text-bold text-emerald" style="font-family: monospace;">${it.account}</td>
                    <td style="font-weight: 600; color: var(--text-main);">${it.libelle}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${it.note || it.category}</td>
                    <td class="text-right text-bold" style="font-family: monospace; font-size: 13.5px;">${formatCurrency(val)}</td>
                    <td class="text-center">
                        <button id="btn-chevron-passif-${safeAcc}" class="btn-accordion-toggle" title="Ouvrir la tendina">
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    </td>
                </tr>
                <tr id="drawer-passif-${safeAcc}" class="compta-accordion-drawer" style="display: none;">
                    <td colspan="6" class="compta-drawer-cell">
                        ${drawerHtml}
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
        document.getElementById('compta-passif-total').innerHTML = `
            <tr style="background: rgba(16, 185, 129, 0.15); font-weight: 800; font-size: 14px;">
                <td colspan="4" style="text-align: right; color: #34d399; padding: 0.8rem 1rem;">TOTAL CAPITAUX PROPRES & PASSIF :</td>
                <td class="text-right text-emerald" style="font-family: monospace;">${formatCurrency(tot1)}</td>
                <td></td>
            </tr>
        `;
    } else {
        thead.innerHTML = `
            <tr>
                <th style="width: 100px;">Code PCN</th>
                <th style="width: 120px;">Compte</th>
                <th>Libellé PCN</th>
                <th class="text-right" style="width: 140px;">${compareYear1}</th>
                <th class="text-right" style="width: 140px;">${compareYear2}</th>
                <th class="text-right" style="width: 140px;">Variation (€)</th>
                <th class="text-right" style="width: 110px;">Variation (%)</th>
                <th class="text-center" style="width: 60px;">Détail</th>
            </tr>
        `;
        let html = '';
        items.forEach(it => {
            const v1 = it[`val_${compareYear1}`] || 0;
            const v2 = it[`val_${compareYear2}`] || 0;
            const diff = v2 - v1;
            const pct = v1 !== 0 ? (diff / Math.abs(v1)) * 100 : 0;
            tot1 += v1;
            tot2 += v2;
            const safeAcc = String(it.account).replace(/[^a-zA-Z0-9_-]/g, '_');
            const drawerHtml = buildDrawerHtml(it, 'passif', 'comparatif', 8);
            html += `
                <tr id="row-passif-${safeAcc}" class="compta-row" onclick="toggleComptaDrawer('passif', '${safeAcc}')">
                    <td class="text-bold text-cyan">${it.code}</td>
                    <td class="text-bold text-emerald" style="font-family: monospace;">${it.account}</td>
                    <td style="font-weight: 600; color: var(--text-main);">${it.libelle}</td>
                    <td class="text-right" style="font-family: monospace;">${formatCurrency(v1)}</td>
                    <td class="text-right" style="font-family: monospace;">${formatCurrency(v2)}</td>
                    <td class="text-right text-bold ${diff >= 0 ? 'text-emerald' : 'text-rose'}" style="font-family: monospace;">${diff >= 0 ? '+' : ''}${formatCurrency(diff)}</td>
                    <td class="text-right text-bold ${diff >= 0 ? 'text-emerald' : 'text-rose'}">${formatPercent(pct)}</td>
                    <td class="text-center">
                        <button id="btn-chevron-passif-${safeAcc}" class="btn-accordion-toggle" title="Ouvrir la tendina">
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    </td>
                </tr>
                <tr id="drawer-passif-${safeAcc}" class="compta-accordion-drawer" style="display: none;">
                    <td colspan="8" class="compta-drawer-cell">
                        ${drawerHtml}
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
        const totDiff = tot2 - tot1;
        const totPct = tot1 !== 0 ? (totDiff / Math.abs(tot1)) * 100 : 0;
        document.getElementById('compta-passif-total').innerHTML = `
            <tr style="background: rgba(16, 185, 129, 0.15); font-weight: 800; font-size: 14px;">
                <td colspan="3" style="text-align: right; color: #34d399; padding: 0.8rem 1rem;">TOTAL CAPITAUX PROPRES & PASSIF :</td>
                <td class="text-right" style="font-family: monospace;">${formatCurrency(tot1)}</td>
                <td class="text-right" style="font-family: monospace;">${formatCurrency(tot2)}</td>
                <td class="text-right ${totDiff >= 0 ? 'text-emerald' : 'text-rose'}" style="font-family: monospace;">${totDiff >= 0 ? '+' : ''}${formatCurrency(totDiff)}</td>
                <td class="text-right ${totDiff >= 0 ? 'text-emerald' : 'text-rose'}">${formatPercent(totPct)}</td>
                <td></td>
            </tr>
        `;
    }
}

function renderPnl(items) {
    const tbody = document.getElementById('compta-pnl-tbody');
    const thead = document.getElementById('compta-pnl-thead');
    if (!tbody || !thead) return;

    let tot1 = 0, tot2 = 0;

    if (comptaMode === 'single') {
        thead.innerHTML = `
            <tr>
                <th style="width: 120px;">Compte</th>
                <th>Libellé Charges & Pertes</th>
                <th>Catégorie</th>
                <th class="text-right" style="width: 180px;">Montant (${selectedSingleYear})</th>
                <th class="text-center" style="width: 75px;">Détail</th>
            </tr>
        `;
        let html = '';
        items.forEach(it => {
            const val = it[`val_${selectedSingleYear}`] || 0;
            tot1 += val;
            const safeAcc = String(it.code).replace(/[^a-zA-Z0-9_-]/g, '_');
            const drawerHtml = buildDrawerHtml(it, 'pnl', 'single', 5);
            html += `
                <tr id="row-pnl-${safeAcc}" class="compta-row" onclick="toggleComptaDrawer('pnl', '${safeAcc}')">
                    <td class="text-bold text-emerald" style="font-family: monospace;">${it.code}</td>
                    <td style="font-weight: 600; color: var(--text-main);">${it.libelle}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${it.category}</td>
                    <td class="text-right text-bold text-rose" style="font-family: monospace; font-size: 13.5px;">${formatCurrency(val)}</td>
                    <td class="text-center">
                        <button id="btn-chevron-pnl-${safeAcc}" class="btn-accordion-toggle" title="Ouvrir la tendina">
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    </td>
                </tr>
                <tr id="drawer-pnl-${safeAcc}" class="compta-accordion-drawer" style="display: none;">
                    <td colspan="5" class="compta-drawer-cell">
                        ${drawerHtml}
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
        document.getElementById('compta-pnl-total').innerHTML = `
            <tr style="background: rgba(244, 63, 94, 0.15); font-weight: 800; font-size: 14px;">
                <td colspan="3" style="text-align: right; color: #fb7185; padding: 0.8rem 1rem;">RÉSULTAT NET DE L'EXERCICE (PERTE) :</td>
                <td class="text-right text-rose" style="font-family: monospace;">${formatCurrency(tot1)}</td>
                <td></td>
            </tr>
        `;
    } else {
        thead.innerHTML = `
            <tr>
                <th style="width: 120px;">Compte</th>
                <th>Libellé Charges & Pertes</th>
                <th class="text-right" style="width: 140px;">${compareYear1}</th>
                <th class="text-right" style="width: 140px;">${compareYear2}</th>
                <th class="text-right" style="width: 140px;">Variation (€)</th>
                <th class="text-right" style="width: 110px;">Variation (%)</th>
                <th class="text-center" style="width: 60px;">Détail</th>
            </tr>
        `;
        let html = '';
        items.forEach(it => {
            const v1 = it[`val_${compareYear1}`] || 0;
            const v2 = it[`val_${compareYear2}`] || 0;
            const diff = v2 - v1;
            const pct = v1 !== 0 ? (diff / Math.abs(v1)) * 100 : 0;
            tot1 += v1;
            tot2 += v2;
            const safeAcc = String(it.code).replace(/[^a-zA-Z0-9_-]/g, '_');
            const drawerHtml = buildDrawerHtml(it, 'pnl', 'comparatif', 7);
            html += `
                <tr id="row-pnl-${safeAcc}" class="compta-row" onclick="toggleComptaDrawer('pnl', '${safeAcc}')">
                    <td class="text-bold text-emerald" style="font-family: monospace;">${it.code}</td>
                    <td style="font-weight: 600; color: var(--text-main);">${it.libelle}</td>
                    <td class="text-right text-rose" style="font-family: monospace;">${formatCurrency(v1)}</td>
                    <td class="text-right text-rose" style="font-family: monospace;">${formatCurrency(v2)}</td>
                    <td class="text-right text-bold ${diff >= 0 ? 'text-rose' : 'text-emerald'}" style="font-family: monospace;">${diff >= 0 ? '+' : ''}${formatCurrency(diff)}</td>
                    <td class="text-right text-bold ${diff >= 0 ? 'text-rose' : 'text-emerald'}">${formatPercent(pct)}</td>
                    <td class="text-center">
                        <button id="btn-chevron-pnl-${safeAcc}" class="btn-accordion-toggle" title="Ouvrir la tendina">
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    </td>
                </tr>
                <tr id="drawer-pnl-${safeAcc}" class="compta-accordion-drawer" style="display: none;">
                    <td colspan="7" class="compta-drawer-cell">
                        ${drawerHtml}
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
        const totDiff = tot2 - tot1;
        const totPct = tot1 !== 0 ? (totDiff / Math.abs(tot1)) * 100 : 0;
        document.getElementById('compta-pnl-total').innerHTML = `
            <tr style="background: rgba(244, 63, 94, 0.15); font-weight: 800; font-size: 14px;">
                <td colspan="2" style="text-align: right; color: #fb7185; padding: 0.8rem 1rem;">RÉSULTAT NET DE L'EXERCICE (PERTE) :</td>
                <td class="text-right text-rose" style="font-family: monospace;">${formatCurrency(tot1)}</td>
                <td class="text-right text-rose" style="font-family: monospace;">${formatCurrency(tot2)}</td>
                <td class="text-right ${totDiff >= 0 ? 'text-rose' : 'text-emerald'}" style="font-family: monospace;">${totDiff >= 0 ? '+' : ''}${formatCurrency(totDiff)}</td>
                <td class="text-right ${totDiff >= 0 ? 'text-rose' : 'text-emerald'}">${formatPercent(totPct)}</td>
                <td></td>
            </tr>
        `;
    }
}

function renderGrandLivre() {
    const tbody = document.getElementById('compta-gl-tbody');
    if (!tbody) return;

    const data = window.SOMBRA_RESORT_DATA;
    const txs = [...(data.transactions_olky || []), ...(data.transactions_revolut || [])];
    
    // Tri décroissant par date
    txs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    let html = '';
    txs.slice(0, 100).forEach(tx => {
        html += `
            <tr>
                <td style="font-family: monospace; color: var(--text-muted);">${tx.date || '-'}</td>
                <td class="text-bold text-cyan" style="font-family: monospace;">${tx.id}</td>
                <td style="font-weight: 600; color: var(--text-main);">${tx.desc || '-'}</td>
                <td><span class="badge ${tx.bank === 'olky' ? 'badge-blue' : 'badge-emerald'}">${tx.bank === 'olky' ? 'Olky Pay' : 'Revolut'}</span></td>
                <td style="font-size: 12px; color: var(--text-muted);">${tx.socio || tx.ordinante || tx.beneficiario || '-'}</td>
                <td class="text-right text-bold ${tx.amount >= 0 ? 'text-emerald' : 'text-rose'}" style="font-family: monospace;">
                    ${tx.amount >= 0 ? '+' : ''}${formatCurrency(tx.amount)}
                </td>
                <td class="text-right" style="font-family: monospace; color: var(--text-muted);">${formatCurrency(tx.balance)}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// Rétrocompatibilité si un bouton externe appelle openDrilldownModal
function openDrilldownModal(accountCode) {
    toggleComptaDrawer('actif', accountCode);
    toggleComptaDrawer('passif', accountCode);
    toggleComptaDrawer('pnl', accountCode);
}

function closeDrilldownModal() {
    // Rétrocompatibilité
}

function exportComptaExcel() {
    if (typeof XLSX === 'undefined') {
        alert("La bibliothèque SheetJS n'est pas encore chargée.");
        return;
    }
    const wb = XLSX.utils.book_new();
    const data = window.SOMBRA_RESORT_DATA;

    // Actif sheet
    const actifRows = (data.pcn_bilan_actif || []).map(it => ({
        "Code": it.code,
        "Compte": it.account,
        "Libellé": it.libelle,
        "Catégorie": it.category,
        "2024": it.val_2024,
        "2025": it.val_2025,
        "2026": it.val_2026
    }));
    const wsActif = XLSX.utils.json_to_sheet(actifRows);
    XLSX.utils.book_append_sheet(wb, wsActif, "Bilan Actif");

    // Passif sheet
    const passifRows = (data.pcn_bilan_passif || []).map(it => ({
        "Code": it.code,
        "Compte": it.account,
        "Libellé": it.libelle,
        "Catégorie": it.category,
        "2024": it.val_2024,
        "2025": it.val_2025,
        "2026": it.val_2026
    }));
    const wsPassif = XLSX.utils.json_to_sheet(passifRows);
    XLSX.utils.book_append_sheet(wb, wsPassif, "Bilan Passif");

    // P&L sheet
    const pnlRows = (data.pcn_pnl || []).map(it => ({
        "Compte": it.code,
        "Libellé": it.libelle,
        "Catégorie": it.category,
        "2024": it.val_2024,
        "2025": it.val_2025,
        "2026": it.val_2026
    }));
    const wsPnl = XLSX.utils.json_to_sheet(pnlRows);
    XLSX.utils.book_append_sheet(wb, wsPnl, "Pertes et Profits");

    XLSX.writeFile(wb, `SOMBRA_RESORT_Comptabilite_PCN_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

document.addEventListener('DOMContentLoaded', () => {
    renderComptaTables();
});
