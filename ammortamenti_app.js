/**
 * SOMBRA_RESORT - Amortissements & Immobilisations Controller
 */

function formatCurrencyEur(val) {
    if (val === null || val === undefined || isNaN(val)) return "0,00 €";
    const num = Number(val);
    const parts = num.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",") + " €";
}

function renderAmortView() {
    const data = window.SOMBRA_RESORT_AMORT;
    if (!data) return;

    const container = document.getElementById('amort-assets-grid');
    if (!container) return;

    let html = '';
    data.assets.forEach(ast => {
        let rowsHtml = '';
        ast.schedule.forEach(sc => {
            rowsHtml += `
                <tr>
                    <td class="text-bold" style="font-family: monospace;">${sc.year}</td>
                    <td class="text-right" style="font-family: monospace;">${formatCurrencyEur(sc.val_debut)}</td>
                    <td class="text-right text-rose" style="font-family: monospace;">${formatCurrencyEur(sc.annuite)}</td>
                    <td class="text-right text-muted" style="font-family: monospace;">${formatCurrencyEur(sc.cumul)}</td>
                    <td class="text-right text-bold text-emerald" style="font-family: monospace;">${formatCurrencyEur(sc.vnc)}</td>
                </tr>
            `;
        });

        html += `
            <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div>
                        <span class="badge badge-emerald" style="margin-bottom: 0.4rem;">${ast.category_code} - ${ast.category_name}</span>
                        <h3 style="color: var(--text-main); font-size: 1.15rem; margin-top: 0.25rem;">${ast.name}</h3>
                        <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">Réf : ${ast.invoice_ref} • Fournisseur : ${ast.supplier}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.8rem; color: var(--text-muted);">VALEUR IMMOBILISÉE</div>
                        <div style="font-size: 1.35rem; font-weight: 800; color: #38bdf8; font-family: monospace;">${formatCurrencyEur(ast.initial_value)}</div>
                        <div style="font-size: 0.75rem; color: #34d399;"><i class="fa-solid fa-circle-check"></i> ${ast.status}</div>
                    </div>
                </div>

                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; background: rgba(0,0,0,0.2); padding: 0.75rem 1rem; border-radius: 8px;">
                    <i class="fa-solid fa-circle-info text-cyan"></i> <strong>Méthode :</strong> ${ast.method} • <em>${ast.note}</em>
                </div>

                <div class="table-responsive">
                    <table class="data-table" style="font-size: 0.85rem;">
                        <thead>
                            <tr>
                                <th>Exercice</th>
                                <th class="text-right">Valeur Début</th>
                                <th class="text-right">Dotation Annuelle</th>
                                <th class="text-right">Amort. Cumulé</th>
                                <th class="text-right">Valeur Nette Comptable (VNC)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    renderAmortView();
});
