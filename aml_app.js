/**
 * SOMBRA_RESORT - Conformité AML / LBC-FT & Registre KYC
 * Cadre : Loi luxembourgeoise du 12 nov 2004 modifiée, Circulaires CSSF & AED
 */

const AML_KYC_PARTNERS = [
    {
        id: "KYC-01",
        name: "NEW LIFE S.à r.l.",
        type: "Personne Morale (Sàrl)",
        country: "Luxembourg",
        risk_score: 18,
        risk_level: "Faible",
        risk_color: "emerald",
        ubo: "Edoardo Tubia",
        pep: "Non",
        shares: 2245,
        shares_pct: "14,97 %",
        villa: "Villa H",
        id_doc: "Extrait RCSL B 17790 • RBE Certifié",
        verification_date: "14/05/2026",
        source_funds: "Actifs immobiliers & placements propres",
        bacen_compliance: "Conforme RDE-IED Bacen",
        status: "Validé"
    },
    {
        id: "KYC-02",
        name: "COFRE LUXEMBOURG WIND S.A.",
        type: "Personne Morale (S.A.)",
        country: "Luxembourg",
        risk_score: 22,
        risk_level: "Faible",
        risk_color: "emerald",
        ubo: "Baguanier Henri (100%)",
        pep: "Non",
        shares: 2036,
        shares_pct: "13,57 %",
        villa: "Villa C",
        id_doc: "Extrait RCSL B 187520 • Registre RBE",
        verification_date: "12/05/2026",
        source_funds: "Fonds propres corporatifs luxembourgeois",
        bacen_compliance: "Conforme RDE-IED Bacen",
        status: "Validé"
    },
    {
        id: "KYC-03",
        name: "HEMAWITI Susik",
        type: "Personne Physique",
        country: "Indonésie",
        risk_score: 42,
        risk_level: "Moyen",
        risk_color: "amber",
        ubo: "Susik Hemawiti",
        pep: "Non",
        shares: 1796,
        shares_pct: "11,97 %",
        villa: "Villa G",
        id_doc: "Passeport Indonésien certifié • Justificatif Domicile Bantul",
        verification_date: "10/05/2026",
        source_funds: "Patrimoine familial et activités commerciales",
        bacen_compliance: "Conforme Bacen",
        status: "Validé"
    },
    {
        id: "KYC-04",
        name: "BARBANCEY Michel",
        type: "Personne Physique",
        country: "Luxembourg",
        risk_score: 15,
        risk_level: "Faible",
        risk_color: "emerald",
        ubo: "Michel Barbancey",
        pep: "Non",
        shares: 1482,
        shares_pct: "9,88 %",
        villa: "Villa I",
        id_doc: "Carte Nationale d'Identité luxembourgeoise",
        verification_date: "14/05/2026",
        source_funds: "Épargne personnelle & revenus d'administrateur",
        bacen_compliance: "Conforme",
        status: "Validé"
    },
    {
        id: "KYC-05",
        name: "TUBIA Silvia",
        type: "Personne Physique",
        country: "Luxembourg",
        risk_score: 12,
        risk_level: "Faible",
        risk_color: "emerald",
        ubo: "Silvia Tubia",
        pep: "Non",
        shares: 1452,
        shares_pct: "9,68 %",
        villa: "Villa F",
        id_doc: "Passeport UE • Justificatif résidence Strassen",
        verification_date: "08/05/2026",
        source_funds: "Épargne personnelle",
        bacen_compliance: "Conforme",
        status: "Validé"
    },
    {
        id: "KYC-06",
        name: "TUBIA Enrico",
        type: "Personne Physique",
        country: "Hong Kong",
        risk_score: 38,
        risk_level: "Moyen",
        risk_color: "amber",
        ubo: "Enrico Tubia",
        pep: "Non",
        shares: 1452,
        shares_pct: "9,68 %",
        villa: "Villa E",
        id_doc: "HK ID Card & Passeport certifié apostillé",
        verification_date: "05/05/2026",
        source_funds: "Revenus professionnels et gestion de fortune",
        bacen_compliance: "Conforme",
        status: "Validé"
    },
    {
        id: "KYC-07",
        name: "LAMBERT Ingrid Monique Yvonne",
        type: "Personne Physique",
        country: "Luxembourg",
        risk_score: 14,
        risk_level: "Faible",
        risk_color: "emerald",
        ubo: "Ingrid Lambert",
        pep: "Non",
        shares: 763,
        shares_pct: "5,09 %",
        villa: "Villa D",
        id_doc: "Carte d'identité luxembourgeoise • Hobscheid",
        verification_date: "12/05/2026",
        source_funds: "Patrimoine privé",
        bacen_compliance: "Conforme",
        status: "Validé"
    },
    {
        id: "KYC-08",
        name: "RAGGI Giancarlo",
        type: "Personne Physique",
        country: "Luxembourg",
        risk_score: 16,
        risk_level: "Faible",
        risk_color: "emerald",
        ubo: "Giancarlo Raggi",
        pep: "Non",
        shares: 749,
        shares_pct: "4,99 %",
        villa: "Villa D",
        id_doc: "Pièce d'identité luxembourgeoise",
        verification_date: "11/05/2026",
        source_funds: "Épargne privée",
        bacen_compliance: "Conforme",
        status: "Validé"
    },
    {
        id: "KYC-09",
        name: "OLIVEIRA DA COSTA Christine Anne",
        type: "Personne Physique",
        country: "Luxembourg",
        risk_score: 15,
        risk_level: "Faible",
        risk_color: "emerald",
        ubo: "Christine Oliveira",
        pep: "Non",
        shares: 659,
        shares_pct: "4,39 %",
        villa: "Villa A",
        id_doc: "Carte d'identité luxembourgeoise • Mondercange",
        verification_date: "09/05/2026",
        source_funds: "Revenus d'activité",
        bacen_compliance: "Conforme",
        status: "Validé"
    },
    {
        id: "KYC-10",
        name: "LIESEN Jens",
        type: "Personne Physique",
        country: "Luxembourg",
        risk_score: 15,
        risk_level: "Faible",
        risk_color: "emerald",
        ubo: "Jens Liesen",
        pep: "Non",
        shares: 659,
        shares_pct: "4,39 %",
        villa: "Villa A",
        id_doc: "Carte d'identité luxembourgeoise • Mondercange",
        verification_date: "09/05/2026",
        source_funds: "Revenus professionnels",
        bacen_compliance: "Conforme",
        status: "Validé"
    },
    {
        id: "KYC-11",
        name: "VIGNOLLE Gabriel Alexander",
        type: "Personne Physique",
        country: "Autriche",
        risk_score: 16,
        risk_level: "Faible",
        risk_color: "emerald",
        ubo: "Gabriel Alexander Vignolle",
        pep: "Non",
        shares: 600,
        shares_pct: "4,00 %",
        villa: "Villa B",
        id_doc: "Reisepass Autrichien",
        verification_date: "06/05/2026",
        source_funds: "Patrimoine personnel",
        bacen_compliance: "Conforme",
        status: "Validé"
    },
    {
        id: "KYC-12",
        name: "VIGNOLLE Matteo Dominik",
        type: "Personne Physique",
        country: "Pays-Bas",
        risk_score: 16,
        risk_level: "Faible",
        risk_color: "emerald",
        ubo: "Matteo Dominik Vignolle",
        pep: "Non",
        shares: 600,
        shares_pct: "4,00 %",
        villa: "Villa B",
        id_doc: "Paspoort néerlandais",
        verification_date: "06/05/2026",
        source_funds: "Patrimoine personnel",
        bacen_compliance: "Conforme",
        status: "Validé"
    },
    {
        id: "KYC-13",
        name: "VIGNOLLE Giorgio",
        type: "Personne Physique (Gérant)",
        country: "Luxembourg",
        risk_score: 14,
        risk_level: "Faible",
        risk_color: "emerald",
        ubo: "Giorgio Vignolle",
        pep: "Non",
        shares: 372,
        shares_pct: "2,48 %",
        villa: "Villa B",
        id_doc: "Carte d'identité luxembourgeoise • Luxembourg-Beggen",
        verification_date: "06/05/2026",
        source_funds: "Activités professionnelles et gestion",
        bacen_compliance: "Conforme",
        status: "Validé"
    },
    {
        id: "KYC-14",
        name: "NEW LIFE S.à r.l.",
        type: "Personne Morale (Sàrl)",
        country: "Luxembourg",
        risk_score: 14,
        risk_level: "Faible",
        risk_color: "emerald",
        ubo: "Edoardo Tubia",
        pep: "Non",
        shares: 135,
        shares_pct: "0,90 %",
        villa: "Villa F",
        id_doc: "Extrait RCSL B 17790 • RBE Certifié",
        verification_date: "14/05/2026",
        source_funds: "Fonds propres NEW LIFE Sàrl & investissements",
        bacen_compliance: "Conforme Bacen RDE-IED",
        status: "Validé"
    }
];

