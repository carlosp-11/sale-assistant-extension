// utils/storage-helper.js
// Ayudante para operaciones de almacenamiento

class StorageHelper {
  constructor() {
    this.syncStorage = chrome.storage.sync;
    this.localStorage = chrome.storage.local;
  }

  // Configuración (sincronizada entre dispositivos)
  async getConfig() {
    return await this.syncStorage.get([
      'keywords',
      'whatsappNumbers',
      'emailAddresses',
      'isActive',
      'notificationsEnabled',
      'activationMode',
      'actionDelay',
      'enableSound'
    ]);
  }

  async setConfig(config) {
    return await this.syncStorage.set(config);
  }

  async updateConfig(updates) {
    const current = await this.getConfig();
    const merged = { ...current, ...updates };
    return await this.setConfig(merged);
  }

  // Estadísticas (local, no sincronizado)
  async getStats(date = null) {
    const targetDate = date || new Date().toDateString();
    const data = await this.localStorage.get(['stats']);
    return data.stats?.[targetDate] || {
      formsDetected: 0,
      keywordsFound: 0,
      actionsExecuted: 0
    };
  }

  async updateStats(updates) {
    const today = new Date().toDateString();
    const data = await this.localStorage.get(['stats']);
    const allStats = data.stats || {};
    
    allStats[today] = {
      ...(allStats[today] || { formsDetected: 0, keywordsFound: 0, actionsExecuted: 0 }),
      ...updates
    };
    
    return await this.localStorage.set({ stats: allStats });
  }

  async incrementStat(statName, amount = 1) {
    const today = new Date().toDateString();
    const data = await this.localStorage.get(['stats']);
    const allStats = data.stats || {};
    const todayStats = allStats[today] || { formsDetected: 0, keywordsFound: 0, actionsExecuted: 0 };
    
    todayStats[statName] = (todayStats[statName] || 0) + amount;
    allStats[today] = todayStats;
    
    return await this.localStorage.set({ stats: allStats });
  }

  // Actividad reciente
  async getRecentActivity(limit = 50) {
    const data = await this.localStorage.get(['recentActivity']);
    const activities = data.recentActivity || [];
    return activities.slice(0, limit);
  }

  async addActivity(activity) {
    const data = await this.localStorage.get(['recentActivity']);
    const activities = data.recentActivity || [];
    
    activities.unshift({
      ...activity,
      timestamp: Date.now()
    });
    
    // Mantener solo las últimas 100
    const trimmed = activities.slice(0, 100);
    
    return await this.localStorage.set({ recentActivity: trimmed });
  }

  async clearActivity() {
    return await this.localStorage.set({ recentActivity: [] });
  }

  // Limpieza
  async clearOldStats(daysToKeep = 30) {
    const data = await this.localStorage.get(['stats']);
    if (!data.stats) return;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const cleanedStats = {};
    for (const [dateStr, stats] of Object.entries(data.stats)) {
      const statDate = new Date(dateStr);
      if (statDate >= cutoffDate) {
        cleanedStats[dateStr] = stats;
      }
    }
    
    return await this.localStorage.set({ stats: cleanedStats });
  }

  async clearAll() {
    await this.localStorage.clear();
    await this.syncStorage.clear();
  }

  // Exportar/Importar configuración
  async exportConfig() {
    const config = await this.getConfig();
    const stats = await this.localStorage.get(['stats', 'recentActivity']);
    
    return {
      config,
      stats: stats.stats,
      recentActivity: stats.recentActivity,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  async importConfig(data) {
    if (!data.version) {
      throw new Error('Formato de exportación inválido');
    }
    
    if (data.config) {
      await this.setConfig(data.config);
    }
    
    if (data.stats) {
      await this.localStorage.set({ stats: data.stats });
    }
    
    if (data.recentActivity) {
      await this.localStorage.set({ recentActivity: data.recentActivity });
    }
    
    return true;
  }

  // Utilidades
  async getStorageUsage() {
    const syncBytes = await this.syncStorage.getBytesInUse();
    const localBytes = await this.localStorage.getBytesInUse();
    
    return {
      sync: {
        bytes: syncBytes,
        kb: Math.round(syncBytes / 1024 * 100) / 100,
        quota: chrome.storage.sync.QUOTA_BYTES,
        percentUsed: Math.round((syncBytes / chrome.storage.sync.QUOTA_BYTES) * 100)
      },
      local: {
        bytes: localBytes,
        kb: Math.round(localBytes / 1024 * 100) / 100,
        quota: chrome.storage.local.QUOTA_BYTES,
        percentUsed: Math.round((localBytes / chrome.storage.local.QUOTA_BYTES) * 100)
      }
    };
  }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageHelper;
}

