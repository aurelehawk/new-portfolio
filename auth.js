// ============================================================================
// AUTHENTICATION SYSTEM
// ============================================================================

const AuthSystem = {
    // Configuration des credentials chargée depuis config.js (non versionné)
    // Le fichier config.js doit être créé à partir de config.example.js
    get defaultUsername() {
        return (typeof AuthConfig !== 'undefined' && AuthConfig.username) 
            ? AuthConfig.username 
            : 'admin'; // Fallback si config.js n'existe pas
    },
    
    get defaultPassword() {
        return (typeof AuthConfig !== 'undefined' && AuthConfig.password) 
            ? AuthConfig.password 
            : 'admin123'; // Fallback si config.js n'existe pas
    },
    
    // Hash simple du mot de passe (pour la sécurité basique)
    async hashPassword(password) {
        // Utilisation d'une fonction de hash simple
        // En production, utilisez bcrypt ou une autre méthode sécurisée
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    },
    
    async initCredentials() {
        // Initialiser les credentials si pas déjà fait
        const storedHash = localStorage.getItem('admin_password_hash');
        if (!storedHash) {
            const hash = await this.hashPassword(this.defaultPassword);
            localStorage.setItem('admin_password_hash', hash);
            localStorage.setItem('admin_username', this.defaultUsername);
        }
    },
    
    async validateCredentials(username, password) {
        await this.initCredentials();
        
        const storedUsername = localStorage.getItem('admin_username');
        const storedHash = localStorage.getItem('admin_password_hash');
        
        if (!storedUsername || !storedHash) {
            return false;
        }
        
        if (username !== storedUsername) {
            return false;
        }
        
        const passwordHash = await this.hashPassword(password);
        return passwordHash === storedHash;
    },
    
    isAuthenticated() {
        // Vérifier si une session est active
        const sessionToken = sessionStorage.getItem('admin_session');
        const sessionTime = sessionStorage.getItem('admin_session_time');
        
        if (!sessionToken || !sessionTime) {
            return false;
        }
        
        // Vérifier que la session n'est pas expirée (24 heures)
        const now = Date.now();
        const sessionAge = now - parseInt(sessionTime);
        const maxAge = 24 * 60 * 60 * 1000; // 24 heures
        
        if (sessionAge > maxAge) {
            this.logout();
            return false;
        }
        
        return true;
    },
    
    login(username, password) {
        return new Promise(async (resolve, reject) => {
            const isValid = await this.validateCredentials(username, password);
            
            if (isValid) {
                // Créer une session
                const sessionToken = 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                sessionStorage.setItem('admin_session', sessionToken);
                sessionStorage.setItem('admin_session_time', Date.now().toString());
                resolve(true);
            } else {
                reject(new Error('Identifiants incorrects'));
            }
        });
    },
    
    logout() {
        sessionStorage.removeItem('admin_session');
        sessionStorage.removeItem('admin_session_time');
    },
    
    requireAuth() {
        // Rediriger vers login si pas authentifié
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};
