# Portfolio Pascal Aurèle ELOUMOU

Portfolio professionnel développé en HTML/CSS/JavaScript vanilla.

## 🚀 Déploiement sur GitHub Pages

Ce portfolio est configuré pour être déployé automatiquement sur GitHub Pages via GitHub Actions.

### Prérequis

- Un compte GitHub
- Le repository `https://github.com/aurelehawk/new-portfolio`

### Déploiement Automatique

Le site se déploie automatiquement à chaque push sur la branche `main` grâce à GitHub Actions.

### Déploiement Manuel via GitHub Pages

1. Allez dans les **Settings** de votre repository GitHub
2. Dans le menu de gauche, cliquez sur **Pages**
3. Dans la section **Source**, sélectionnez :
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Cliquez sur **Save**

Votre site sera accessible à l'adresse : `https://aurelehawk.github.io/new-portfolio/`

### Structure du Projet

```
new-portfolio/
├── index.html          # Page principale du portfolio
├── admin.html          # Page d'administration (protégée)
├── login.html          # Page de connexion admin
├── script.js           # Logique principale
├── styles.css          # Styles CSS
├── analytics.js        # Système de tracking des visites
├── auth.js             # Système d'authentification
├── admin.js            # Dashboard des statistiques
├── data/               # Données JSON et images
└── images/             # Logos et autres images
```

### Fonctionnalités

- ✅ Portfolio responsive multilingue (FR/EN)
- ✅ Mode sombre/clair
- ✅ Système de tracking des visites (IndexedDB)
- ✅ Page admin avec statistiques détaillées
- ✅ Authentification sécurisée pour l'accès admin

### Technologies Utilisées

- HTML5
- CSS3 (Variables CSS, Flexbox, Grid)
- JavaScript (Vanilla)
- IndexedDB pour le stockage local
- Font Awesome pour les icônes

## 📝 Notes de Déveloiement

### Sécurité

- Les identifiants admin sont stockés localement dans le navigateur
- En production, envisagez d'utiliser un système d'authentification backend
- Les données de tracking sont stockées côté client (IndexedDB)

### Compatibilité Navigateurs

- Chrome/Edge (recommandé)
- Firefox
- Safari
- Opera

### Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

© 2025 Pascal Aurèle ELOUMOU. Tous droits réservés.
