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
        const fileIcon = isPdf ? '<i class="fa-solid fa-file-pdf text-rose" style="font-size: 22px;"></i>' : '<i class="fa-solid fa-file-excel text-emerald" style="font-size: 22px;"></i>';

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
                    <button class="btn-icon" title="Consulter" onclick="viewDocument('${d.id}')" style="margin-right: 4px;">
                        <i class="fa-solid fa-eye text-emerald"></i>
                    </button>
                    <a href="${d.file_path}" download="${d.title}" class="btn-icon" title="Télécharger">
                        <i class="fa-solid fa-download text-cyan"></i>
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

    document.getElementById('doc-preview-title').textContent = doc.title;
    const container = document.getElementById('doc-preview-container');

    const isPdf = (doc.file_type || '').toLowerCase() === 'pdf' || (doc.title || '').toLowerCase().endsWith('.pdf');
    if (isPdf) {
        container.innerHTML = `
            <iframe src="${doc.file_path}#toolbar=1" style="width: 100%; height: 75vh; border: none; border-radius: 8px;"></iframe>
        `;
    } else {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fa-solid fa-file-excel text-emerald" style="font-size: 50px; margin-bottom: 1rem;"></i>
                <div style="font-size: 16px; font-weight: 600; color: var(--text-main); margin-bottom: 0.5rem;">Fichier Tableur Excel</div>
                <div style="color: var(--text-muted); font-size: 13px; margin-bottom: 1.5rem;">${doc.title} (${doc.file_size})</div>
                <a href="${doc.file_path}" download="${doc.title}" class="btn btn-primary">
                    <i class="fa-solid fa-download"></i> Télécharger et ouvrir dans Excel
                </a>
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
