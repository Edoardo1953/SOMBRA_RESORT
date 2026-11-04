/**
 * SOMBRA RESORT - Excel Importer & Live Data Sync
 * Permette di caricare direttamente dall'applicazione il foglio Excel di contabilità
 * (CONTA Sombra Resort Sàrl.xlsx) e aggiornare in tempo reale conti, transazioni e saldi.
 */

// 1. Inizializzazione: applica eventuali dati personalizzati memorizzati in LocalStorage
(function applySavedCustomData() {
    try {
        if (typeof localStorage === 'undefined') return;
        const raw = localStorage.getItem('sr_custom_data');
        if (raw && typeof window !== 'undefined' && window.SOMBRA_RESORT_DATA) {
            const custom = JSON.parse(raw);
            if (custom.transactions_revolut) window.SOMBRA_RESORT_DATA.transactions_revolut = custom.transactions_revolut;
            if (custom.transactions_olky) window.SOMBRA_RESORT_DATA.transactions_olky = custom.transactions_olky;
            if (custom.bank_accounts) {
                if (custom.bank_accounts.revolut) window.SOMBRA_RESORT_DATA.bank_accounts.revolut = custom.bank_accounts.revolut;
                if (custom.bank_accounts.olky) window.SOMBRA_RESORT_DATA.bank_accounts.olky = custom.bank_accounts.olky;
            }
            if (custom.pcn_bilan_actif) window.SOMBRA_RESORT_DATA.pcn_bilan_actif = custom.pcn_bilan_actif;
            if (custom.pcn_pnl) window.SOMBRA_RESORT_DATA.pcn_pnl = custom.pcn_pnl;
            if (custom.company && window.SOMBRA_RESORT_DATA.company) {
                window.SOMBRA_RESORT_DATA.company.updated_at = custom.company.updated_at || window.SOMBRA_RESORT_DATA.company.updated_at;
            }
        }
    } catch (e) {
        console.warn("Errore nell'applicazione dei dati personalizzati da LocalStorage", e);
    }
})();

// 2. Funzioni di estrazione celle da foglio SheetJS
function getExcelCell(ws, r, c) {
    if (!ws) return null;
    const colName = XLSX.utils.encode_col(c - 1);
    const addr = `${colName}${r}`;
    const cell = ws[addr];
    return cell ? cell.v : null;
}

