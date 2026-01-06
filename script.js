document.addEventListener("DOMContentLoaded", () => {
    // --- 1. CONFIGURATION & STATE MANAGEMENT ---

    const state = {
        currentLang: "fr",
        portfolioData: {},
    };

    // Translations for static elements not loaded from the JSON
    const staticTranslations = {
        'nav.home': { fr: 'Accueil', en: 'Home' },
        'nav.skills': { fr: 'Compétences', en: 'Skills' },
        'nav.projects': { fr: 'Projets', en: 'Projects' },
        'nav.experience': { fr: 'Expérience', en: 'Experience' },
        'nav.education': { fr: 'Formation', en: 'Education' },
        'nav.contact': { fr: 'Contact', en: 'Contact' },
        'hero.projects_button': { fr: 'Voir mes projets', en: 'See my projects' },
        'hero.contact_button': { fr: 'Me contacter', en: 'Contact me' },
        'about.title': { fr: 'À Propos de Moi', en: 'About Me' },
        'skills.title': { fr: 'Stack Technique', en: 'Tech Stack' },
        'experience.title': { fr: 'Parcours Professionnel', en: 'Professional Journey' },
        'education.title': { fr: 'Formation Académique', en: 'Academic Background' },
        'projects.title': { fr: 'Projets Innovants', en: 'Innovative Projects' },
        'certifications.title': { fr: 'Certifications', en: 'Certifications' },
        'contact.title': { fr: 'Contactez-moi', en: 'Contact Me' },
        'footer.copyright': { fr: '© 2025 Pascal Aurèle ELOUMOU. Tous droits réservés.', en: '© 2025 Pascal Aurèle ELOUMOU. All rights reserved.' },
    };

    // --- 2. TEMPLATING (Single Responsibility Principle) ---
    // Each function is responsible for creating the HTML for a single item.

    const templates = {
        skill: (category, lang) => `
            <div class="skill-category">
                <h3>${category.title[lang]}</h3>
                <ul>
                    ${category.items.map(item => `
                        <li class="skill-item">
                            <i class="${item.icon || 'fas fa-star'}"></i>
                            <div>
                                <span class="skill-name">${item.name}</span>
                                <div class="skill-details">${item.details ? (item.details[lang] || '') : ''}</div>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `,
        experience: (exp, lang) => `
            <div class="experience-card">
                <div class="experience-header">
                    <h3>${exp.position[lang]}</h3>
                    <span class="experience-period">${exp.period}</span>
                </div>
                <div class="experience-company">${exp.company} - ${exp.location[lang]}</div>
                <div class="experience-details">
                    <h4>Contexte</h4><p>${exp.sections.context[lang]}</p>
                    <h4>Missions</h4><p>${exp.sections.missions[lang]}</p>
                    <h4>Projets</h4><p>${exp.sections.projects[lang]}</p>
                    <h4>Résultats</h4><p>${exp.sections.results[lang]}</p>
                </div>
                <div class="stack">${exp.stack.map(t => `<span>${t}</span>`).join('')}</div>
            </div>
        `,
        education: (edu, lang) => `
            <div class="experience-card">
                <div class="experience-header">
                    <h3>${edu.degree[lang]}</h3>
                    <span class="experience-period">${edu.period}</span>
                </div>
                <div class="experience-company">${edu.institution} - ${edu.location[lang]}</div>
                <p>${edu.description[lang]}</p>
            </div>
        `,
        project: (proj, lang) => `
            <div class="project-card">
                <div class="project-image">
                    <img src="${proj.image || ''}" alt="${proj.title[lang]} preview">
                </div>
                <div class="project-content">
                    <h3>${proj.title[lang]}</h3>
                    <p><strong>${proj.role[lang]}</strong></p>
                    <p>${proj.description[lang]}</p>
                    <h4>Fonctionnalités</h4>
                    <ul class="project-features">
                        ${proj.features.map(f => `<li>${f[lang]}</li>`).join('')}
                    </ul>
                    <div class="technologies">${proj.technologies.map(t => `<span>${t}</span>`).join('')}</div>
                    <a href="${proj.github}" target="_blank" class="btn-secondary">Voir sur GitHub</a>
                </div>
            </div>
        `,
        certification: (cert, lang) => `
            <div class="certification-card">
                <div class="certification-logo"><img src="${cert.logo}" alt="${cert.issuer} Logo"></div>
                <div class="certification-details">
                    <h3>${cert.name[lang]}</h3>
                    <p>${cert.issuer} - ${cert.year}</p>
                </div>
            </div>
        `
    };

    // --- 3. DYNAMIC SECTION CONFIGURATION (DRY Principle) ---
    // Central configuration for all dynamic sections.
    // To add a new section, just add an entry here.

    const sectionConfig = {
        skills: {
            containerId: 'skills-list',
            dataKey: 'skills',
            template: templates.skill,
            isObject: true // Special case for skills, which is an object of categories
        },
        experiences: {
            containerId: 'experience-list',
            dataKey: 'experiences',
            template: templates.experience,
        },
        education: {
            containerId: 'education-list',
            dataKey: 'education',
            template: templates.education,
        },
        projects: {
            containerId: 'projects-list',
            dataKey: 'projects',
            template: templates.project,
        },
        certifications: {
            containerId: 'certifications-list',
            dataKey: 'certifications',
            template: templates.certification,
        }
    };

    // --- 4. CORE LOGIC ---

    const dataManager = {
        async load() {
            try {
                const response = await fetch('data/portfolio-data.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                state.portfolioData = await response.json();
            } catch (error) {
                console.error('Failed to load portfolio data:', error);
                // Optionally, display an error message to the user on the page
            }
        }
    };

    const uiManager = {
        // Generic function to render any section based on the config
        renderSection(config) {
            const container = document.getElementById(config.containerId);
            if (!container) return;

            const data = state.portfolioData[config.dataKey];
            if (!data) return;

            container.innerHTML = ''; // Clear previous content

            const items = config.isObject ? Object.values(data) : data;
            
            if (items && items.length > 0) {
                 items.forEach(item => {
                    container.innerHTML += config.template(item, state.currentLang);
                });
            }
        },

        renderAllSections() {
            for (const key in sectionConfig) {
                this.renderSection(sectionConfig[key]);
            }
        },

        updateStaticText() {
            document.querySelectorAll('[data-translate]').forEach(el => {
                const key = el.getAttribute('data-translate');
                const translation = staticTranslations[key]?.[state.currentLang];
                if (translation) {
                    // Handle meta tags and regular elements differently
                    if (el.tagName === 'META') {
                        el.setAttribute('content', translation);
                    } else {
                        // More robustly find the text node to update
                        const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                        if(textNode) textNode.nodeValue = translation;
                    }
                }
            });
        },
        
        updateDynamicText() {
            const profile = state.portfolioData.profile;
            if(!profile) return;
            
            document.title = `${profile.name} - ${profile.title[state.currentLang]}`;
            this.setElementText('[data-key="profile.title"]', profile.title[state.currentLang]);
            this.setElementText('[data-key="profile.description"]', profile.description[state.currentLang]);
            this.setElementText('[data-key="profile.about"]', profile.about[state.currentLang]);
            this.setElementText('[data-key="profile.email"]', profile.email);
            this.setElementText('[data-key="profile.phone"]', profile.phone);

            const profilePhoto = document.getElementById('profile-photo');
            if (profile.photo && profilePhoto) profilePhoto.src = profile.photo;
        },

        setElementText(selector, text) {
            const el = document.querySelector(selector);
            if (el) el.textContent = text;
        },


        updateLangButtons() {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.id.includes(state.currentLang));
            });
            document.documentElement.lang = state.currentLang;
        },

        updateAll() {
            this.updateLangButtons();
            this.updateStaticText();
            if (state.portfolioData && Object.keys(state.portfolioData).length > 0) {
                this.updateDynamicText();
                this.renderAllSections();
            }
        }
    };

    const eventManager = {
        setupLangSwitcher() {
            document.getElementById('lang-fr').addEventListener('click', () => this.switchLang('fr'));
            document.getElementById('lang-en').addEventListener('click', () => this.switchLang('en'));
        },
        
        switchLang(lang) {
            if (state.currentLang === lang) return;
            state.currentLang = lang;
            uiManager.updateAll();
        },

        init() {
            this.setupLangSwitcher();
        }
    };

    // --- 5. INITIALIZATION ---

    async function init() {
        eventManager.init();
        await dataManager.load();
        uiManager.updateAll();
    }

    init();
});
