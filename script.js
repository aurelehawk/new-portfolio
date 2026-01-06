document.addEventListener("DOMContentLoaded", () => {
    // ============================================================================
    // STATE MANAGEMENT - Single source of truth
    // ============================================================================
    const state = {
        currentLang: "en", // Default to English
        currentTheme: localStorage.getItem('theme') || 'light',
        portfolioData: {},
        mobileMenuOpen: false
    };

    // ============================================================================
    // STATIC TRANSLATIONS - For UI elements not in JSON
    // ============================================================================
    const staticTranslations = {
        'nav.home': { fr: 'Accueil', en: 'Home' },
        'nav.about': { fr: 'À Propos', en: 'About' },
        'nav.skills': { fr: 'Compétences', en: 'Skills' },
        'nav.projects': { fr: 'Projets', en: 'Projects' },
        'nav.experience': { fr: 'Expérience', en: 'Experience' },
        'nav.education': { fr: 'Formation', en: 'Education' },
        'nav.certifications': { fr: 'Certifications', en: 'Certifications' },
        'nav.contact': { fr: 'Contact', en: 'Contact' },
        'hero.projects_button': { fr: 'Voir mes projets', en: 'View my projects' },
        'hero.contact_button': { fr: 'Me contacter', en: 'Contact me' },
        'hero.download_cv': { fr: 'Télécharger CV', en: 'Download CV' },
        'hero.years_exp': { fr: "Ans d'expérience", en: 'Years Experience' },
        'hero.certifications': { fr: 'Certifications', en: 'Certifications' },
        'hero.projects_completed': { fr: 'Projets réalisés', en: 'Projects Completed' },
        'about.title': { fr: 'À Propos de Moi', en: 'About Me' },
        'about.subtitle': { fr: 'Passionné par la transformation des données en insights stratégiques', en: 'Passionate about transforming data into strategic insights' },
        'skills.title': { fr: 'Stack Technique', en: 'Technical Stack' },
        'skills.subtitle': { fr: 'Expertise complète sur toute la chaîne de valeur data', en: 'Comprehensive expertise across the data value chain' },
        'experience.title': { fr: 'Parcours Professionnel', en: 'Professional Journey' },
        'experience.subtitle': { fr: '10+ ans à générer un impact business data-driven', en: '10+ years delivering data-driven business impact' },
        'education.title': { fr: 'Formation Académique', en: 'Academic Background' },
        'education.subtitle': { fr: 'Solide fondation en data science et intelligence artificielle', en: 'Strong foundation in data science and artificial intelligence' },
        'projects.title': { fr: 'Projets Innovants', en: 'Innovative Projects' },
        'projects.subtitle': { fr: 'Solutions réelles combinant IA, data engineering et architecture cloud', en: 'Real-world solutions combining AI, data engineering and cloud architecture' },
        'certifications.title': { fr: 'Certifications', en: 'Certifications' },
        'certifications.subtitle': { fr: 'Expertise reconnue en plateformes data et machine learning', en: 'Recognized expertise in data platforms and machine learning' },
        'softskills.title': { fr: 'Savoir-être Professionnel', en: 'Professional Skills' },
        'softskills.subtitle': { fr: 'Au-delà de l\'expertise technique', en: 'Beyond technical expertise' },
        'languages.title': { fr: 'Langues', en: 'Languages' },
        'contact.title': { fr: 'Contactez-moi', en: 'Get in Touch' },
        'contact.intro': { fr: 'Ouvert aux opportunités CDI, consulting et freelance', en: 'Open to permanent positions, consulting and freelance opportunities' },
        'footer.copyright': { fr: '© 2025 Pascal Aurèle ELOUMOU. Tous droits réservés.', en: '© 2025 Pascal Aurèle ELOUMOU. All rights reserved.' },
        'meta.title': { 
            fr: 'Pascal Aurèle Eloumou - Data Engineer | GenAI | Snowflake | Expert Dataiku',
            en: 'Pascal Aurèle Eloumou - Data Engineer | GenAI | Snowflake | Dataiku Expert'
        },
        'meta.description': {
            fr: 'Pascal Aurèle Eloumou - Data Engineer & Analyst avec 10+ ans d\'expérience. Expert en migration Cloud (Snowflake/GCP), Pipelines ETL, Machine Learning (NLP) et développement Fullstack AppData (Next.js, Python).',
            en: 'Pascal Aurèle Eloumou - Data Engineer & Analyst with 10+ years experience. Expert in Cloud migration (Snowflake/GCP), ETL Pipelines, Machine Learning (NLP) and Fullstack DataApp development (Next.js, Python).'
        }
    };

    // ============================================================================
    // TEMPLATES - Reusable HTML generation (Single Responsibility Principle)
    // ============================================================================
    const templates = {
        skill: (category, lang) => `
            <div class="skill-category">
                <h3><i class="fas fa-layer-group"></i> ${category.title[lang]}</h3>
                <ul class="skill-list">
                    ${category.items.map(item => `
                        <li class="skill-item">
                            <div class="skill-header">
                                <i class="${item.icon || 'fas fa-star'}"></i>
                                <span class="skill-name">${item.name}</span>
                            </div>
                            ${item.details ? `<div class="skill-details">${item.details[lang] || ''}</div>` : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `,
        
        experience: (exp, lang) => `
            <div class="experience-card" data-aos="fade-up">
                <div class="experience-header">
                    <div class="experience-title-block">
                        <h3>${exp.position[lang]}</h3>
                        <div class="experience-company">
                            <i class="fas fa-building"></i> ${exp.company} - ${exp.location[lang]}
                        </div>
                    </div>
                    <div class="experience-meta">
                        <span class="experience-period"><i class="far fa-calendar"></i> ${exp.period}</span>
                        ${exp.type ? `<span class="experience-type">${exp.type[lang] || exp.type}</span>` : ''}
                    </div>
                </div>
                <div class="experience-details">
                    <div class="detail-block">
                        <h4><i class="fas fa-bullseye"></i> ${lang === 'fr' ? 'Contexte' : 'Context'}</h4>
                        <p>${exp.sections.context[lang]}</p>
                    </div>
                    <div class="detail-block">
                        <h4><i class="fas fa-tasks"></i> ${lang === 'fr' ? 'Missions' : 'Missions'}</h4>
                        <p>${exp.sections.missions[lang]}</p>
                    </div>
                    <div class="detail-block">
                        <h4><i class="fas fa-project-diagram"></i> ${lang === 'fr' ? 'Projets' : 'Projects'}</h4>
                        <p>${exp.sections.projects[lang]}</p>
                    </div>
                    <div class="detail-block results">
                        <h4><i class="fas fa-chart-line"></i> ${lang === 'fr' ? 'Résultats' : 'Results'}</h4>
                        <p>${exp.sections.results[lang]}</p>
                    </div>
                </div>
                <div class="stack">
                    ${exp.stack.map(t => `<span class="tech-tag"><i class="fas fa-code"></i> ${t}</span>`).join('')}
                </div>
            </div>
        `,
        
        education: (edu, lang) => `
            <div class="experience-card" data-aos="fade-up">
                <div class="experience-header">
                    <div class="experience-title-block">
                        <h3>${edu.degree[lang]}</h3>
                        <div class="experience-company">
                            <i class="fas fa-university"></i> ${edu.institution} - ${edu.location[lang]}
                        </div>
                    </div>
                    <span class="experience-period"><i class="far fa-calendar"></i> ${edu.period}</span>
                </div>
                <p class="education-description">${edu.description[lang]}</p>
            </div>
        `,
        
        project: (proj, lang) => `
            <div class="project-card" data-aos="fade-up">
                ${proj.image ? `
                    <div class="project-image">
                        <img src="${proj.image}" alt="${proj.title[lang]} preview" loading="lazy">
                        <div class="project-overlay">
                            <i class="fas fa-search-plus"></i>
                        </div>
                    </div>
                ` : ''}
                <div class="project-content">
                    <h3>${proj.title[lang]}</h3>
                    <p class="project-tagline"><i class="fas fa-lightbulb"></i> ${proj.tagline[lang]}</p>
                    <p class="project-role"><strong><i class="fas fa-user-tie"></i> ${proj.role[lang]}</strong></p>
                    <p class="project-description">${proj.description[lang]}</p>
                    <h4><i class="fas fa-star"></i> ${lang === 'fr' ? 'Fonctionnalités clés' : 'Key Features'}</h4>
                    <ul class="project-features">
                        ${proj.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f[lang]}</li>`).join('')}
                    </ul>
                    <div class="technologies">
                        ${proj.technologies.map(t => `<span class="tech-tag"><i class="fas fa-code"></i> ${t}</span>`).join('')}
                    </div>
                    ${proj.github ? `
                        <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="btn-secondary">
                            <i class="fab fa-github"></i> ${lang === 'fr' ? 'Voir sur GitHub' : 'View on GitHub'}
                        </a>
                    ` : ''}
                </div>
            </div>
        `,
        
        certification: (cert, lang) => `
            <div class="certification-card" data-aos="zoom-in">
                ${cert.logo ? `<div class="certification-logo"><img src="${cert.logo}" alt="${cert.issuer} Logo" loading="lazy"></div>` : ''}
                <div class="certification-details">
                    <h3>${cert.name[lang]}</h3>
                    <p><i class="fas fa-certificate"></i> ${cert.issuer} - ${cert.year}</p>
                </div>
            </div>
        `,
        
        softskill: (skill) => `
            <div class="softskill-item" data-aos="fade-right">
                <i class="fas fa-check-circle"></i>
                <span>${skill}</span>
            </div>
        `,
        
        language: (lang, langData) => `
            <div class="language-item" data-aos="fade-up">
                <i class="${langData.icon}"></i>
                <div class="language-info">
                    <h4>${langData.name[lang]}</h4>
                    <p>${langData.level[lang]}</p>
                </div>
            </div>
        `
    };

    // ============================================================================
    // SECTION CONFIGURATION - DRY Principle (Don't Repeat Yourself)
    // ============================================================================
    const sectionConfig = {
        skills: {
            containerId: 'skills-list',
            dataKey: 'skills',
            template: templates.skill,
            isObject: true
        },
        experiences: {
            containerId: 'experience-list',
            dataKey: 'experiences',
            template: templates.experience
        },
        education: {
            containerId: 'education-list',
            dataKey: 'education',
            template: templates.education
        },
        projects: {
            containerId: 'projects-list',
            dataKey: 'projects',
            template: templates.project
        },
        certifications: {
            containerId: 'certifications-list',
            dataKey: 'certifications',
            template: templates.certification
        },
        softskills: {
            containerId: 'softskills-list',
            dataKey: 'softskills',
            template: (item, lang) => templates.softskill(item[lang]),
            isArray: true
        },
        languages: {
            containerId: 'languages-list',
            dataKey: 'languages',
            template: templates.language,
            isArray: true
        }
    };

    // ============================================================================
    // DATA MANAGER - Handles data loading
    // ============================================================================
    const dataManager = {
        async load() {
            try {
                const response = await fetch('data/portfolio-data.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                state.portfolioData = await response.json();
                return true;
            } catch (error) {
                console.error('Failed to load portfolio data:', error);
                this.showError();
                return false;
            }
        },
        
        showError() {
            document.body.innerHTML += `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load portfolio data. Please refresh the page.</p>
                </div>
            `;
        }
    };

    // ============================================================================
    // UI MANAGER - Handles all UI updates
    // ============================================================================
    const uiManager = {
        renderSection(config) {
            const container = document.getElementById(config.containerId);
            if (!container) return;

            const data = state.portfolioData[config.dataKey];
            if (!data) return;

            container.innerHTML = '';

            let items;
            if (config.isObject) {
                items = Object.values(data);
            } else if (config.isArray) {
                items = data.items || [];
            } else {
                items = data;
            }
            
            if (items && items.length > 0) {
                items.forEach(item => {
                    container.innerHTML += config.template(item, state.currentLang);
                });
            }
        },

        renderAllSections() {
            Object.keys(sectionConfig).forEach(key => {
                this.renderSection(sectionConfig[key]);
            });
        },

        updateStaticText() {
            document.querySelectorAll('[data-translate]').forEach(el => {
                const key = el.getAttribute('data-translate');
                const translation = staticTranslations[key]?.[state.currentLang];
                if (translation) {
                    if (el.tagName === 'META') {
                        el.setAttribute('content', translation);
                    } else if (el.tagName === 'TITLE') {
                        el.textContent = translation;
                    } else {
                        const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                        if (textNode) {
                            textNode.nodeValue = translation;
                        } else {
                            el.textContent = translation;
                        }
                    }
                }
            });
        },
        
        updateDynamicText() {
            const profile = state.portfolioData.profile;
            if (!profile) return;
            
            document.title = `${profile.name} - ${profile.title[state.currentLang]}`;
            
            this.setElementText('[data-key="profile.title"]', profile.title[state.currentLang]);
            this.setElementText('[data-key="profile.tagline"]', profile.tagline[state.currentLang]);
            this.setElementText('[data-key="profile.description"]', profile.description[state.currentLang]);
            this.setElementText('[data-key="profile.about"]', profile.about[state.currentLang]);
            this.setElementText('[data-key="profile.email"]', profile.email);
            this.setElementText('[data-key="profile.phone"]', profile.phone);
            this.setElementText('[data-key="profile.location"]', profile.location[state.currentLang]);
            this.setElementText('[data-key="profile.availability"]', profile.availability[state.currentLang]);

            const profilePhoto = document.getElementById('profile-photo');
            if (profile.photo && profilePhoto) {
                profilePhoto.src = profile.photo;
                profilePhoto.alt = profile.name;
            }
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

    // ============================================================================
    // THEME MANAGER - Handles dark/light theme
    // ============================================================================
    const themeManager = {
        init() {
            this.applyTheme(state.currentTheme);
            this.updateThemeIcon();
        },
        
        toggle() {
            state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(state.currentTheme);
            this.updateThemeIcon();
            localStorage.setItem('theme', state.currentTheme);
        },
        
        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
        },
        
        updateThemeIcon() {
            const icon = document.querySelector('#theme-toggle i');
            if (icon) {
                icon.className = state.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    };

    // ============================================================================
    // PRINT MANAGER - Handles PDF export/print
    // ============================================================================
    const printManager = {
        print() {
            window.print();
        }
    };

    // ============================================================================
    // NAVIGATION MANAGER - Handles smooth scrolling and mobile menu
    // ============================================================================
    const navigationManager = {
        init() {
            this.setupSmoothScroll();
            this.setupMobileMenu();
            this.setupStickyNav();
        },
        
        setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href === '#' || href === '#!') return;
                    
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const navHeight = document.getElementById('main-nav').offsetHeight;
                        const targetPosition = target.offsetTop - navHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        this.closeMobileMenu();
                    }
                });
            });
        },
        
        setupMobileMenu() {
            const mobileToggle = document.getElementById('mobile-menu-toggle');
            const closeMenu = document.getElementById('close-menu');
            const nav = document.getElementById('main-nav');
            
            if (mobileToggle) {
                mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
            }
            
            if (closeMenu) {
                closeMenu.addEventListener('click', () => this.closeMobileMenu());
            }
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (state.mobileMenuOpen && 
                    !nav.contains(e.target) && 
                    !mobileToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        },
        
        toggleMobileMenu() {
            state.mobileMenuOpen = !state.mobileMenuOpen;
            const nav = document.getElementById('main-nav');
            if (nav) {
                nav.classList.toggle('active', state.mobileMenuOpen);
                document.body.style.overflow = state.mobileMenuOpen ? 'hidden' : '';
            }
        },
        
        closeMobileMenu() {
            state.mobileMenuOpen = false;
            const nav = document.getElementById('main-nav');
            if (nav) {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        },
        
        setupStickyNav() {
            const nav = document.getElementById('main-nav');
            let lastScroll = 0;
            
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 100) {
                    nav.classList.add('scrolled');
                    
                    if (currentScroll > lastScroll && !state.mobileMenuOpen) {
                        nav.classList.add('nav-hidden');
                    } else {
                        nav.classList.remove('nav-hidden');
                    }
                } else {
                    nav.classList.remove('scrolled', 'nav-hidden');
                }
                
                lastScroll = currentScroll;
            });
        }
    };

    // ============================================================================
    // EVENT MANAGER - Centralized event handling
    // ============================================================================
    const eventManager = {
        init() {
            this.setupLanguageSwitcher();
            this.setupThemeToggle();
            this.setupPrintButton();
            this.setupDownloadCV();
        },
        
        setupLanguageSwitcher() {
            document.getElementById('lang-en')?.addEventListener('click', () => this.switchLang('en'));
            document.getElementById('lang-fr')?.addEventListener('click', () => this.switchLang('fr'));
        },
        
        switchLang(lang) {
            if (state.currentLang === lang) return;
            state.currentLang = lang;
            uiManager.updateAll();
        },
        
        setupThemeToggle() {
            document.getElementById('theme-toggle')?.addEventListener('click', () => {
                themeManager.toggle();
            });
        },
        
        setupPrintButton() {
            document.getElementById('print-btn')?.addEventListener('click', () => {
                printManager.print();
            });
        },
        
        setupDownloadCV() {
            document.getElementById('download-cv')?.addEventListener('click', (e) => {
                e.preventDefault();
                const profile = state.portfolioData.profile;
                if (profile?.cv_file) {
                    window.open(profile.cv_file, '_blank');
                }
            });
        }
    };

    // ============================================================================
    // INITIALIZATION - Application entry point
    // ============================================================================
    async function init() {
        // Show loading state
        document.body.classList.add('loading');
        
        // Initialize theme first (for instant theme application)
        themeManager.init();
        
        // Load data
        const dataLoaded = await dataManager.load();
        
        if (dataLoaded) {
            // Initialize all managers
            eventManager.init();
            navigationManager.init();
            
            // Update UI
            uiManager.updateAll();
        }
        
        // Remove loading state
        document.body.classList.remove('loading');
    }

    // Start the application
    init();
});