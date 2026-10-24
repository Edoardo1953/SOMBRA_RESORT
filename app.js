/**
 * SOMBRA_RESORT - Dashboard & Cap Table Logic
 * Basé sur le Registre Officiel des Associés & Attribution des 9 Villas
 * Total Parts : 15.000 parts de 1,00 € = 15.000,00 € (100,0000%)
 */

let capTableChartInstance = null;
let villaChartInstance = null;
let currentCapTableView = 'partners'; // 'partners' ou 'villas'

function formatCurrency(val) {
    if (val === null || val === undefined || isNaN(val)) return "0,00 €";
    const num = Number(val);
    const parts = num.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",") + " €";
}

function formatNumber(num, decimals = 0) {
    if (num === null || num === undefined || isNaN(num)) return "0";
    const val = Number(num);
    const parts = val.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return decimals > 0 ? parts.join(",") : parts[0];
}

function initDashboard() {
    if (!window.SOMBRA_RESORT_DATA) return;
    const data = window.SOMBRA_RESORT_DATA;

    renderCapTable(data.partners);
    renderVillasTable(data.villas);
    renderCapTableChart(data.partners);
    renderVillaChart(data.villas);

    initChartsManagement();
    initOrgDiagramInteractions();

    const dateEl = document.getElementById('sidebar-updated-at');
    if (dateEl && data.company?.updated_at) {
        dateEl.textContent = data.company.updated_at.split(' ')[0];
    }
}

function switchCapTableView(view) {
    currentCapTableView = view;
    const pContainer = document.getElementById('partners-table-container');
    const vContainer = document.getElementById('villas-table-container');
    const btnP = document.getElementById('tab-btn-partners');
    const btnV = document.getElementById('tab-btn-villas');

    if (view === 'partners') {
        if (pContainer) pContainer.style.display = 'block';
        if (vContainer) vContainer.style.display = 'none';
        if (btnP) btnP.classList.add('active');
        if (btnV) btnV.classList.remove('active');
    } else {
        if (pContainer) pContainer.style.display = 'none';
        if (vContainer) vContainer.style.display = 'block';
        if (btnP) btnP.classList.remove('active');
        if (btnV) btnV.classList.add('active');
    }
}

let currentPartnerSort = 'villa';
let currentVillaFilter = 'ALL';

function onVillaFilterChange(villa) {
    currentVillaFilter = villa;
    if (window.SOMBRA_RESORT_DATA) {
        renderCapTable(window.SOMBRA_RESORT_DATA.partners);
    }
}

function onPartnerSortChange(sortKey) {
    currentPartnerSort = sortKey;
    if (window.SOMBRA_RESORT_DATA) {
        renderCapTable(window.SOMBRA_RESORT_DATA.partners);
    }
}

