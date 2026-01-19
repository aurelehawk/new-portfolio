// ============================================================================
// ADMIN DASHBOARD - Statistics Display
// ============================================================================

const AdminDashboard = {
    async init() {
        await AnalyticsDB.init();
        await this.renderStats();
        
        // Auto-refresh toutes les minutes
        setInterval(() => {
            this.renderStats();
        }, 60000);
    },
    
    async renderStats() {
        const container = document.getElementById('stats-container');
        const stats = await AnalyticsDB.getStats();
        
        if (stats.total === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-chart-bar" style="font-size: 3rem; color: var(--text-tertiary); margin-bottom: var(--space-md);"></i>
                    <h2>Aucune donnée disponible</h2>
                    <p>Les statistiques apparaîtront après les premières visites.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total des Visites</h3>
                    <div class="stat-value">${stats.total}</div>
                </div>
                <div class="stat-card">
                    <h3>Utilisateurs Uniques</h3>
                    <div class="stat-value">${stats.uniqueUsers}</div>
                </div>
                <div class="stat-card">
                    <h3>Aujourd'hui</h3>
                    <div class="stat-value">${stats.today}</div>
                </div>
                <div class="stat-card">
                    <h3>7 Derniers Jours</h3>
                    <div class="stat-value">${stats.last7Days}</div>
                </div>
                <div class="stat-card">
                    <h3>30 Derniers Jours</h3>
                    <div class="stat-value">${stats.last30Days}</div>
                </div>
            </div>
            
            <div class="charts-section">
                ${this.renderChart('Visites par Date', stats.byDate, 'date')}
                ${this.renderChart('Visites par Mois', stats.byMonth, 'month')}
                ${this.renderChart('Visites par Jour de la Semaine', stats.byDayOfWeek, 'day')}
                ${this.renderChart('Visites par Heure', stats.byHour, 'hour')}
            </div>
            
            <div style="text-align: center;">
                <button class="refresh-btn" onclick="AdminDashboard.renderStats()">
                    <i class="fas fa-sync-alt"></i> Actualiser
                </button>
            </div>
        `;
    },
    
    renderChart(title, data, type) {
        if (!data || Object.keys(data).length === 0) {
            return `
                <div class="chart-card">
                    <h2>${title}</h2>
                    <div class="no-data">Aucune donnée</div>
                </div>
            `;
        }
        
        const entries = Object.entries(data);
        const maxValue = Math.max(...entries.map(([_, value]) => value));
        
        // Trier selon le type
        let sortedEntries = entries;
        if (type === 'date') {
            sortedEntries = entries.sort(([a], [b]) => a.localeCompare(b));
        } else if (type === 'month') {
            sortedEntries = entries.sort(([a], [b]) => a.localeCompare(b));
        } else if (type === 'hour') {
            sortedEntries = entries.sort(([a], [b]) => parseInt(a) - parseInt(b));
        } else {
            const dayOrder = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
            sortedEntries = entries.sort(([a], [b]) => {
                const indexA = dayOrder.indexOf(a);
                const indexB = dayOrder.indexOf(b);
                return indexA - indexB;
            });
        }
        
        return `
            <div class="chart-card">
                <h2>${title}</h2>
                ${sortedEntries.map(([label, value]) => {
                    const percentage = (value / maxValue) * 100;
                    return `
                        <div class="chart-item">
                            <div style="flex: 1;">
                                <div class="chart-label">${label}</div>
                                <div class="chart-bar" style="width: ${percentage}%;"></div>
                            </div>
                            <div style="font-weight: var(--font-weight-bold); color: var(--primary); margin-left: var(--space-md);">
                                ${value}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
};

// Initialiser le dashboard au chargement
document.addEventListener('DOMContentLoaded', () => {
    AdminDashboard.init();
});
