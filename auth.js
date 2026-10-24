/**
 * SOMBRA_RESORT - Sombra e Agua Fresca Resort S.à r.l.
 * Système d'Authentification, Contrôle d'Accès, Rôles & Gestion de Visibilité
 */

(function initEarlyThemeAndSidebar() {
    try {
        const theme = localStorage.getItem('sr_theme');
        const isLight = theme === 'light';
        if (isLight) {
            document.documentElement.classList.add('theme-light');
            if (document.body) document.body.classList.add('theme-light');
        } else {
            document.documentElement.classList.remove('theme-light');
            if (document.body) document.body.classList.remove('theme-light');
        }

        const path = (window.location.pathname || '').toLowerCase();
        const page = (path.split('/').pop() || 'index.html').toLowerCase();
        const isHome = page === '' || page === 'index.html' || page === 'index' || page.indexOf('index.html') !== -1;

        if (isHome) {
            document.documentElement.classList.add('sidebar-pinned');
            document.documentElement.classList.remove('sidebar-collapsed');
            document.documentElement.classList.remove('sidebar-open');
        } else {
            document.documentElement.classList.add('sidebar-collapsed');
            document.documentElement.classList.remove('sidebar-pinned');
            document.documentElement.classList.remove('sidebar-open');
        }
    } catch(e) {}
})();

const DEFAULT_AUTH_USERS = [
    {
        id: 'usr_admin',
        name: 'TUBIA EDOARDO',
        username: 'tubia.edoardo@gmail.com',
        aliases: ['admin', 'edoardo', 'tubia'],
        password: 'edo2bia',
        role: 'admin',
        roleLabel: 'Gérant / Super Admin',
        permission: 'read_write',
        status: 'active',
        pin: 'LuxTrust Mobile',
        created_at: '2026-05-06',
        notes: 'Plein pouvoir de contrôle, gestion des accès et visibilité'
    },
    {
        id: 'usr_fidu',
        name: 'CABINET FIDUCIAIRE LUXEMBOURG',
        username: 'fidu.compta@luxfiduciaire.lu',
        aliases: ['fidu', 'comptable', 'user'],
        password: 'sombra2026',
        role: 'user',
        roleLabel: 'Fiduciaire Comptable & Fiscale',
        permission: 'read_write',
        status: 'active',
        pin: '2FA Token',
        created_at: '2026-05-10',
        notes: 'Gestion comptable PCN et déclarations fiscales'
    },
    {
        id: 'usr_public',
        name: 'CONSULTATION AUDIT / INVESTISSEURS',
        username: 'public@sombraresort.lu',
        aliases: ['public', 'guest', 'audit'],
        password: 'sombra_guest',
        role: 'public',
        roleLabel: 'Auditeur / Actionnaire (Lecture seule)',
        permission: 'read_only',
        status: 'active',
        pin: 'Accès Direct',
        created_at: '2026-05-15',
        notes: 'Consultation cap table, bilans et situation financière'
    }
];

const DEFAULT_PAGE_PERMISSIONS = {
    'index.html': true,
    'partecipazioni.html': true,
    'bilancio_brasil.html': true,
    'dre_brasil.html': true,
    'contabilita.html': true,
    'banca.html': true,
    'ammortamenti.html': true,
    'aml.html': true,
    'documenti.html': true
};

function isPasswordEnforced() {
    const saved = localStorage.getItem('sr_enforce_passwords');
    if (saved !== null) return saved === 'true';
    return false; // Mode libre par défaut pendant le développement
}

function togglePasswordEnforcementSwitch() {
    const current = isPasswordEnforced();
    const newState = !current;
    localStorage.setItem('sr_enforce_passwords', newState.toString());
    showVisibilityToast(`Obligation Mot de Passe: ${newState ? 'ACTIVÉ (Mode Strict)' : 'EN VEILLE (Accès Libre Développement)'}`, newState);
    const modal = document.getElementById('sr-users-management-modal');
    if (modal && modal.classList.contains('active')) {
        renderUsersManagementContent(modal);
    }
}

function getRegisteredUsers() {
    try {
        const saved = localStorage.getItem('sr_users_data');
        if (saved) {
            let parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                const adminIdx = parsed.findIndex(u => u.id === 'usr_admin' || (u.username && u.username.toLowerCase().includes('tubia')));
                if (adminIdx >= 0) {
                    parsed[adminIdx].role = 'admin';
                    parsed[adminIdx].roleLabel = 'Gérant / Super Admin';
                    parsed[adminIdx].permission = 'read_write';
                    parsed[adminIdx].status = 'active';
                }
                return parsed;
            }
        }
    } catch (e) {
        console.error('Erreur utilisateurs:', e);
    }
    saveRegisteredUsers(DEFAULT_AUTH_USERS);
    return [...DEFAULT_AUTH_USERS];
}