function getProcessedPartners(partners) {
    if (!partners) return [];
    let list = [...partners];

    // Filtre par Villa
    if (currentVillaFilter && currentVillaFilter !== 'ALL') {
        list = list.filter(p => p.villa === currentVillaFilter);
    }

    // Tri
    if (currentPartnerSort === 'villa') {
        list.sort((a, b) => {
            if (a.villa < b.villa) return -1;
            if (a.villa > b.villa) return 1;
            return (b.pct || 0) - (a.pct || 0);
        });
    } else if (currentPartnerSort === 'pct') {
        list.sort((a, b) => (b.pct || 0) - (a.pct || 0));
    } else if (currentPartnerSort === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
}

function renderCapTable(partners) {
    const tbody = document.getElementById('partners-table-body');
    if (!tbody || !partners) return;

    tbody.innerHTML = '';
    let totalShares = 0;
    let totalVal = 0;
    let totalPct = 0;

    const displayList = getProcessedPartners(partners);

    displayList.forEach((p, idx) => {
        totalShares += p.shares || 0;
        totalVal += p.par_value || 0;
        totalPct += p.pct || 0;

        const tr = document.createElement('tr');
        const initials = p.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const isCorp = p.name.includes('SA') || p.name.includes('S.A.') || p.name.includes('SARL') || p.name.includes('Sàrl');

        tr.innerHTML = `
            <td class="text-center" style="font-weight: 600; color: var(--text-muted); font-size: 11px; padding: 0.45rem 0.35rem;">${idx + 1}</td>
            <td style="padding: 0.45rem 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.55rem;">
                    <div style="width: 26px; height: 26px; border-radius: 50%; background: ${p.color || '#3b82f6'}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 9.5px; font-weight: 700; flex-shrink: 0;">
                        ${initials}
                    </div>
                    <div>
                        <div style="font-weight: 600; color: var(--text-main); font-size: 12.5px; line-height: 1.2;">${p.name}</div>
                        <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">${p.residence || p.country} • ${p.type}</div>
                    </div>
                </div>
            </td>
            <td class="text-center" style="padding: 0.45rem 0.4rem;">
                <span class="badge badge-villa" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.3); padding: 2px 7px; border-radius: 6px; font-size: 11px; white-space: nowrap;">
                    <i class="fa-solid fa-house-chimney" style="margin-right: 3px; font-size: 10px;"></i> ${p.villa}
                </span>
            </td>
            <td class="text-right text-bold text-cyan" style="font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 0.45rem 0.4rem;">${formatNumber(p.shares)}</td>
            <td class="text-right text-bold text-emerald" style="font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 0.45rem 0.4rem;">${(p.pct || 0).toFixed(4)} %</td>
            <td class="text-right text-bold" style="font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 0.45rem 0.4rem;">${formatCurrency(p.par_value)}</td>
            <td class="text-center" style="padding: 0.45rem 0.4rem;">
                <span class="badge badge-success" style="font-size: 10px; padding: 2px 6px;"><i class="fa-solid fa-shield-check"></i> ${p.kyc_status}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const tfTotal = document.getElementById('partners-table-total');
    if (tfTotal) {
        const filterNote = (currentVillaFilter !== 'ALL') ? ` (${currentVillaFilter})` : '';
        tfTotal.innerHTML = `
            <tr style="background: rgba(255, 255, 255, 0.05); font-weight: 800; border-top: 2px solid var(--border-color);">
                <td colspan="3" style="text-align: right; padding: 0.75rem 1rem; color: var(--text-main);">TOTAL CAPITAL${filterNote} :</td>
                <td class="text-right text-cyan" style="font-family: 'JetBrains Mono', monospace; font-size: 14px;">${formatNumber(totalShares)} parts</td>
                <td class="text-right text-emerald" style="font-family: 'JetBrains Mono', monospace; font-size: 14px;">${totalPct.toFixed(4)} %</td>
                <td class="text-right text-gold" style="font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #fbbf24;">${formatCurrency(totalVal)}</td>
                <td class="text-center"><span class="badge badge-emerald">${(currentVillaFilter === 'ALL') ? '100% Libéré' : displayList.length + ' Associé(s)'}</span></td>
            </tr>
        `;
    }
}

function renderVillasTable(villas) {
    const tbody = document.getElementById('villas-table-body');
    if (!tbody || !villas) return;

    tbody.innerHTML = '';
    villas.forEach((v, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-center" style="font-weight: 700; color: #34d399;">
                <i class="fa-solid fa-hotel" style="margin-right: 6px;"></i> ${v.name}
            </td>
            <td>
                <div style="font-weight: 600; color: var(--text-main); font-size: 13px;">${v.owners.join(' & ')}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${v.desc}</div>
            </td>
            <td class="text-right text-bold text-cyan" style="font-family: 'JetBrains Mono', monospace;">${formatNumber(v.shares)} parts</td>
            <td class="text-right text-bold text-emerald" style="font-family: 'JetBrains Mono', monospace;">${(v.pct || 0).toFixed(4)} %</td>
            <td class="text-center">
                <span class="badge badge-emerald" style="font-size: 11px;">Attribuée</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderCapTableChart(partners) {
    const ctx = document.getElementById('capTableDonutChart');
    if (!ctx) return;

    if (capTableChartInstance) {
        capTableChartInstance.destroy();
    }

    const labels = partners.map(p => p.name);
    const dataVals = partners.map(p => p.pct);
    const colors = partners.map(p => p.color || '#3b82f6');

    capTableChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: dataVals,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#0b132b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        font: { size: 9.5 },
                        boxWidth: 8,
                        padding: 5
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(ctx) {
                            const p = partners[ctx.dataIndex];
                            return ` ${p.name}: ${p.pct.toFixed(2)}% (${formatNumber(p.shares)} parts - ${p.villa})`;
                        }
                    }
                }
            },
            cutout: '66%'
        }
    });
}

function renderVillaChart(villas) {
    const ctx = document.getElementById('villasDonutChart');
    if (!ctx) return;

    if (villaChartInstance) {
        villaChartInstance.destroy();
    }

    const labels = villas.map(v => v.name);
    const dataVals = villas.map(v => v.shares);
    const palette = ['#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f59e0b', '#84cc16'];

    // Plugin per visualizzare la lettera della casa (A..I) ben visibile al centro di ogni fetta colorata
    const villaLettersPlugin = {
        id: 'villaLettersPlugin',
        afterDatasetsDraw(chart) {
            const { ctx: c } = chart;
            const meta = chart.getDatasetMeta(0);
            if (!meta || !meta.data) return;

            c.save();
            meta.data.forEach((element, index) => {
                const v = villas[index];
                if (!v) return;

                // Estrai la lettera della villa (es. "Villa A" -> "A")
                let letter = '';
                if (v.id) {
                    letter = v.id.replace(/[^A-Za-z]/g, '').replace(/^VILLA/i, '').trim();
                }
                if (!letter && v.name) {
                    const m = v.name.match(/Villa\s+([A-I])/i) || v.name.match(/([A-I])/i);
                    letter = m ? m[1].toUpperCase() : v.name.charAt(v.name.length - 1);
                }
                if (!letter) letter = String.fromCharCode(65 + index);

                const { startAngle, endAngle, innerRadius, outerRadius, x, y } = element;
                const midAngle = (startAngle + endAngle) / 2;
                const ringThickness = outerRadius - innerRadius;
                const midRadius = innerRadius + ringThickness * 0.52;

                const posX = x + Math.cos(midAngle) * midRadius;
                const posY = y + Math.sin(midAngle) * midRadius;

                // Raggio del badge circolare adattivo allo spessore dell'anello
                const badgeRadius = Math.max(9, Math.min(13.5, ringThickness * 0.33));

                // 1. Badge circolare di sfondo ad alto contrasto (vetro scuro)
                c.beginPath();
                c.arc(posX, posY, badgeRadius, 0, 2 * Math.PI);
                c.fillStyle = 'rgba(11, 19, 43, 0.90)';
                c.fill();

                // 2. Bordatura bianca nitida
                c.lineWidth = 1.75;
                c.strokeStyle = '#ffffff';
                c.stroke();

                // 3. Lettera della casa in grassetto bianco centrata
                const fontSize = Math.max(10, Math.round(badgeRadius * 1.15));
                c.font = `800 ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
                c.textAlign = 'center';
                c.textBaseline = 'middle';
                c.fillStyle = '#ffffff';
                c.fillText(letter, posX, posY + 0.6);
            });
            c.restore();
        }
    };

    villaChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: dataVals,
                backgroundColor: palette,
                borderWidth: 2,
                borderColor: '#0b132b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        font: { size: 9.5 },
                        boxWidth: 8,
                        padding: 5
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(ctx) {
                            const v = villas[ctx.dataIndex];
                            return ` ${v.name}: ${formatNumber(v.shares)} parts (${v.pct.toFixed(2)}%)`;
                        }
                    }
                }
            },
            cutout: '58%'
        },
        plugins: [villaLettersPlugin]
    });
}