function formatExcelDate(val, fallback) {
    if (!val) return fallback || '';
    if (val instanceof Date) {
        const y = val.getFullYear();
        const m = String(val.getMonth() + 1).padStart(2, '0');
        const d = String(val.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    return String(val).slice(0, 10);
}

// 3. Parser del file Excel
function parseContaWorkbook(workbook) {
    if (!workbook || !workbook.SheetNames) {
        throw new Error("File Excel non valido o illeggibile.");
    }

    const result = {
        revolut_txs: [],
        olkypay_txs: [],
        revolut_balance: 0.0,
        olky_balance: 0.0,
        pnl_updates: {}
    };

    // --- REVOLUT ---
    const ws_r = workbook.Sheets['Conto REVOLUT'];
    if (ws_r) {
        for (let r = 6; r <= 68; r++) {
            const nr = getExcelCell(ws_r, r, 2);
            const desc = getExcelCell(ws_r, r, 3);
            const ordinante = getExcelCell(ws_r, r, 4);
            const socio = getExcelCell(ws_r, r, 5);
            const beneficiario = getExcelCell(ws_r, r, 6);
            const d_compt = getExcelCell(ws_r, r, 7);
            const d_val = getExcelCell(ws_r, r, 8);
            const tot = getExcelCell(ws_r, r, 9);
            const solde = getExcelCell(ws_r, r, 10);

            if (desc && String(desc).trim()) {
                const amt = tot !== null && !isNaN(Number(tot)) ? Number(tot) : 0.0;
                const bal = solde !== null && !isNaN(Number(solde)) ? Number(solde) : 0.0;
                const dateStr = formatExcelDate(d_compt) || formatExcelDate(d_val) || '2026-03-04';

                result.revolut_txs.push({
                    id: `REV-${String(result.revolut_txs.length + 1).padStart(3, '0')}`,
                    nr: nr || (result.revolut_txs.length + 1),
                    desc: String(desc || '').trim(),
                    ordinante: String(ordinante || '').trim(),
                    socio: String(socio || '').trim(),
                    beneficiario: String(beneficiario || '').trim(),
                    date: dateStr,
                    amount: Math.round(amt * 100) / 100,
                    balance: Math.round(bal * 100) / 100,
                    bank: 'revolut'
                });
            }
        }
        if (result.revolut_txs.length > 0) {
            result.revolut_balance = result.revolut_txs[result.revolut_txs.length - 1].balance;
        }
    }

    // --- OLKYPAY ---
    const ws_o = workbook.Sheets['OLKYPAY'];
    if (ws_o) {
        for (let r = 6; r <= 170; r++) {
            const nr = getExcelCell(ws_o, r, 2);
            const desc = getExcelCell(ws_o, r, 3);
            const ordinante = getExcelCell(ws_o, r, 4);
            const socio = getExcelCell(ws_o, r, 5);
            const beneficiario = getExcelCell(ws_o, r, 6);
            const d_compt = getExcelCell(ws_o, r, 7);
            const d_val = getExcelCell(ws_o, r, 8);
            const tot = getExcelCell(ws_o, r, 9);
            const solde = getExcelCell(ws_o, r, 10);

            if (desc && String(desc).trim()) {
                const amt = tot !== null && !isNaN(Number(tot)) ? Number(tot) : 0.0;
                const bal = solde !== null && !isNaN(Number(solde)) ? Number(solde) : 0.0;
                const dateStr = formatExcelDate(d_compt) || formatExcelDate(d_val) || '2021-10-11';

                result.olkypay_txs.push({
                    id: `OLK-${String(result.olkypay_txs.length + 1).padStart(3, '0')}`,
                    nr: nr || (result.olkypay_txs.length + 1),
                    desc: String(desc || '').trim(),
                    ordinante: String(ordinante || '').trim(),
                    socio: String(socio || '').trim(),
                    beneficiario: String(beneficiario || '').trim(),
                    date: dateStr,
                    amount: Math.round(amt * 100) / 100,
                    balance: Math.round(bal * 100) / 100,
                    bank: 'olky'
                });
            }
        }
        if (result.olkypay_txs.length > 0) {
            result.olky_balance = result.olkypay_txs[result.olkypay_txs.length - 1].balance;
        }
    }

    return result;
}

// 4. Applicazione dei dati estratti allo stato globale
function applyParsedDataToApp(parsed) {
    if (typeof window === 'undefined' || !window.SOMBRA_RESORT_DATA) return;

    const data = window.SOMBRA_RESORT_DATA;

    if (parsed.revolut_txs && parsed.revolut_txs.length > 0) {
        data.transactions_revolut = parsed.revolut_txs;
        if (data.bank_accounts && data.bank_accounts.revolut) {
            data.bank_accounts.revolut.balance_current = parsed.revolut_balance;
        }
    }

    if (parsed.olkypay_txs && parsed.olkypay_txs.length > 0) {
        data.transactions_olky = parsed.olkypay_txs;
        if (data.bank_accounts && data.bank_accounts.olky) {
            data.bank_accounts.olky.balance_current = parsed.olky_balance;
        }
    }

    // Aggiorna Bilan Actif (Revolut)
    if (data.pcn_bilan_actif) {
        const revRow = data.pcn_bilan_actif.find(r => r.account === '5132000');
        if (revRow) revRow.val_2026 = parsed.revolut_balance;
    }

    // Timestamp
    const now = new Date();
    const tsStr = `${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR')}`;
    if (data.company) {
        data.company.updated_at = tsStr;
    }

    // Salva in LocalStorage
    if (typeof localStorage !== 'undefined') {
        const toSave = {
            transactions_revolut: data.transactions_revolut,
            transactions_olky: data.transactions_olky,
            bank_accounts: data.bank_accounts,
            pcn_bilan_actif: data.pcn_bilan_actif,
            pcn_pnl: data.pcn_pnl,
            company: { updated_at: tsStr }
        };
        localStorage.setItem('sr_custom_data', JSON.stringify(toSave));
        localStorage.setItem('sr_data_last_import', tsStr);
    }

    // Re-render viste correnti
    if (typeof renderBankView === 'function') {
        try { renderBankView(); } catch(e) { console.error(e); }
    }
    if (typeof renderComptaView === 'function') {
        try { renderComptaView(); } catch(e) { console.error(e); }
    }
    if (typeof renderDocumentsView === 'function') {
        try { renderDocumentsView(); } catch(e) { console.error(e); }
    }
}

// 5. Gestione Modale e File Input
function openImportExcelModal() {
    if (typeof document === 'undefined') return;
    let modal = document.getElementById('importExcelModal');
    if (!modal) {
        injectImportModalHtml();
        modal = document.getElementById('importExcelModal');
    }
    if (modal) {
        modal.style.display = 'flex';
        resetImportModalState();
    }
}

function closeImportExcelModal() {
    if (typeof document === 'undefined') return;
    const modal = document.getElementById('importExcelModal');
    if (modal) modal.style.display = 'none';
}

function resetImportModalState() {
    if (typeof document === 'undefined') return;
    const fileInput = document.getElementById('sr-excel-file-input');
    if (fileInput) fileInput.value = '';
    const statusDiv = document.getElementById('sr-import-status');
    if (statusDiv) statusDiv.innerHTML = '';
    const actionsDiv = document.getElementById('sr-import-actions');
    if (actionsDiv) actionsDiv.style.display = 'none';
}

function handleExcelFileSelect(event) {
    const file = event.target.files ? event.target.files[0] : (event.dataTransfer ? event.dataTransfer.files[0] : null);
    if (!file) return;

    const statusDiv = document.getElementById('sr-import-status');
    if (!statusDiv) return;

    statusDiv.innerHTML = `
        <div style="padding: 12px; background: rgba(59, 130, 246, 0.15); border: 1px solid #3b82f6; border-radius: 8px; color: #93c5fd; display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-spinner fa-spin"></i> Lettura e analisi del file <strong>${file.name}</strong> (${(file.size / 1024).toFixed(0)} KB)...
        </div>
    `;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            const parsed = parseContaWorkbook(workbook);

            // Applica subito
            applyParsedDataToApp(parsed);

            const formatAmount = typeof formatCurrencyEur === 'function' ? formatCurrencyEur : (v) => `${Number(v).toFixed(2)} €`;

            // Mostra successo
            statusDiv.innerHTML = `
                <div style="padding: 16px; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 8px; color: #6ee7b7;">
                    <div style="font-weight: 700; font-size: 15px; margin-bottom: 8px;">
                        <i class="fa-solid fa-circle-check"></i> Aggiornamento completato con successo!
                    </div>
                    <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #e2e8f0;">
                        <li><strong>Conto Revolut Business:</strong> ${parsed.revolut_txs.length} movimenti rilevati • <strong>Nuovo Saldo: ${formatAmount(parsed.revolut_balance)}</strong></li>
                        <li><strong>Conto Olky Pay:</strong> ${parsed.olkypay_txs.length} movimenti rilevati • <strong>Saldo: ${formatAmount(parsed.olky_balance)}</strong></li>
                        <li>I dati sono stati aggiornati a schermo e salvati nella memoria del browser.</li>
                    </ul>
                </div>
            `;

            const actionsDiv = document.getElementById('sr-import-actions');
            if (actionsDiv) actionsDiv.style.display = 'flex';

        } catch (err) {
            console.error(err);
            statusDiv.innerHTML = `
                <div style="padding: 12px; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 8px; color: #fca5a5;">
                    <i class="fa-solid fa-triangle-exclamation"></i> <strong>Errore durante l'analisi dell'Excel:</strong> ${err.message}
                </div>
            `;
        }
    };
    reader.readAsArrayBuffer(file);
}

