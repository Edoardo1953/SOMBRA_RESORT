/**
 * SOMBRA_RESORT - Gestionnaire de Documents & Archives
 */

let selectedDocCategory = 'all';
let docSearchQuery = '';

function getAllDocuments() {
    const data = window.SOMBRA_RESORT_DATA;
    if (!data) return [];
    let docs = [...(data.documents || [])];

    // Merge uploaded documents from localStorage
    try {
        const custom = localStorage.getItem('sr_custom_uploaded_docs');
        if (custom) {
            const parsed = JSON.parse(custom);
            if (Array.isArray(parsed)) docs = docs.concat(parsed);
        }
    } catch(e) {}

    return docs;
}

function renderDocumentsView() {
    const docs = getAllDocuments();
    const countEl = document.getElementById('docs-count-badge');
    const tbody = document.getElementById('docs-table-body');
    if (!tbody) return;

    const filtered = docs.filter(d => {
        if (selectedDocCategory !== 'all') {
            if (selectedDocCategory === 'Statuti' && d.category !== 'Statuti') return false;
            if (selectedDocCategory === 'Bilanci' && d.category !== 'Bilanci') return false;
            if (selectedDocCategory === 'Certificati' && d.category !== 'Certificati') return false;
            if (selectedDocCategory === 'Partecipazione' && d.category !== 'Partecipazione') return false;
            if (selectedDocCategory === 'Trésorerie' && d.category !== 'Trésorerie') return false;
        }
        if (docSearchQuery) {
            const q = docSearchQuery.toLowerCase();
            const matchesTitle = (d.title || '').toLowerCase().includes(q);
            const matchesDesc = (d.description || '').toLowerCase().includes(q);
            const matchesRef = (d.reference || '').toLowerCase().includes(q);
            if (!matchesTitle && !matchesDesc && !matchesRef) return false;
        }
        return true;
    });

    if (countEl) countEl.textContent = `${filtered.length} documents`;

    let html = '';
    filtered.forEach(d => {
        const isPdf = (d.file_type || '').toLowerCase() === 'pdf' || (d.title || '').toLowerCase().endsWith('.pdf');
        const isHtml = (d.file_type || '').toLowerCase() === 'html' || (d.title || '').toLowerCase().endsWith('.html');
        let fileIcon = '<i class="fa-solid fa-file-excel text-emerald" style="font-size: 22px;"></i>';
        if (isPdf) fileIcon = '<i class="fa-solid fa-file-pdf text-rose" style="font-size: 22px;"></i>';
        else if (isHtml) fileIcon = '<i class="fa-solid fa-file-lines text-amber" style="font-size: 22px;"></i>';

        html += `
            <tr>
                <td class="text-center" style="width: 45px;">${fileIcon}</td>
                <td>
                    <div style="font-weight: 600; color: var(--text-main); font-size: 13.5px; cursor: pointer;" onclick="viewDocument('${d.id}')">
                        ${d.title}
                    </div>
                    <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">
                        ${d.description || '-'}
                    </div>
                </td>
                <td><span class="badge badge-secondary" style="font-size: 11px;">${d.category}</span></td>
                <td style="font-family: monospace; font-size: 11.5px; color: var(--text-muted);">${d.reference || '-'}</td>
                <td style="font-size: 12px; color: var(--text-muted);">${d.date || '-'}</td>
                <td style="font-family: monospace; font-size: 12px; color: var(--text-muted);">${d.file_size || '-'}</td>
                <td class="text-center">
                    <span class="badge ${d.status_color === 'emerald' ? 'badge-emerald' : 'badge-blue'}" style="font-size: 11px;">${d.status || 'Archivé'}</span>
                </td>
                <td class="text-center" style="white-space: nowrap;">
                    <button class="btn-icon" title="Consulter dans la visionneuse" onclick="viewDocument('${d.id}')" style="margin-right: 4px;">
                        <i class="fa-solid fa-eye text-emerald"></i>
                    </button>
                    <a href="${d.file_path}" target="_blank" class="btn-icon" title="Ouvrir dans un nouvel onglet plein écran" style="margin-right: 4px;">
                        <i class="fa-solid fa-up-right-from-square text-cyan"></i>
                    </a>
                    <a href="${d.file_path}" download="${d.title}" class="btn-icon" title="Télécharger">
                        <i class="fa-solid fa-download text-amber"></i>
                    </a>
                </td>
            </tr>
        `;
    });

    if (filtered.length === 0) {
        html = `<tr><td colspan="8" class="text-center" style="padding: 3rem; color: var(--text-muted);">Aucun document ne correspond à vos filtres.</td></tr>`;
    }

    tbody.innerHTML = html;
}

function filterDocCategory(cat) {
    selectedDocCategory = cat;
    document.querySelectorAll('.doc-cat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-cat') === cat);
    });
    renderDocumentsView();
}

function onDocSearchInput(val) {
    docSearchQuery = val.trim();
    renderDocumentsView();
}

