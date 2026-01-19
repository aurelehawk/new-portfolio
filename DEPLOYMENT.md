# Guide de Déploiement - Portfolio en Production

## 📋 Prérequis

- Git installé sur votre machine
- Compte GitHub avec le repository `aurelehawk/new-portfolio`
- Accès en écriture au repository

## 🚀 Étapes de Déploiement

### 1. Vérifier l'état du repository local

```bash
cd new-portfolio
git status
```

### 2. Ajouter tous les fichiers modifiés

```bash
git add .
```

### 3. Commiter les changements

```bash
git commit -m "feat: Ajout système admin avec authentification et statistiques"
```

### 4. Pousser vers GitHub (main branch)

```bash
git push origin main
```

### 5. Activer GitHub Pages dans les Settings

1. Allez sur https://github.com/aurelehawk/new-portfolio
2. Cliquez sur **Settings** (en haut du repository)
3. Dans le menu gauche, cliquez sur **Pages**
4. Dans **Source**, sélectionnez :
   - **Deploy from a branch**
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Cliquez sur **Save**

### 6. Activer GitHub Actions (si nécessaire)

1. Dans **Settings** → **Actions** → **General**
2. Vérifiez que **Workflow permissions** est sur "Read and write permissions"
3. Cochez "Allow GitHub Actions to create and approve pull requests"

### 7. Vérifier le déploiement

- Le workflow GitHub Actions se lancera automatiquement après le push
- Vous pouvez suivre la progression dans l'onglet **Actions** de votre repository
- Une fois terminé, votre site sera accessible à : `https://aurelehawk.github.io/new-portfolio/`

## 📝 Commandes Git Complètes (Copier-Coller)

```bash
# Se placer dans le dossier du projet
cd new-portfolio

# Vérifier l'état
git status

# Ajouter tous les fichiers
git add .

# Commiter
git commit -m "feat: Déploiement portfolio avec système admin et analytics"

# Pousser vers GitHub
git push origin main
```

## 🔧 Configuration GitHub Pages Manuelle (Alternative)

Si GitHub Actions ne fonctionne pas, vous pouvez déployer manuellement :

1. **Settings** → **Pages**
2. **Source** : Sélectionnez la branche `main` et le dossier `/ (root)`
3. **Save**

## ✅ Vérification Post-Déploiement

Après le déploiement, vérifiez :

- [ ] La page principale est accessible : `https://aurelehawk.github.io/new-portfolio/`
- [ ] Le bouton admin redirige vers la page de login
- [ ] La connexion admin fonctionne avec les identifiants configurés
- [ ] Les statistiques s'affichent dans la page admin
- [ ] Le mode sombre/clair fonctionne
- [ ] La traduction FR/EN fonctionne
- [ ] Les images se chargent correctement

## 🔐 Identifiants Admin (Production)

**⚠️ IMPORTANT** : Les identifiants sont actuellement stockés dans `auth.js` :
- Username: `eloumou86@gmail.com`
- Password: `Ah64@pache`

Pour des raisons de sécurité, en production, vous devriez :
- Utiliser des variables d'environnement
- Implémenter un backend pour l'authentification
- Ne jamais commiter les mots de passe en clair (déjà fait avec le hash)

## 🐛 Résolution de Problèmes

### Le site ne se déploie pas

1. Vérifiez les workflows GitHub Actions dans l'onglet **Actions**
2. Vérifiez que GitHub Pages est activé dans **Settings** → **Pages**
3. Assurez-vous que la branche `main` existe et contient vos fichiers

### Erreur 404

- Vérifiez que `index.html` est à la racine du repository
- Vérifiez que GitHub Pages pointe vers la bonne branche et dossier

### Les fichiers ne se chargent pas

- Vérifiez que tous les chemins relatifs sont corrects
- Vérifiez que les fichiers CSS/JS sont bien inclus dans le repository

## 📚 Ressources

- [Documentation GitHub Pages](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Repository GitHub](https://github.com/aurelehawk/new-portfolio)