/* ==========================================================================
   GESTIONE GRAFICI: DRAG & DROP, INVERSIONE E RIDIMENSIONAMENTO
   ========================================================================== */
let currentChartHeight = 260;
let currentWidthIndex = 0; // 0: Standard, 1: Bilanciato, 2: Largo, 3: Sotto
const widthLayouts = [
    { label: 'Standard', cols: '1.55fr 1fr', stacked: false },
    { label: 'Bilanciato', cols: '1.15fr 1fr', stacked: false },
    { label: 'Largo', cols: '1fr 1.25fr', stacked: false },
    { label: 'Sotto', cols: '1fr', stacked: true }
];

function initChartsManagement() {
    initChartsDragAndDrop();
    initChartsSizingFromStorage();
    initChartCornerResizers();
    initChartsResizeObserver();
}

function initChartsDragAndDrop() {
    const container = document.getElementById('charts-main-column');
    if (!container) return;

    // Ripristina ordine salvato se presente
    try {
        const savedOrder = JSON.parse(localStorage.getItem('sombra_charts_order') || 'null');
        if (Array.isArray(savedOrder) && savedOrder.length >= 2) {
            savedOrder.forEach(id => {
                const el = document.getElementById(id);
                if (el && el.parentElement === container) {
                    container.appendChild(el);
                }
            });
        }
    } catch (e) {
        console.warn('Errore ripristino ordine grafici:', e);
    }

    const cards = container.querySelectorAll('.chart-draggable-card');
    cards.forEach(card => {
        card.setAttribute('draggable', 'true');

        card.addEventListener('dragstart', (e) => {
            card.classList.add('dragging');
            e.dataTransfer.setData('text/plain', card.id);
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
            cards.forEach(c => {
                c.classList.remove('dragging');
                c.classList.remove('drag-over');
            });
            saveChartsOrder();
        });

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (!card.classList.contains('dragging')) {
                card.classList.add('drag-over');
            }
        });

        card.addEventListener('dragleave', () => {
            card.classList.remove('drag-over');
        });

        card.addEventListener('drop', (e) => {
            e.preventDefault();
            card.classList.remove('drag-over');
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggedElement = document.getElementById(draggedId);

            if (draggedElement && draggedElement !== card && draggedElement.parentElement === container) {
                const allCards = Array.from(container.querySelectorAll('.chart-draggable-card'));
                const draggedIdx = allCards.indexOf(draggedElement);
                const targetIdx = allCards.indexOf(card);

                if (draggedIdx < targetIdx) {
                    container.insertBefore(draggedElement, card.nextSibling);
                } else {
                    container.insertBefore(draggedElement, card);
                }
                saveChartsOrder();
                resizeAllCharts();
            }
        });
    });
}

