// ============================================================================
// ANALYTICS TRACKING SYSTEM - IndexedDB Storage
// ============================================================================

const AnalyticsDB = {
    dbName: 'PortfolioAnalytics',
    dbVersion: 1,
    storeName: 'visits',
    
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Créer l'object store pour les visites
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    
                    // Créer des index pour les requêtes
                    objectStore.createIndex('userId', 'userId', { unique: false });
                    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                    objectStore.createIndex('date', 'date', { unique: false });
                }
                
                // Créer l'object store pour les utilisateurs uniques
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', {
                        keyPath: 'userId',
                        autoIncrement: false
                    });
                    userStore.createIndex('lastVisit', 'lastVisit', { unique: false });
                }
            };
        });
    },
    
    async getUserId() {
        // Récupérer ou créer un ID utilisateur unique dans localStorage
        let userId = localStorage.getItem('portfolio_userId');
        if (!userId) {
            userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('portfolio_userId', userId);
        }
        return userId;
    },
    
    async recordVisit() {
        try {
            if (!this.db) {
                await this.init();
            }
            
            const userId = await this.getUserId();
            const timestamp = Date.now();
            const date = new Date(timestamp);
            const dateStr = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
            
            // Vérifier si l'utilisateur a déjà visité aujourd'hui
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('userId');
            const dateIndex = store.index('date');
            
            return new Promise((resolve, reject) => {
                // Vérifier les visites de cet utilisateur aujourd'hui
                const todayRequest = dateIndex.getAll(dateStr);
                todayRequest.onsuccess = () => {
                    const todayVisits = todayRequest.result || [];
                    const hasVisitedToday = todayVisits.some(visit => visit.userId === userId);
                    
                    if (!hasVisitedToday) {
                        // Enregistrer la nouvelle visite
                        const writeTransaction = this.db.transaction([this.storeName], 'readwrite');
                        const writeStore = writeTransaction.objectStore(this.storeName);
                        
                        const visitData = {
                            userId: userId,
                            timestamp: timestamp,
                            date: dateStr,
                            hour: date.getHours(),
                            day: date.getDay(),
                            month: date.getMonth() + 1,
                            year: date.getFullYear()
                        };
                        
                        const addRequest = writeStore.add(visitData);
                        addRequest.onsuccess = () => resolve(visitData);
                        addRequest.onerror = () => reject(addRequest.error);
                    } else {
                        resolve(null); // Déjà visité aujourd'hui
                    }
                };
                todayRequest.onerror = () => reject(todayRequest.error);
            });
        } catch (error) {
            console.error('Error recording visit:', error);
        }
    },
    
    async getAllVisits() {
        try {
            if (!this.db) {
                await this.init();
            }
            
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.getAll();
                
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Error getting visits:', error);
            return [];
        }
    },
    
    async getStats() {
        const visits = await this.getAllVisits();
        
        // Statistiques par période
        const stats = {
            total: visits.length,
            uniqueUsers: new Set(visits.map(v => v.userId)).size,
            byDate: {},
            byMonth: {},
            byYear: {},
            byDayOfWeek: {},
            byHour: {},
            last30Days: 0,
            last7Days: 0,
            today: 0
        };
        
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;
        const today = new Date().toISOString().split('T')[0];
        
        visits.forEach(visit => {
            // Par date
            stats.byDate[visit.date] = (stats.byDate[visit.date] || 0) + 1;
            
            // Par mois
            const monthKey = `${visit.year}-${String(visit.month).padStart(2, '0')}`;
            stats.byMonth[monthKey] = (stats.byMonth[monthKey] || 0) + 1;
            
            // Par année
            stats.byYear[visit.year] = (stats.byYear[visit.year] || 0) + 1;
            
            // Par jour de la semaine (0 = Dimanche, 6 = Samedi)
            const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
            const dayName = dayNames[visit.day];
            stats.byDayOfWeek[dayName] = (stats.byDayOfWeek[dayName] || 0) + 1;
            
            // Par heure
            stats.byHour[visit.hour] = (stats.byHour[visit.hour] || 0) + 1;
            
            // Derniers 30 jours
            if (now - visit.timestamp <= 30 * dayMs) {
                stats.last30Days++;
            }
            
            // Derniers 7 jours
            if (now - visit.timestamp <= 7 * dayMs) {
                stats.last7Days++;
            }
            
            // Aujourd'hui
            if (visit.date === today) {
                stats.today++;
            }
        });
        
        return stats;
    }
};

// Initialiser et enregistrer la visite au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    AnalyticsDB.recordVisit();
});