function saveRegisteredUsers(users) {
    try {
        localStorage.setItem('sr_users_data', JSON.stringify(users));
    } catch (e) {
        console.error('Erreur sauvegarde utilisateurs:', e);
    }
}

function getLoggedUser() {
    try {
        const session = sessionStorage.getItem('sr_session') || localStorage.getItem('sr_remembered_session');
        if (session) {
            let user = JSON.parse(session);
            if (user && (user.id === 'usr_admin' || (user.username && user.username.toLowerCase().includes('tubia')))) {
                user.role = 'admin';
                user.roleLabel = 'Gérant / Super Admin';
                user.permission = 'read_write';
                user.status = 'active';
            }
            return user;
        }
    } catch (e) {
        console.error('Erreur session:', e);
    }
    // Utilisateur par défaut si non forcé
    if (!isPasswordEnforced()) {
        return DEFAULT_AUTH_USERS[0]; // Admin par défaut
    }
    return null;
}

function isUserAdmin(user) {
    if (!user) user = getLoggedUser();
    if (!user) return true;
    const role = (user.role || '').toLowerCase();
    const username = (user.username || '').toLowerCase();
    return user.id === 'usr_admin' || role === 'admin' || role.includes('admin') || username.includes('tubia');
}

function isUserPublic(user) {
    if (!user) user = getLoggedUser();
    return user && (user.role === 'public' || (user.role || '').toLowerCase().includes('public'));
}

function canUserEdit(user) {
    if (!user) user = getLoggedUser();
    if (!user) return true;
    if (user.status === 'blocked') return false;
    return user.permission === 'read_write' && !isUserPublic(user);
}

