/**
 * SOMBRA_RESORT - Trésorerie & Comptes Bancaires
 * Multi-comptes : Olky Pay (Luxembourg), Revolut Business (Luxembourg), Banco do Brasil (Brésil)
 */

let selectedBankFilter = 'all';
let searchQuery = '';
let selectedCategoryFilter = 'all';

function formatCurrencyEur(val) {
    if (val === null || val === undefined || isNaN(val)) return "0,00 €";
    const num = Number(val);
    const parts = num.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",") + " €";
}

function formatCurrencyBrl(val) {
    if (val === null || val === undefined || isNaN(val)) return "R$ 0,00";
    const num = Number(val);
    const parts = num.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return "R$ " + parts.join(",");
}

function getAllTransactions() {
    const data = window.SOMBRA_RESORT_DATA;
    if (!data) return [];

    let txs = [];
    if (data.transactions_olky) txs = txs.concat(data.transactions_olky);
    if (data.transactions_revolut) txs = txs.concat(data.transactions_revolut);
    // Les écritures Banco do Brasil sont désormais gérées exclusivement dans partecipazioni.html

    // Merge custom added txs
    try {
        const custom = localStorage.getItem('sr_custom_bank_txs');
        if (custom) {
            const parsed = JSON.parse(custom);
            if (Array.isArray(parsed)) txs = txs.concat(parsed);
        }
    } catch(e) {}

    // Sort descending by date
    txs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return txs;
}

function renderBankView() {
    const data = window.SOMBRA_RESORT_DATA;
    if (!data) return;

    // Render Balances cards
    const olky = data.bank_accounts.olky;
    const rev = data.bank_accounts.revolut;
    const bb = data.bank_accounts.bb_brasil;

    if (document.getElementById('bal-olky')) {
        document.getElementById('bal-olky').textContent = formatCurrencyEur(olky.balance_current);
        document.getElementById('bal-rev').textContent = formatCurrencyEur(rev.balance_current);
        const totalEur = (olky.balance_current || 0) + (rev.balance_current || 0);
        const totalEl = document.getElementById('bal-total-eur');
        if (totalEl) totalEl.textContent = formatCurrencyEur(totalEur);
    }

    // Filter transactions
    const all = getAllTransactions();
    const filtered = all.filter(tx => {
        if (selectedBankFilter !== 'all' && tx.bank !== selectedBankFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchesDesc = (tx.desc || '').toLowerCase().includes(q);
            const matchesOrd = (tx.ordinante || '').toLowerCase().includes(q);
            const matchesSocio = (tx.socio || '').toLowerCase().includes(q);
            const matchesBen = (tx.beneficiario || '').toLowerCase().includes(q);
            const matchesSogg = (tx.soggetto || '').toLowerCase().includes(q);
            const matchesId = (tx.id || '').toLowerCase().includes(q);
            if (!matchesDesc && !matchesOrd && !matchesSocio && !matchesBen && !matchesSogg && !matchesId) {
                return false;
            }
        }
        return true;
    });

    renderTransactionsTable(filtered);
}

