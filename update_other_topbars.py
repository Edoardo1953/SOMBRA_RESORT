import glob

other_pages = [
    'partecipazioni.html',
    'contabilita.html',
    'banca.html',
    'ammortamenti.html',
    'aml.html',
    'documenti.html'
]

lang_old_snippets = [
'''                    <div class="lang-switch-container">
                        <button class="lang-btn active" data-lang="fr" onclick="setLanguage('fr')">FR</button>
                        <button class="lang-btn" data-lang="it" onclick="setLanguage('it')">IT</button>
                        <button class="lang-btn" data-lang="pt" onclick="setLanguage('pt')">PT</button>
                        <button class="lang-btn" data-lang="en" onclick="setLanguage('en')">EN</button>
                    </div>

                    <button class="btn-icon" onclick="toggleTheme()" title="Basculer Mode Clair/Sombre">
                        <i class="fa-solid fa-circle-half-stroke"></i>
                    </button>'''
]

new_topbar_controls = '''                    <!-- Improved Flag Language Selector -->
                    <div class="lang-selector">
                        <button class="lang-btn active" data-lang="fr" onclick="setLanguage('fr')" title="Français">
                            <img src="https://flagcdn.com/w40/fr.png" alt="FR">
                        </button>
                        <button class="lang-btn" data-lang="it" onclick="setLanguage('it')" title="Italiano">
                            <img src="https://flagcdn.com/w40/it.png" alt="IT">
                        </button>
                        <button class="lang-btn" data-lang="pt" onclick="setLanguage('pt')" title="Português">
                            <img src="https://flagcdn.com/w40/br.png" alt="PT">
                        </button>
                        <button class="lang-btn" data-lang="en" onclick="setLanguage('en')" title="English">
                            <img src="https://flagcdn.com/w40/gb.png" alt="EN">
                        </button>
                    </div>

                    <!-- Improved Light / Dark Theme Button -->
                    <button class="theme-toggle-btn" id="theme-toggle-btn" onclick="toggleTheme()" title="Basculer Mode Clair/Sombre">
                        <i class="fa-solid fa-moon"></i>
                    </button>'''

for p in other_pages:
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()
    c_norm = c.replace('\r\n', '\n')
    for old in lang_old_snippets:
        old_norm = old.replace('\r\n', '\n')
        if old_norm in c_norm:
            c_norm = c_norm.replace(old_norm, new_topbar_controls)
            with open(p, 'w', encoding='utf-8') as f:
                f.write(c_norm)
            print(f"Updated topbar in {p}")
            break