function getPageVisibility() {
    try {
        const saved = localStorage.getItem('sr_page_permissions');
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { ...DEFAULT_PAGE_PERMISSIONS };
}

function savePageVisibility(perms) {
    localStorage.setItem('sr_page_permissions', JSON.stringify(perms));
}

function togglePageVisibility(page, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    if (!isUserAdmin()) {
        alert("Action réservée à l'administrateur.");
        return;
    }
    const perms = getPageVisibility();
    const current = perms[page] !== false;
    perms[page] = !current;
    savePageVisibility(perms);
    updateEyeIcons();
    showVisibilityToast('Page ' + page + ': ' + (perms[page] ? "VISIBLE pour l'Utilisateur" : "MASQUÉE pour l'Utilisateur"), perms[page]);
}

function updateEyeIcons() {
    const perms = getPageVisibility();
    const isAdmin = isUserAdmin();
    const user = getLoggedUser();

    document.querySelectorAll('.nav-item-container').forEach(container => {
        const page = container.getAttribute('data-page');
        const isVisible = perms[page] !== false;
        const btn = container.querySelector('.nav-eye-toggle-btn');

        if (btn) {
            btn.style.display = isAdmin ? 'inline-flex' : 'none';
            const icon = btn.querySelector('i');
            if (isVisible) {
                btn.className = 'nav-eye-toggle-btn nav-eye-active';
                btn.title = 'Visible pour le profil Utilisateur';
                if (icon) {
                    icon.className = 'fa-solid fa-eye';
                    icon.style.color = '#10b981';
                }
            } else {
                btn.className = 'nav-eye-toggle-btn nav-eye-inactive';
                btn.title = 'Masqué pour le profil Utilisateur';
                if (icon) {
                    icon.className = 'fa-solid fa-eye-slash';
                    icon.style.color = '#ef4444';
                }
            }
        }

        // Pour les utilisateurs non-admins, masquer les items du menu si permission = false
        if (!isAdmin) {
            if (!isVisible) {
                container.style.display = 'none';
            } else {
                container.style.display = 'flex';
            }
        }
    });

    // Rediriger si un non-admin est sur une page masquée
    if (!isAdmin) {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        if (perms[currentPath] === false && currentPath !== 'login.html') {
            window.location.href = 'index.html';
        }
    }
}

function showVisibilityToast(message, isSuccess = true) {
    let toast = document.getElementById('sr-visibility-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'sr-visibility-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 12px 20px;
            background: #1e293b;
            color: #f8fafc;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform: translateY(20px);
            opacity: 0;
            border-left: 4px solid #10b981;
        `;
        document.body.appendChild(toast);
    }
    toast.style.borderLeftColor = isSuccess ? '#10b981' : '#ef4444';
    toast.innerHTML = `<i class="fa-solid ${isSuccess ? 'fa-circle-check text-emerald' : 'fa-circle-exclamation text-rose'}"></i> ${message}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 3200);
}

function logoutUser() {
    sessionStorage.removeItem('sr_session');
    localStorage.removeItem('sr_remembered_session');
    window.location.href = 'login.html';
}

function openUsersModal() {
    let modal = document.getElementById('sr-users-management-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'sr-users-management-modal';
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal-card glass-panel" style="max-width: 650px; width: 90%;">
                <div class="modal-header">
                    <h3><i class="fa-solid fa-users-gear text-emerald"></i> Gestion des Utilisateurs & Sécurité</h3>
                    <button class="btn-icon" onclick="closeUsersModal()"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="modal-body" id="sr-users-modal-content"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    renderUsersManagementContent(modal);
    modal.classList.add('active');
}

function closeUsersModal() {
    const modal = document.getElementById('sr-users-management-modal');
    if (modal) modal.classList.remove('active');
}

function renderUsersManagementContent(modal) {
    const content = modal.querySelector('#sr-users-modal-content');
    const users = getRegisteredUsers();
    const enforced = isPasswordEnforced();

    let html = `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-weight: 600; color: var(--text-main);">Obligation de Mot de Passe</div>
                <div style="font-size: 12px; color: var(--text-muted);">Si activé, chaque utilisateur doit s'authentifier par mot de passe.</div>
            </div>
            <button class="btn ${enforced ? 'btn-primary' : 'btn-secondary'}" onclick="togglePasswordEnforcementSwitch()">
                <i class="fa-solid ${enforced ? 'fa-lock' : 'fa-lock-open'}"></i> ${enforced ? 'Actif' : 'En veille'}
            </button>
        </div>

        <div style="font-weight: 600; margin-bottom: 10px; color: var(--text-main);">Comptes Configurés</div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
    `;

    users.forEach(u => {
        html += `
            <div style="background: var(--bg-dark-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: 600; color: var(--text-main); font-size: 13px;">${u.name} <span class="badge ${u.role === 'admin' ? 'badge-emerald' : 'badge-blue'}" style="font-size: 10px; margin-left: 6px;">${u.roleLabel}</span></div>
                    <div style="font-size: 11px; color: var(--text-muted); font-family: monospace;">Login: ${u.username} • Mdp: ${u.password}</div>
                </div>
            </div>
        `;
    });

    html += `
        </div>
        <div style="margin-top: 18px; display: flex; justify-content: flex-end;">
            <button class="btn btn-secondary" onclick="closeUsersModal()">Fermer</button>
        </div>
    `;

    content.innerHTML = html;
}

// Theme Switcher (Clair / Sombre) avec synchronisation globale instantanée
function updateThemeIcon(isLight) {
    const btns = document.querySelectorAll('.theme-toggle-btn, #theme-toggle-btn');
    btns.forEach(btn => {
        if (isLight) {
            btn.innerHTML = '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>';
            btn.title = "Passer en mode sombre";
        } else {
            btn.innerHTML = '<i class="fa-solid fa-moon" style="color: #38bdf8;"></i>';
            btn.title = "Passer en mode clair";
        }
    });
}

function applyTheme(isLight) {
    if (typeof isLight !== 'boolean') {
        isLight = localStorage.getItem('sr_theme') === 'light';
    }
    if (isLight) {
        document.documentElement.classList.add('theme-light');
        if (document.body) document.body.classList.add('theme-light');
    } else {
        document.documentElement.classList.remove('theme-light');
        if (document.body) document.body.classList.remove('theme-light');
    }
    updateThemeIcon(isLight);
}

function toggleTheme() {
    const isCurrentLight = document.documentElement.classList.contains('theme-light') || 
                           (document.body && document.body.classList.contains('theme-light')) ||
                           localStorage.getItem('sr_theme') === 'light';
    const newLight = !isCurrentLight;
    localStorage.setItem('sr_theme', newLight ? 'light' : 'dark');
    applyTheme(newLight);

    try {
        window.dispatchEvent(new CustomEvent('sr_theme_changed', { detail: { isLight: newLight } }));
    } catch(e) {}
}

window.applyTheme = applyTheme;
window.toggleTheme = toggleTheme;

// Synchronisation multi-pages et multi-onglets en direct
window.addEventListener('storage', (e) => {
    if (e.key === 'sr_theme') {
        applyTheme(e.newValue === 'light');
    }
});

window.addEventListener('sr_theme_changed', (e) => {
    if (e.detail && typeof e.detail.isLight === 'boolean') {
        applyTheme(e.detail.isLight);
    }
});

// Fonctions de Navigation Latérale (Sidebar Pinned sur Homepage, Drawer sur les autres)
function isCurrentPageHomepage() {
    try {
        const path = (window.location.pathname || '').toLowerCase();
        const page = (path.split('/').pop() || 'index.html').toLowerCase();
        return page === '' || page === 'index.html' || page === 'index' || page.indexOf('index.html') !== -1;
    } catch(e) {
        return false;
    }
}

function openSidebar() {
    if (isCurrentPageHomepage()) return;
    document.body.classList.add('sidebar-open');
    document.documentElement.classList.add('sidebar-open');
}

function closeSidebar() {
    if (isCurrentPageHomepage()) return;
    document.body.classList.remove('sidebar-open');
    document.documentElement.classList.remove('sidebar-open');
}

function toggleSidebar() {
    if (isCurrentPageHomepage()) return;
    if (document.body.classList.contains('sidebar-open') || document.documentElement.classList.contains('sidebar-open')) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

window.isCurrentPageHomepage = isCurrentPageHomepage;
window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;
window.toggleSidebar = toggleSidebar;

function initResponsiveSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const isHome = isCurrentPageHomepage();

    // 1. Initial State:
    // Homepage: menu fixe à gauche (sidebar-pinned)
    // Autres pages: menu replié en tiroir accessible via le bouton 3 righe (sidebar-collapsed)
    if (isHome) {
        document.body.classList.add('sidebar-pinned');
        document.body.classList.remove('sidebar-collapsed', 'sidebar-open');
        document.documentElement.classList.add('sidebar-pinned');
        document.documentElement.classList.remove('sidebar-collapsed', 'sidebar-open');
    } else {
        document.body.classList.add('sidebar-collapsed');
        document.body.classList.remove('sidebar-pinned', 'sidebar-open');
        document.documentElement.classList.add('sidebar-collapsed');
        document.documentElement.classList.remove('sidebar-pinned', 'sidebar-open');
    }

    // 2. Backdrop Overlay
    let backdrop = document.getElementById('sidebar-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'sidebar-backdrop';
        backdrop.className = 'sidebar-backdrop';
        backdrop.onclick = () => closeSidebar();
        document.body.appendChild(backdrop);
    }

    // 3. Header Controls dans la Sidebar (Bouton fermeture X pour le tiroir sur les autres pages)
    let headerControls = sidebar.querySelector('.sidebar-header-controls');
    if (!isHome) {
        if (!headerControls) {
            headerControls = document.createElement('div');
            headerControls.className = 'sidebar-header-controls';
            headerControls.innerHTML = `
                <div class="sidebar-mode-indicator">
                    <i class="fa-solid fa-compass text-emerald"></i>
                    <span>Menu Navigation</span>
                </div>
                <div class="sidebar-header-actions">
                    <button type="button" class="btn-sidebar-close" id="btn-sidebar-close" title="Fermer le menu (Échap)">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `;
            sidebar.insertBefore(headerControls, sidebar.firstChild);

            const btnClose = headerControls.querySelector('#btn-sidebar-close');
            if (btnClose) btnClose.onclick = () => closeSidebar();
        } else {
            headerControls.style.display = 'flex';
        }
    } else if (headerControls) {
        headerControls.style.display = 'none';
    }

    // 4. Hamburger button (#sidebar-toggle-btn) dans la topbar
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    if (toggleBtn) {
        if (isHome) {
            toggleBtn.style.display = 'none';
        } else {
            toggleBtn.style.display = 'inline-flex';
            toggleBtn.onclick = (e) => {
                e.stopPropagation();
                toggleSidebar();
            };
        }
    }

    // 5. Fermeture du tiroir au clic sur un lien du menu
    const navLinks = sidebar.querySelectorAll('.nav-menu a.nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (document.body.classList.contains('sidebar-collapsed')) {
                closeSidebar();
            }
        });
    });

    // 6. Raccourcis clavier (Esc pour fermer, M pour ouvrir sur autres pages)
    if (!window._srSidebarKeyHandlerAttached) {
        window._srSidebarKeyHandlerAttached = true;
        document.addEventListener('keydown', (e) => {
            const target = e.target;
            const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);
            if (isInput) return;

            if (e.key === 'Escape') {
                if (document.body.classList.contains('sidebar-open') || document.documentElement.classList.contains('sidebar-open')) {
                    closeSidebar();
                }
            } else if ((e.key === 'm' || e.key === 'M') && !isCurrentPageHomepage()) {
                if (!e.ctrlKey && !e.altKey && !e.metaKey) {
                    toggleSidebar();
                }
            }
        });
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    initResponsiveSidebarToggle();
    updateEyeIcons();

    // Affichage nom utilisateur dans le header si présent
    const user = getLoggedUser();
    const userDisplay = document.getElementById('header-user-display');
    if (userDisplay && user) {
        userDisplay.innerHTML = `<i class="fa-solid fa-user-circle text-emerald"></i> <span>${user.name}</span> <span class="badge ${user.role === 'admin' ? 'badge-emerald' : 'badge-blue'}">${user.role === 'admin' ? 'Admin' : 'User'}</span>`;
    }
});