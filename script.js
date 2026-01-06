document.addEventListener('DOMContentLoaded', () => {
    const langButtons = {
        fr: document.getElementById('lang-fr'),
        en: document.getElementById('lang-en'),
    };
    let currentLang = 'fr';
    let portfolioData = {};

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

    async function loadData() {
        try {
            const response = await fetch('data/portfolio-data.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
            const translation = staticTranslations[key]?.[currentLang];
            if (translation) {
                if (el.tagName === 'META') el.setAttribute('content', translation);
                else el.childNodes[0].nodeValue = translation;
            }
        });
    }

    function renderDynamicContent() {
        const profile = portfolioData.profile;
        document.title = `${profile.name} - ${profile.title[currentLang]}`;
        document.querySelector('meta[name="description"]').setAttribute('content', profile.description[currentLang]);

        document.querySelector('[data-key="profile.title"]').textContent = profile.title[currentLang];
        document.querySelector('[data-key="profile.description"]').textContent = profile.description[currentLang];
        document.querySelector('[data-key="profile.about"]').textContent = profile.about[currentLang];
        document.querySelector('[data-key="profile.email"]').textContent = profile.email;
        document.querySelector('[data-key="profile.phone"]').textContent = profile.phone;
        if (profile.photo) document.getElementById('profile-photo').src = profile.photo;

        renderSkills();
        renderExperience();
        renderEducation();
        renderProjects();
        renderCertifications();
    }

    function renderSkills() {
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = '';
        for (const categoryId in portfolioData.skills) {
            const category = portfolioData.skills[categoryId];
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';
            categoryDiv.innerHTML = `<h3>${category.title[currentLang]}</h3>`;
            const itemList = document.createElement('ul');
            category.items.forEach(item => {
                const details = item.details ? `<div class="skill-details">${item.details[currentLang] || ''}</div>` : '';
                itemList.innerHTML += `
                    <li class="skill-item">
                        <i class="${item.icon || 'fas fa-star'}"></i>
                        <div>
                            <span class="skill-name">${item.name}</span>
                            ${details}
                        </div>
                    </li>`;
            });
            categoryDiv.appendChild(itemList);
            skillsList.appendChild(categoryDiv);
        }
    }

    function renderExperience() {
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
                <div class="experience-details">
                    <h4>Contexte</h4><p>${exp.sections.context[currentLang]}</p>
                    <h4>Missions</h4><p>${exp.sections.missions[currentLang]}</p>
                    <h4>Projets</h4><p>${exp.sections.projects[currentLang]}</p>
                    <h4>Résultats</h4><p>${exp.sections.results[currentLang]}</p>
                </div>
                <div class="stack">${exp.stack.map(t => `<span>${t}</span>`).join('')}</div>
            `;
            experienceList.appendChild(card);
        });
    }

    function renderEducation() {
        const educationList = document.getElementById('education-list');
        educationList.innerHTML = '';
        portfolioData.education.forEach(edu => {
            const card = document.createElement('div');
            card.className = 'experience-card'; // Reuse style
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
    }

    function renderProjects() {
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '';
        portfolioData.projects.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="project-image">
                    <img src="${proj.image || ''}" alt="${proj.title[currentLang]} preview">
                </div>
                <div class="project-content">
                    <h3>${proj.title[currentLang]}</h3>
                    <p><strong>${proj.role[currentLang]}</strong></p>
                    <p>${proj.description[currentLang]}</p>
                    <h4>Fonctionnalités</h4>
                    <ul class="project-features">
                        ${proj.features.map(f => `<li>${f[currentLang]}</li>`).join('')}
                    </ul>
                    <div class="technologies">${proj.technologies.map(t => `<span>${t}</span>`).join('')}</div>
                    <a href="${proj.github}" target="_blank" class="btn-secondary">Voir sur GitHub</a>
                </div>
            `;
            projectsList.appendChild(card);
        });
    }

    function renderCertifications() {
        const certificationsList = document.getElementById('certifications-list');
        certificationsList.innerHTML = '';
        portfolioData.certifications.forEach(cert => {
            const card = document.createElement('div');
            card.className = 'certification-card';
            card.innerHTML = `
                <div class="certification-logo"><img src="${cert.logo}" alt="${cert.issuer} Logo"></div>
                <div class="certification-details">
                    <h3>${cert.name[currentLang]}</h3>
                    <p>${cert.issuer} - ${cert.year}</p>
                </div>
            `;
            certificationsList.appendChild(card);
        });
    }

    function switchLang(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        updateLangButtons();
        updatePage();
    }

    function updateLangButtons() {
        Object.values(langButtons).forEach(btn => btn.classList.remove('active'));
        langButtons[currentLang].classList.add('active');
    }

    langButtons.fr.addEventListener('click', () => switchLang('fr'));
    langButtons.en.addEventListener('click', () => switchLang('en'));

    loadData();
});
