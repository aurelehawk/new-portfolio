document.addEventListener('DOMContentLoaded', () => {
    const langButtons = {
        fr: document.getElementById('lang-fr'),
        en: document.getElementById('lang-en'),
    };
    let currentLang = 'fr';
    let portfolioData = {};

    const staticTranslations = {
        'nav.home': {
            fr: 'Accueil',
            en: 'Home',
        },
        'nav.skills': {
            fr: 'Compétences',
            en: 'Skills',
        },
        'nav.projects': {
            fr: 'Projets',
            en: 'Projects',
        },
        'nav.experience': {
            fr: 'Expérience',
            en: 'Experience',
        },
        'nav.education': {
            fr: 'Formation',
            en: 'Education',
        },
        'nav.contact': {
            fr: 'Contact',
            en: 'Contact',
        },
        'hero.projects_button': {
            fr: 'Voir mes projets',
            en: 'See my projects',
        },
        'hero.contact_button': {
            fr: 'Me contacter',
            en: 'Contact me',
        },
        'about.title': {
            fr: 'À Propos de Moi',
            en: 'About Me',
        },
        'skills.title': {
            fr: 'Stack Technique',
            en: 'Tech Stack',
        },
        'experience.title': {
            fr: 'Parcours Professionnel',
            en: 'Professional Journey',
        },
        'education.title': {
            fr: 'Formation Académique',
            en: 'Academic Background',
        },
        'projects.title': {
            fr: 'Projets Innovants',
            en: 'Innovative Projects',
        },
        'certifications.title': {
            fr: 'Certifications',
            en: 'Certifications',
        },
        'contact.title': {
            fr: 'Contactez-moi',
            en: 'Contact Me',
        },
        'footer.copyright': {
            fr: '© 2025 Pascal Aurèle ELOUMOU. Tous droits réservés.',
            en: '© 2025 Pascal Aurèle ELOUMOU. All rights reserved.',
        },
    };

    async function loadData() {
        try {
            const response = await fetch('data/portfolio-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            portfolioData = await response.json();
            updatePage();
        } catch (error) {
            console.error('Failed to load portfolio data:', error);
        }
    }

    function updatePage() {
        translateStaticContent();
        renderDynamicContent();
    }

    function translateStaticContent() {
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (staticTranslations[key] && staticTranslations[key][currentLang]) {
                if (el.tagName === 'META') {
                    el.setAttribute('content', staticTranslations[key][currentLang]);
                } else {
                    el.childNodes[0].nodeValue = staticTranslations[key][currentLang];
                }
            }
        });
    }

    function renderDynamicContent() {
        // Update meta title and description dynamically
        document.title = `${portfolioData.profile.name} - ${portfolioData.profile.title[currentLang]}`;
        document.querySelector('meta[name="description"]').setAttribute('content', portfolioData.profile.description[currentLang]);

        // Profile
        document.querySelector('[data-key="profile.title"]').textContent = portfolioData.profile.title[currentLang];
        document.querySelector('[data-key="profile.description"]').textContent = portfolioData.profile.description[currentLang];
        document.querySelector('[data-key="profile.about"]').textContent = portfolioData.profile.about[currentLang];
        document.querySelector('[data-key="profile.email"]').textContent = portfolioData.profile.email;
        document.querySelector('[data-key="profile.phone"]').textContent = portfolioData.profile.phone;
        document.getElementById('profile-photo').src = portfolioData.profile.photo;

        // Skills
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = '';
        for (const categoryId in portfolioData.skills) {
            const category = portfolioData.skills[categoryId];
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';
            const title = document.createElement('h3');
            title.textContent = category.title[currentLang];
            categoryDiv.appendChild(title);
            const itemList = document.createElement('ul');
            category.items.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<span class="skill-name">${item.name}</span> <span class="skill-level">${'★'.repeat(item.level/20)}</span>`;
                itemList.appendChild(listItem);
            });
            categoryDiv.appendChild(itemList);
            skillsList.appendChild(categoryDiv);
        }

        // Experience
        const experienceList = document.getElementById('experience-list');
        experienceList.innerHTML = '';
        portfolioData.experiences.forEach(exp => {
            const card = document.createElement('div');
            card.className = 'experience-card';
            card.innerHTML = `
                <div class="experience-header">
                    <h3>${exp.position[currentLang]}</h3>
                    <span class="experience-period">${exp.period}</span>
                </div>
                <div class="experience-company">${exp.company} - ${exp.location[currentLang]}</div>
                <p>${exp.sections.context[currentLang]}</p>
            `;
            experienceList.appendChild(card);
        });
        
        // Education
        const educationList = document.getElementById('education-list');
        educationList.innerHTML = '';
        portfolioData.education.forEach(edu => {
            const card = document.createElement('div');
            card.className = 'experience-card';
            card.innerHTML = `
                <div class="experience-header">
                    <h3>${edu.degree[currentLang]}</h3>
                    <span class="experience-period">${edu.period}</span>
                </div>
                <div class="experience-company">${edu.institution} - ${edu.location[currentLang]}</div>
                <p>${edu.description[currentLang]}</p>
            `;
            educationList.appendChild(card);
        });

        // Certifications
        const certificationsList = document.getElementById('certifications-list');
        certificationsList.innerHTML = '';
        portfolioData.certifications.forEach(cert => {
            const card = document.createElement('div');
            card.className = 'certification-card';
            card.innerHTML = `
                <div class="certification-logo">
                    <img src="${cert.logo}" alt="${cert.issuer} Logo">
                </div>
                <div class="certification-details">
                    <h3>${cert.name[currentLang]}</h3>
                    <p>${cert.issuer} - ${cert.year}</p>
                </div>
            `;
            certificationsList.appendChild(card);
        });

        // Projects
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '';
        portfolioData.projects.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h3>${proj.title[currentLang]}</h3>
                <h4>${proj.tagline[currentLang]}</h4>
                <p>${proj.description[currentLang]}</p>
                <div class="technologies">${proj.technologies.map(t => `<span>${t}</span>`).join('')}</div>
                <a href="${proj.github}" target="_blank">GitHub</a>
            `;
            projectsList.appendChild(card);
        });
    }

    function switchLang(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        updateLangButtons();
        updatePage();
    }

    function updateLangButtons() {
        for (const lang in langButtons) {
            if (lang === currentLang) {
                langButtons[lang].classList.add('active');
            } else {
                langButtons[lang].classList.remove('active');
            }
        }
    }

    langButtons.fr.addEventListener('click', () => switchLang('fr'));
    langButtons.en.addEventListener('click', () => switchLang('en'));

    loadData();
});