function renderTransactionsTable(txs) {
    const tbody = document.getElementById('bank-tx-tbody');
    const countEl = document.getElementById('bank-tx-count');
    if (!tbody) return;

    if (countEl) countEl.textContent = `${txs.length} opérations trouvées`;

    let html = '';
    txs.forEach(tx => {
        const isBrl = tx.currency === 'BRL';
        const formattedAmount = isBrl ? formatCurrencyBrl(tx.amount) : formatCurrencyEur(tx.amount);
        const formattedBal = isBrl ? formatCurrencyBrl(tx.balance) : formatCurrencyEur(tx.balance);

        let bankBadge = '';
        if (tx.bank === 'olky') {
            bankBadge = '<span class="badge badge-secondary" style="font-size: 11px;">Olky Pay (Lux)</span>';
        } else if (tx.bank === 'revolut') {
            bankBadge = '<span class="badge badge-emerald" style="font-size: 11px;">Revolut EUR</span>';
        } else {
            bankBadge = '<span class="badge badge-amber" style="font-size: 11px; background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4);">Banco do Brasil</span>';
        }

        const tier = tx.socio || tx.ordinante || tx.beneficiario || tx.soggetto || '-';

        html += `
            <tr>
                <td style="font-family: monospace; color: var(--text-muted); font-size: 12px;">${tx.date || '-'}</td>
                <td class="text-bold text-cyan" style="font-family: monospace; font-size: 12px;">${tx.id}</td>
                <td>${bankBadge}</td>
                <td style="font-weight: 600; color: var(--text-main);">${tx.desc || '-'}</td>
                <td style="font-size: 12px; color: var(--text-muted);">${tier}</td>
                <td class="text-right text-bold ${tx.amount >= 0 ? 'text-emerald' : 'text-rose'}" style="font-family: monospace; font-size: 13.5px;">
                    ${tx.amount >= 0 ? '+' : ''}${formattedAmount}
                </td>
                <td class="text-right" style="font-family: monospace; color: var(--text-muted); font-size: 12.5px;">
                    ${formattedBal}
                </td>
            </tr>
        `;
    });

    if (txs.length === 0) {
        html = `<tr><td colspan="7" class="text-center" style="padding: 3rem; color: var(--text-muted);">Aucune opération correspondant aux critères de recherche.</td></tr>`;
    }

    tbody.innerHTML = html;
}

function filterByBank(bank) {
    selectedBankFilter = bank;
    document.querySelectorAll('.bank-filter-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-bank') === bank);
    });
    renderBankView();
}

function onSearchInput(val) {
    searchQuery = val.trim();
    renderBankView();
}

function openAddTxModal() {
    if (!canUserEdit()) {
        alert("Vous n'avez pas l'autorisation d'ajouter une transaction (profil lecture seule).");
        return;
    }
    const modal = document.getElementById('addTxModal');
    if (modal) modal.style.display = 'flex';
}

function closeAddTxModal() {
    const modal = document.getElementById('addTxModal');
    if (modal) modal.style.display = 'none';
}

function saveNewTransaction(e) {
    e.preventDefault();
    const bank = document.getElementById('tx-bank').value;
    const desc = document.getElementById('tx-desc').value;
    const tier = document.getElementById('tx-tier').value;
    const date = document.getElementById('tx-date').value || new Date().toISOString().slice(0, 10);
    const amount = parseFloat(document.getElementById('tx-amount').value) || 0;

    const newTx = {
        id: `TX-${Date.now().toString().slice(-4)}`,
        nr: 999,
        bank: bank,
        desc: desc,
        ordinante: tier,
        socio: tier,
        beneficiario: tier,
        date: date,
        amount: amount,
        balance: 0,
        currency: (bank === 'bb_brasil') ? 'BRL' : 'EUR'
    };

    let custom = [];
    try {
        const saved = localStorage.getItem('sr_custom_bank_txs');
        if (saved) custom = JSON.parse(saved);
    } catch(err) {}

    custom.push(newTx);
    localStorage.setItem('sr_custom_bank_txs', JSON.stringify(custom));

    closeAddTxModal();
    renderBankView();
    showVisibilityToast("Opération bancaire enregistrée avec succès !", true);
}

function exportBankExcel() {
    if (typeof XLSX === 'undefined') {
        alert("SheetJS non chargé.");
        return;
    }
    const txs = getAllTransactions();
    const wb = XLSX.utils.book_new();
    const rows = txs.map(t => ({
        "ID": t.id,
        "Date": t.date,
        "Banque": t.bank,
        "Description": t.desc,
        "Tiers": t.socio || t.ordinante || t.beneficiario || t.soggetto || '',
        "Montant": t.amount,
        "Devise": t.currency || 'EUR',
        "Solde": t.balance
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Relevé Trésorerie");
    XLSX.writeFile(wb, `SOMBRA_RESORT_Tresorerie_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

document.addEventListener('DOMContentLoaded', () => {
    renderBankView();
});