function saveChartsOrder() {
    const container = document.getElementById('charts-main-column');
    if (!container) return;
    const cards = Array.from(container.querySelectorAll('.chart-draggable-card'));
    const order = cards.map(c => c.id);
    localStorage.setItem('sombra_charts_order', JSON.stringify(order));
}

function invertChartsOrder() {
    const container = document.getElementById('charts-main-column');
    if (!container) return;
    const cards = Array.from(container.querySelectorAll('.chart-draggable-card'));
    if (cards.length >= 2) {
        container.insertBefore(cards[1], cards[0]);
        saveChartsOrder();
        resizeAllCharts();
    }
}

function adjustChartsHeight(delta) {
    currentChartHeight = Math.max(180, Math.min(550, currentChartHeight + delta));
    applyChartsHeight(currentChartHeight);
    localStorage.setItem('sombra_chart_height', currentChartHeight.toString());
}

function applyChartsHeight(h) {
    document.querySelectorAll('.chart-canvas-wrapper').forEach(wrapper => {
        wrapper.style.height = `${h}px`;
    });
    const indicator = document.getElementById('chart-height-indicator');
    if (indicator) indicator.textContent = `${h}px`;
    resizeAllCharts();
}

function cycleChartsWidth(direction = 1) {
    currentWidthIndex = (currentWidthIndex + direction + widthLayouts.length) % widthLayouts.length;
    applyChartsWidthLayout(currentWidthIndex);
    localStorage.setItem('sombra_chart_width_idx', currentWidthIndex.toString());
}

function toggleStackedChartsLayout() {
    if (currentWidthIndex === 3) {
        currentWidthIndex = 0;
    } else {
        currentWidthIndex = 3;
    }
    applyChartsWidthLayout(currentWidthIndex);
    localStorage.setItem('sombra_chart_width_idx', currentWidthIndex.toString());
}

