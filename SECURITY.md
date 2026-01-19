# 🔐 Guide de Sécurité - Configuration des Identifiants

## ⚠️ IMPORTANT : Protection des Identifiants

Les identifiants d'authentification admin sont maintenant sécurisés et **ne seront PAS versionnés sur GitHub**.

## 📋 Configuration Initiale

### 1. Créer le fichier de configuration

Le fichier `config.js` est dans `.gitignore` et ne sera **jamais** commité sur GitHub.

**Première fois :**
```bash
# Copier le fichier d'exemple
cp config.example.js config.js
```

### 2. Modifier les identifiants

Éditez `config.js` et changez les valeurs :

```javascript
const AuthConfig = {
    username: 'votre_email@example.com',
    password: 'VotreMotDePasseSecurise123!'
};
```

### 3. Vérifier que config.js est ignoré

Le fichier `config.js` doit être dans `.gitignore` (déjà fait ✅).

Vérifiez avec :
```bash
git status
# config.js ne doit PAS apparaître dans la liste
```

## 🔒 Sécurité

### ✅ Ce qui est sécurisé

- ✅ `config.js` est dans `.gitignore` → **Ne sera jamais sur GitHub**
- ✅ `config.example.js` contient des valeurs par défaut (sans vos vrais identifiants)
- ✅ Les identifiants ne sont plus en dur dans `auth.js`

### ⚠️ Limitations pour un site statique

Pour un site statique hébergé sur GitHub Pages :
- Le code JavaScript est accessible côté client
- **Cependant**, `config.js` ne sera pas sur GitHub grâce à `.gitignore`
- Les identifiants restent visibles dans le navigateur (inspecteur) mais pas sur le repository public

### 🚀 Recommandations pour Production

1. **Changez régulièrement le mot de passe**
2. **Utilisez un mot de passe fort** (min. 12 caractères, majuscules, minuscules, chiffres, symboles)
3. **Ne partagez jamais** le fichier `config.js`
4. **Pour une sécurité maximale**, envisagez :
   - Un backend avec authentification serveur
   - OAuth/SSO
   - Variables d'environnement (nécessite un build process)

## 📝 Checklist de Déploiement

Avant de pousser sur GitHub :

- [ ] `config.js` est créé localement
- [ ] `config.js` contient vos vrais identifiants
- [ ] `config.js` est dans `.gitignore` ✅
- [ ] `git status` ne montre PAS `config.js`
- [ ] `config.example.js` est versionné (sans vrais identifiants) ✅

## 🐛 Dépannage

### Erreur : "AuthConfig is not defined"

**Cause** : Le fichier `config.js` n'existe pas.

**Solution** :
```bash
cp config.example.js config.js
# Puis modifiez config.js avec vos identifiants
```

### Les identifiants ne fonctionnent pas

1. Vérifiez que `config.js` est bien chargé avant `auth.js` dans le HTML
2. Vérifiez que les valeurs dans `config.js` sont correctes
3. Videz le cache du navigateur (Ctrl+F5)

## 📚 Fichiers

- `config.example.js` → **Versionné** (template sans vrais identifiants)
- `config.js` → **NON versionné** (vos vrais identifiants)
- `auth.js` → **Versionné** (logique d'authentification, sans credentials)

---

**⚠️ RAPPEL** : Ne commitez JAMAIS `config.js` sur GitHub !