// 6. Download del data.js aggiornato generato direttamente nel browser
function downloadUpdatedDataJs() {
    if (typeof window === 'undefined' || !window.SOMBRA_RESORT_DATA) return;
    const content = "/**\n * SOMBRA_RESORT - Base de Données Centralisée\n * Société : SOMBRA E AGUA FRESCA RESORT S.à r.l. (Luxembourg, RCS B263295)\n * Filiale : SOMBRA RESORT BRASIL SOCIEDADE UNIPESSOAL LTDA (CNPJ 43.730.206/0001-80)\n */\n\nwindow.SOMBRA_RESORT_DATA = " + JSON.stringify(window.SOMBRA_RESORT_DATA, null, 2) + ";\n";
    const blob = new Blob([content], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 7. Ripristino dei dati predefiniti (cancella cache LocalStorage)
function resetToOriginalData() {
    if (confirm("Vuoi ripristinare i dati predefiniti di data.js cancellando le modifiche caricate localmente?")) {
        localStorage.removeItem('sr_custom_data');
        localStorage.removeItem('sr_data_last_import');
        window.location.reload();
    }
}

// 8. Iniezione HTML della modale
function injectImportModalHtml() {
    if (typeof document === 'undefined' || document.getElementById('importExcelModal')) return;

    const modalHtml = `
    <div id="importExcelModal" class="modal-backdrop" style="display: none; align-items: center; justify-content: center; z-index: 9999;">
        <div class="modal-card glass-panel" style="max-width: 580px; width: 92%; border: 1px solid rgba(16, 185, 129, 0.4); box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
            <div class="modal-header" style="border-bottom: 1px solid var(--border-color); padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 1.15rem; color: var(--text-main); display: flex; align-items: center; gap: 10px;">
                    <i class="fa-solid fa-file-excel text-emerald" style="font-size: 20px;"></i>
                    <span>Aggiorna Contabilità & C/C da Excel</span>
                </h3>
                <button class="btn-icon" onclick="closeImportExcelModal()" style="background: none; border: none; font-size: 18px; color: var(--text-muted); cursor: pointer;"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="modal-body" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 16px;">
                <p style="margin: 0; font-size: 13.5px; color: var(--text-muted); line-height: 1.5;">
                    Seleziona o trascina il nuovo file <code>CONTA Sombra Resort Sàrl.xlsx</code>. L'applicazione elaborerà automaticamente i fogli <strong>Conto REVOLUT</strong> e <strong>OLKYPAY</strong>, aggiornando istantaneamente saldi, scritture e contabilità a schermo.
                </p>

                <!-- Dropzone / Input -->
                <div style="border: 2px dashed rgba(16, 185, 129, 0.4); border-radius: 12px; padding: 2rem 1.5rem; text-align: center; background: rgba(16, 185, 129, 0.04); cursor: pointer; transition: all 0.2s;"
                     onclick="document.getElementById('sr-excel-file-input').click()"
                     ondragover="event.preventDefault(); this.style.borderColor='#10b981';"
                     ondragleave="this.style.borderColor='rgba(16, 185, 129, 0.4)';"
                     ondrop="event.preventDefault(); this.style.borderColor='rgba(16, 185, 129, 0.4)'; handleExcelFileSelect(event);">
                    <i class="fa-solid fa-cloud-arrow-up text-emerald" style="font-size: 38px; margin-bottom: 12px; display: block;"></i>
                    <div style="font-weight: 600; color: var(--text-main); font-size: 15px; margin-bottom: 4px;">Clicca per scegliere il file Excel o trascinalo qui</div>
                    <div style="font-size: 12px; color: var(--text-muted);">Supporta file .xlsx (es. CONTA Sombra Resort Sàrl.xlsx)</div>
                    <input type="file" id="sr-excel-file-input" accept=".xlsx" style="display: none;" onchange="handleExcelFileSelect(event)">
                </div>

                <!-- Status Feedback -->
                <div id="sr-import-status"></div>

                <!-- Action buttons after import -->
                <div id="sr-import-actions" style="display: none; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-top: 5px;">
                    <button type="button" class="btn btn-secondary" onclick="downloadUpdatedDataJs()" style="font-size: 12.5px;">
                        <i class="fa-solid fa-download"></i> Scarica data.js per Git
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="resetToOriginalData()" style="font-size: 12.5px; color: #ef4444; border-color: rgba(239, 68, 68, 0.3);">
                        <i class="fa-solid fa-rotate-left"></i> Ripristina Dati
                    </button>
                </div>
            </div>
            <div class="modal-footer" style="padding: 1rem 1.5rem; text-align: right; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 10px;">
                <button type="button" class="btn btn-secondary" onclick="closeImportExcelModal()">Chiudi</button>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Auto-inject modal quando il DOM è pronto
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectImportModalHtml);
    } else {
        injectImportModalHtml();
    }
}