function applyChartsWidthLayout(index) {
    const layout = widthLayouts[index] || widthLayouts[0];
    const grid = document.getElementById('societe-main-grid') || document.querySelector('.societe-main-grid');
    if (grid) {
        if (layout.stacked) {
            grid.classList.add('layout-stacked');
            grid.style.removeProperty('--societe-grid-cols');
        } else {
            grid.classList.remove('layout-stacked');
            grid.style.setProperty('--societe-grid-cols', layout.cols);
        }
    }
    const indicator = document.getElementById('chart-width-indicator');
    if (indicator) indicator.textContent = layout.label;

    const btnStack = document.getElementById('btn-toggle-stack');
    if (btnStack) {
        if (layout.stacked) {
            btnStack.innerHTML = '<i class="fa-solid fa-table-columns"></i> Lato';
            btnStack.title = 'Torna a disposizione affiancata a lato';
        } else {
            btnStack.innerHTML = '<i class="fa-solid fa-table-columns"></i> Sotto';
            btnStack.title = 'Disponi grafici sotto la tabella (100% larghezza affiancati)';
        }
    }
    resizeAllCharts();
}

function resetChartsSizing() {
    currentChartHeight = 260;
    currentWidthIndex = 0;
    applyChartsHeight(currentChartHeight);
    applyChartsWidthLayout(currentWidthIndex);
    localStorage.removeItem('sombra_chart_height');
    localStorage.removeItem('sombra_chart_width_idx');
}

function initChartsSizingFromStorage() {
    const savedH = parseInt(localStorage.getItem('sombra_chart_height'));
    if (!isNaN(savedH) && savedH >= 180 && savedH <= 550) {
        currentChartHeight = savedH;
        applyChartsHeight(currentChartHeight);
    }
    const savedW = parseInt(localStorage.getItem('sombra_chart_width_idx'));
    if (!isNaN(savedW) && savedW >= 0 && savedW < widthLayouts.length) {
        currentWidthIndex = savedW;
        applyChartsWidthLayout(currentWidthIndex);
    }
}

function initChartCornerResizers() {
    const cards = document.querySelectorAll('.chart-draggable-card');
    cards.forEach(card => {
        const resizer = card.querySelector('.chart-corner-resizer');
        const wrapper = card.querySelector('.chart-canvas-wrapper');
        if (!resizer || !wrapper) return;

        let startY = 0;
        let startHeight = 0;

        const onMouseMove = (e) => {
            const dy = e.clientY - startY;
            const newHeight = Math.max(180, Math.min(550, startHeight + dy));
            currentChartHeight = newHeight;
            applyChartsHeight(newHeight);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            localStorage.setItem('sombra_chart_height', currentChartHeight.toString());
        };

        resizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            startY = e.clientY;
            startHeight = wrapper.offsetHeight;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
}

function initChartsResizeObserver() {
    if (window.ResizeObserver) {
        const observer = new ResizeObserver(() => {
            if (capTableChartInstance) capTableChartInstance.resize();
            if (villaChartInstance) villaChartInstance.resize();
        });
        const c1 = document.getElementById('capTableDonutChart');
        const c2 = document.getElementById('villasDonutChart');
        if (c1 && c1.parentElement) observer.observe(c1.parentElement);
        if (c2 && c2.parentElement) observer.observe(c2.parentElement);
    }
}

function resizeAllCharts() {
    setTimeout(() => {
        if (capTableChartInstance) capTableChartInstance.resize();
        if (villaChartInstance) villaChartInstance.resize();
    }, 60);
}

function openSchemaSocietarioModal() {
    const modal = document.getElementById('schemaSocietarioModal');
    if (!modal) return;
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeSchemaSocietarioModal() {
    const modal = document.getElementById('schemaSocietarioModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    document.querySelectorAll('.org-node-card').forEach(c => c.classList.remove('show-popup'));
}

function initOrgDiagramInteractions() {
    document.querySelectorAll('.org-node-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.org-hover-popup')) return;
            const wasActive = card.classList.contains('show-popup');
            document.querySelectorAll('.org-node-card').forEach(c => c.classList.remove('show-popup'));
            if (!wasActive) card.classList.add('show-popup');
        });
    });
}

function onSchemaBackdropClick(event) {
    if (event.target && event.target.id === 'schemaSocietarioModal') {
        closeSchemaSocietarioModal();
    }
}

// Close schema modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('schemaSocietarioModal');
        if (modal && (modal.style.display === 'flex' || modal.classList.contains('active'))) {
            closeSchemaSocietarioModal();
        }
    }
});


function refreshAppGlobalData(btn) {
    if (btn) {
        btn.querySelector('i')?.classList.add('fa-spin');
        setTimeout(() => {
            btn.querySelector('i')?.classList.remove('fa-spin');
            window.location.reload();
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});