async function viewDocument(id) {
    const docs = getAllDocuments();
    const doc = docs.find(d => d.id === id);
    if (!doc) return;

    const modal = document.getElementById('docPreviewModal');
    if (!modal) return;

    const titleEl = document.getElementById('doc-preview-title');
    if (titleEl) {
        titleEl.innerHTML = `<i class="fa-solid fa-file text-emerald" style="margin-right: 8px;"></i> ${doc.title}`;
    }

    const extBtn = document.getElementById('doc-preview-external-btn');
    if (extBtn) extBtn.href = doc.file_path;

    const dlBtn = document.getElementById('doc-preview-download-btn');
    if (dlBtn) {
        dlBtn.href = doc.file_path;
        dlBtn.download = doc.title;
    }

    const container = document.getElementById('doc-preview-container');

    const isPdf = (doc.file_type || '').toLowerCase() === 'pdf' || (doc.title || '').toLowerCase().endsWith('.pdf');
    const isHtml = (doc.file_type || '').toLowerCase() === 'html' || (doc.title || '').toLowerCase().endsWith('.html');
    
    if (isPdf || isHtml) {
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 8px; padding: 8px 14px; margin-bottom: 8px; font-size: 12px; color: var(--text-muted);">
                <span><i class="fa-solid fa-circle-info text-cyan"></i> Visualizzazione integrata. Se il tuo browser/Edge applica filtri colore, usa <strong>"Plein écran"</strong> in alto a destra.</span>
                <span class="badge badge-emerald font-mono">${doc.file_size || ''}</span>
            </div>
            <iframe src="${doc.file_path}${isPdf ? '#toolbar=1' : ''}" style="width: 100%; height: 74vh; border: none; border-radius: 8px; background: #ffffff;"></iframe>
        `;
    } else {
        // Tableur Excel
        let contextNotice = "";
        if (doc.title.includes('CONTA Sombra Resort')) {
            contextNotice = `Tutte le transazioni Olky Pay e Revolut di questo file sono già integrate e consultabili in <a href="banca.html" style="color: #38bdf8; font-weight: 600; text-decoration: underline;">Comptes Bancaires</a> e <a href="contabilita.html" style="color: #38bdf8; font-weight: 600; text-decoration: underline;">Comptabilité PCN</a>.`;
        } else if (doc.title.includes('Banco Brasil')) {
            contextNotice = `I movimenti Banco do Brasil (C/C e Investimenti) di questo file sono consultabili con grafici e saldi in <a href="partecipazioni.html#sec-brasil-banks" style="color: #38bdf8; font-weight: 600; text-decoration: underline;">Participation Sombra (Brésil)</a>.`;
        } else if (doc.title.includes('company scheme')) {
            contextNotice = `La ripartizione delle 15.000 quote e delle 9 ville contenuta in questo foglio è visualizzabile nella sezione <a href="index.html#sec-cap-table" style="color: #38bdf8; font-weight: 600; text-decoration: underline;">Actionnariat & Villas</a>.`;
        }

        container.innerHTML = `
            <div style="text-align: center; padding: 2.5rem 1.5rem; max-width: 600px; margin: auto;">
                <div style="width: 72px; height: 72px; border-radius: 16px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
                    <i class="fa-solid fa-file-excel text-emerald" style="font-size: 36px;"></i>
                </div>
                <div style="font-size: 17px; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">${doc.title}</div>
                <div style="color: var(--text-muted); font-size: 13px; margin-bottom: 1.25rem;">${doc.description || 'Document tableur Excel officiel'} • Dimensione: <strong>${doc.file_size}</strong></div>
                
                ${contextNotice ? `<div style="background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border-color); border-radius: 10px; padding: 12px 16px; font-size: 12.5px; color: var(--text-main); line-height: 1.6; margin-bottom: 1.75rem; text-align: left;">
                    <i class="fa-solid fa-lightbulb text-amber" style="margin-right: 6px;"></i> ${contextNotice}
                </div>` : ''}

                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <a href="${doc.file_path}" download="${doc.title}" class="btn btn-primary" style="padding: 10px 22px; font-weight: 600;">
                        <i class="fa-solid fa-download"></i> Scarica File Excel (.xlsx)
                    </a>
                    <a href="${doc.file_path}" target="_blank" class="btn btn-secondary" style="padding: 10px 18px;">
                        <i class="fa-solid fa-up-right-from-square"></i> Apri nel Browser
                    </a>
                </div>
            </div>
        `;
    }

    modal.style.display = 'flex';
}

function closeDocPreviewModal() {
    const modal = document.getElementById('docPreviewModal');
    if (modal) modal.style.display = 'none';
}

function openUploadDocModal() {
    if (!canUserEdit()) {
        alert("Action réservée à l'administrateur ou aux utilisateurs avec droit d'écriture.");
        return;
    }
    const modal = document.getElementById('uploadDocModal');
    if (modal) modal.style.display = 'flex';
}

function closeUploadDocModal() {
    const modal = document.getElementById('uploadDocModal');
    if (modal) modal.style.display = 'none';
}

async function handleDocUpload(e) {
    e.preventDefault();
    const fileInput = document.getElementById('upload-file-input');
    const category = document.getElementById('upload-category').value;
    const desc = document.getElementById('upload-desc').value;

    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Veuillez sélectionner un fichier.");
        return;
    }

    const file = fileInput.files[0];
    const docId = `DOC-UP-${Date.now().toString().slice(-4)}`;

    // Save in IndexedDB
    await DocStorage.saveFile(docId, file, file.name, file.type);

    const newDoc = {
        id: docId,
        title: file.name,
        category: category,
        description: desc || "Document ajouté manuellement",
        date: new Date().toLocaleDateString('fr-FR'),
        reference: `UP-${new Date().getFullYear()}`,
        file_path: URL.createObjectURL(file),
        file_type: file.name.split('.').pop().toLowerCase(),
        file_size: `${(file.size / 1024).toFixed(0)} KB`,
        status: "Téléversé",
        status_color: "emerald"
    };

    let custom = [];
    try {
        const saved = localStorage.getItem('sr_custom_uploaded_docs');
        if (saved) custom = JSON.parse(saved);
    } catch(err) {}

    custom.push(newDoc);
    localStorage.setItem('sr_custom_uploaded_docs', JSON.stringify(custom));

    closeUploadDocModal();
    renderDocumentsView();
    showVisibilityToast("Document archivé avec succès !", true);
}

document.addEventListener('DOMContentLoaded', () => {
    renderDocumentsView();
});