function renderAmlView() {
    const tbody = document.getElementById('aml-partners-tbody');
    if (!tbody) return;

    let html = '';
    // Trié par Villa (Villa A -> Villa I)
    const sortedList = [...AML_KYC_PARTNERS].sort((a, b) => {
        if (a.villa < b.villa) return -1;
        if (a.villa > b.villa) return 1;
        return (parseFloat(b.shares_pct) || 0) - (parseFloat(a.shares_pct) || 0);
    });

    sortedList.forEach(p => {
        const badgeColor = p.risk_level === 'Faible' ? 'badge-emerald' : (p.risk_level === 'Moyen' ? 'badge-amber' : 'badge-rose');
        html += `
            <tr onclick="openKycModal('${p.id}')" style="cursor: pointer;">
                <td class="text-bold text-cyan" style="font-family: monospace;">${p.id}</td>
                <td>
                    <div style="font-weight: 600; color: var(--text-main);">${p.name}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${p.type} • ${p.country}</div>
                </td>
                <td><span class="badge badge-villa">${p.villa}</span></td>
                <td class="text-right text-bold" style="font-family: monospace;">${p.shares} (${p.shares_pct})</td>
                <td style="font-size: 12px; color: var(--text-muted);">${p.ubo}</td>
                <td class="text-center"><span class="badge ${p.pep === 'Oui' ? 'badge-rose' : 'badge-secondary'}">${p.pep}</span></td>
                <td class="text-center">
                    <span class="badge ${badgeColor}" style="font-weight: 700;">${p.risk_score}/100 • ${p.risk_level}</span>
                </td>
                <td class="text-center"><span class="badge badge-success"><i class="fa-solid fa-check"></i> ${p.status}</span></td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function openKycModal(id) {
    const p = AML_KYC_PARTNERS.find(x => x.id === id);
    if (!p) return;

    const modal = document.getElementById('kycDetailModal');
    if (!modal) return;

    document.getElementById('kyc-modal-name').textContent = p.name;
    document.getElementById('kyc-modal-body').innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
            <div class="glass-panel" style="padding: 14px;">
                <div style="font-size: 11px; color: var(--text-muted);">IDENTIFIANT & VILLA</div>
                <div style="font-weight: 700; color: #38bdf8; font-size: 15px;">${p.id} • ${p.villa}</div>
            </div>
            <div class="glass-panel" style="padding: 14px;">
                <div style="font-size: 11px; color: var(--text-muted);">SCORE DE RISQUE AML</div>
                <div style="font-weight: 700; color: ${p.risk_level === 'Faible' ? '#34d399' : '#fbbf24'}; font-size: 15px;">${p.risk_score} / 100 (${p.risk_level})</div>
            </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Bénéficiaire Effectif (UBO) :</td><td style="font-weight: 600; text-align: right;">${p.ubo}</td></tr>
            <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Juridiction de Résidence :</td><td style="font-weight: 600; text-align: right;">${p.country}</td></tr>
            <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Document d'Identité / Registre :</td><td style="font-weight: 600; text-align: right;">${p.id_doc}</td></tr>
            <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Personne Politiquement Exposée (PEP) :</td><td style="font-weight: 600; text-align: right;">${p.pep}</td></tr>
            <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Origine des Fonds :</td><td style="font-weight: 600; text-align: right;">${p.source_funds}</td></tr>
            <tr style="border-bottom: 1px solid var(--border-color);"><td style="padding: 8px 0; color: var(--text-muted);">Conformité Transfrontalière Bacen :</td><td style="font-weight: 600; text-align: right;">${p.bacen_compliance}</td></tr>
            <tr><td style="padding: 8px 0; color: var(--text-muted);">Date de Contrôle :</td><td style="font-weight: 600; text-align: right;">${p.verification_date}</td></tr>
        </table>
    `;

    modal.style.display = 'flex';
}

function closeKycModal() {
    const modal = document.getElementById('kycDetailModal');
    if (modal) modal.style.display = 'none';
}

// Calculate Risk Simulator
function calculateRiskSimulator() {
    const jur = document.getElementById('sim-jurisdiction').value;
    const pep = document.getElementById('sim-pep').value;
    const type = document.getElementById('sim-type').value;
    const amount = parseFloat(document.getElementById('sim-amount').value) || 0;

    let score = 10;
    if (jur === 'medium') score += 15;
    if (jur === 'high') score += 35;
    if (pep === 'yes') score += 40;
    if (type === 'complex') score += 20;
    if (amount > 1000000) score += 15;
    else if (amount > 200000) score += 10;

    score = Math.min(100, score);

    let level = 'Faible';
    let color = '#34d399';
    let alertClass = 'badge-emerald';
    if (score >= 60) {
        level = 'Élevé';
        color = '#fb7185';
        alertClass = 'badge-rose';
    } else if (score >= 35) {
        level = 'Moyen';
        color = '#fbbf24';
        alertClass = 'badge-amber';
    }

    document.getElementById('sim-result-score').textContent = `${score}/100`;
    document.getElementById('sim-result-score').style.color = color;
    document.getElementById('sim-result-badge').textContent = `Risque ${level}`;
    document.getElementById('sim-result-badge').className = `badge ${alertClass}`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderAmlView();
});
