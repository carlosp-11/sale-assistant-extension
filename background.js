// background.js
// Service Worker - Motor central del Sale Assistant

class SaleAssistant {
  constructor() {
    this.config = null;
    this.isActive = true;
    this.stats = {
      formsDetected: 0,
      keywordsFound: 0,
      actionsExecuted: 0
    };
    this.recentActivity = [];
    this.initialize();
  }

  async initialize() {
    console.log('[Sale Assistant] Background worker iniciado');
    
    // Cargar configuración
    await this.loadConfig();
    
    // Configurar listeners
    this.setupMessageListeners();
    
    // Configurar alarmas
    this.setupAlarms();
    
    // Cargar estadísticas
    await this.loadStats();
  }

  async loadConfig() {
    const data = await chrome.storage.sync.get([
      'keywords',
      'whatsappNumbers',
      'emailAddresses',
      'isActive',
      'notificationsEnabled',
      'activationMode',
      'actionDelay',
      'enableSound'
    ]);

    this.config = {
      keywords: data.keywords || [
        { text: 'urgente', actions: ['whatsapp', 'email'], priority: 'high' },
        { text: 'cotización', actions: ['email'], priority: 'medium' },
        { text: 'comprar', actions: ['whatsapp'], priority: 'high' },
        { text: 'precio', actions: ['whatsapp'], priority: 'medium' },
        { text: 'presupuesto', actions: ['email'], priority: 'medium' }
      ],
      whatsappNumbers: data.whatsappNumbers || [],
      emailAddresses: data.emailAddresses || [],
      isActive: data.isActive !== false,
      notificationsEnabled: data.notificationsEnabled !== false,
      activationMode: data.activationMode || 'auto',
      actionDelay: data.actionDelay || 2,
      enableSound: data.enableSound !== false
    };

    this.isActive = this.config.isActive;
    console.log('[Sale Assistant] Configuración cargada:', this.config);
  }

  async loadStats() {
    const data = await chrome.storage.local.get(['stats', 'recentActivity']);
    const today = new Date().toDateString();
    
    if (data.stats && data.stats[today]) {
      this.stats = data.stats[today];
    }
    
    this.recentActivity = data.recentActivity || [];
  }

  async saveStats() {
    const today = new Date().toDateString();
    const data = await chrome.storage.local.get(['stats']);
    const allStats = data.stats || {};
    allStats[today] = this.stats;
    
    await chrome.storage.local.set({ 
      stats: allStats,
      recentActivity: this.recentActivity.slice(0, 50) // Mantener solo las últimas 50
    });
  }

  setupMessageListeners() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'FORM_DATA_DETECTED') {
        this.handleFormData(message.data, sender.tab).then(result => {
          sendResponse({ success: true, result });
        }).catch(error => {
          sendResponse({ success: false, error: error.message });
        });
        return true; // Mantener el canal abierto para respuesta asíncrona
      } else if (message.type === 'GET_STATUS') {
        sendResponse({ 
          isActive: this.isActive, 
          config: this.config,
          stats: this.stats
        });
      } else if (message.type === 'UPDATE_CONFIG') {
        this.updateConfig(message.config).then(() => {
          sendResponse({ success: true });
        });
        return true;
      } else if (message.type === 'GET_STATS') {
        sendResponse({ stats: this.stats });
      } else if (message.type === 'GET_ACTIVITY') {
        sendResponse({ activity: this.recentActivity });
      }
      return false;
    });
  }

  setupAlarms() {
    // Sincronizar configuración cada hora
    chrome.alarms.create('syncConfig', { periodInMinutes: 60 });
    
    // Limpiar estadísticas antiguas diariamente
    chrome.alarms.create('cleanOldStats', { periodInMinutes: 1440 }); // 24 horas
    
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'syncConfig') {
        this.loadConfig();
      } else if (alarm.name === 'cleanOldStats') {
        this.cleanOldStats();
      }
    });
  }

  async cleanOldStats() {
    const data = await chrome.storage.local.get(['stats']);
    if (!data.stats) return;
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const cleanedStats = {};
    for (const [date, stats] of Object.entries(data.stats)) {
      const statDate = new Date(date);
      if (statDate > thirtyDaysAgo) {
        cleanedStats[date] = stats;
      }
    }
    
    await chrome.storage.local.set({ stats: cleanedStats });
    console.log('[Sale Assistant] Estadísticas antiguas limpiadas');
  }

  async handleFormData(formData, tab) {
    if (!this.isActive) {
      console.log('[Sale Assistant] Desactivado, ignorando datos');
      return { processed: false, reason: 'inactive' };
    }

    console.log('[Sale Assistant] Analizando datos de formulario:', formData);

    // Actualizar estadísticas
    this.stats.formsDetected++;

    // Combinar todo el texto de los campos
    const allText = formData.fields
      .map(field => field.value)
      .join(' ')
      .toLowerCase();

    // Buscar palabras clave
    const matches = this.findKeywordMatches(allText);

    if (matches.length > 0) {
      console.log('[Sale Assistant] Palabras clave encontradas:', matches);
      
      // Actualizar estadísticas
      this.stats.keywordsFound += matches.length;
      
      // Agregar a actividad reciente
      matches.forEach(match => {
        this.recentActivity.unshift({
          keyword: match.keyword,
          timestamp: Date.now(),
          pageTitle: formData.pageTitle || 'Sin título',
          url: formData.url
        });
      });
      
      await this.saveStats();
      
      // Notificar al usuario
      if (this.config.notificationsEnabled) {
        await this.showNotification(matches, tab);
      }

      // Ejecutar acciones según el modo
      if (this.config.activationMode === 'auto') {
        await this.executeActions(matches, formData, tab);
      } else if (this.config.activationMode === 'confirm') {
        // Mostrar notificación con botones de acción
        await this.showActionConfirmation(matches, formData, tab);
      }
      // Si es 'manual', solo notificamos (ya hecho arriba)

      return { processed: true, matches: matches.length };
    }

    return { processed: true, matches: 0 };
  }

  findKeywordMatches(text) {
    const matches = [];

    this.config.keywords.forEach(keyword => {
      // Crear patrón que acepta variaciones con/sin acentos
      const pattern = this.createFlexiblePattern(keyword.text);
      const regex = new RegExp(pattern, 'gi');
      const found = text.match(regex);
      
      if (found) {
        matches.push({
          keyword: keyword.text,
          count: found.length,
          actions: keyword.actions,
          priority: keyword.priority
        });
      }
    });

    // Ordenar por prioridad
    return matches.sort((a, b) => {
      const priorities = { high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });
  }

  createFlexiblePattern(keyword) {
    // Escapar caracteres especiales de regex
    let escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Permitir variaciones (ej: "cotizacion" también encuentra "cotización")
    escaped = escaped
      .replace(/a/gi, '[aá]')
      .replace(/e/gi, '[eé]')
      .replace(/i/gi, '[ií]')
      .replace(/o/gi, '[oó]')
      .replace(/u/gi, '[uú]')
      .replace(/n/gi, '[nñ]');
    
    // Buscar la palabra completa
    return `\\b${escaped}\\b`;
  }

  async showNotification(matches, tab) {
    const keywordList = matches.map(m => m.keyword).join(', ');
    
    try {
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: '🔔 Sale Assistant - Palabra Clave Detectada',
        message: `Encontrado en "${tab.title}": ${keywordList}`,
        priority: 2,
        requireInteraction: false
      });
    } catch (error) {
      console.error('[Sale Assistant] Error mostrando notificación:', error);
    }
  }

  async showActionConfirmation(matches, formData, tab) {
    const keywordList = matches.map(m => m.keyword).join(', ');
    
    try {
      const notificationId = await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: '🔔 Confirmar Acción',
        message: `¿Ejecutar acciones para: ${keywordList}?`,
        buttons: [
          { title: '✓ Sí, ejecutar' },
          { title: '✗ No, cancelar' }
        ],
        priority: 2,
        requireInteraction: true
      });

      // Guardar contexto para cuando se haga clic
      this.pendingActions = this.pendingActions || {};
      this.pendingActions[notificationId] = { matches, formData, tab };
    } catch (error) {
      console.error('[Sale Assistant] Error mostrando confirmación:', error);
    }
  }

  async executeActions(matches, formData, tab) {
    // Recopilar todas las acciones únicas
    const actions = new Set();
    matches.forEach(match => {
      match.actions.forEach(action => actions.add(action));
    });

    // Preparar el mensaje
    const message = this.formatMessage(matches, formData, tab);

    // Esperar el delay configurado
    if (this.config.actionDelay > 0) {
      await this.sleep(this.config.actionDelay * 1000);
    }

    // Ejecutar cada acción
    for (const action of actions) {
      try {
        if (action === 'whatsapp') {
          await this.sendWhatsApp(message);
          this.stats.actionsExecuted++;
        } else if (action === 'email') {
          await this.sendEmail(message, formData);
          this.stats.actionsExecuted++;
        }
      } catch (error) {
        console.error(`[Sale Assistant] Error ejecutando acción ${action}:`, error);
      }
    }

    await this.saveStats();
  }

  formatMessage(matches, formData, tab) {
    const keywords = matches.map(m => m.keyword).join(', ');
    
    let message = `🔔 Alerta de Sale Assistant\n\n`;
    message += `Página: ${tab.title}\n`;
    message += `URL: ${formData.url}\n`;
    message += `Palabras clave: ${keywords}\n`;
    message += `Fecha: ${new Date().toLocaleString('es-ES')}\n\n`;
    message += `Contenido del formulario:\n`;
    
    formData.fields.forEach(field => {
      if (field.value.length < 200) {
        message += `• ${field.name}: ${field.value}\n`;
      } else {
        message += `• ${field.name}: ${field.value.substring(0, 200)}...\n`;
      }
    });

    return message;
  }

  async sendWhatsApp(message) {
    if (this.config.whatsappNumbers.length === 0) {
      console.warn('[Sale Assistant] No hay números de WhatsApp configurados');
      throw new Error('No hay números de WhatsApp configurados');
    }

    // Tomar el primer número configurado
    const number = this.cleanPhoneNumber(this.config.whatsappNumbers[0]);
    
    // Validar número
    if (!this.isValidPhoneNumber(number)) {
      throw new Error(`Número de teléfono inválido: ${number}`);
    }
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${number}?text=${encodedMessage}`;
    
    // Abrir en nueva pestaña
    await chrome.tabs.create({
      url: whatsappUrl,
      active: false // No cambiar el foco
    });

    console.log('[Sale Assistant] WhatsApp abierto con mensaje');
  }

  async sendEmail(message, formData) {
    if (this.config.emailAddresses.length === 0) {
      console.warn('[Sale Assistant] No hay direcciones de email configuradas');
      throw new Error('No hay direcciones de email configuradas');
    }

    const to = this.config.emailAddresses.join(',');
    const subject = encodeURIComponent(`Alerta Sale Assistant - ${new Date().toLocaleString('es-ES')}`);
    const body = encodeURIComponent(message);

    const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;

    await chrome.tabs.create({
      url: mailtoUrl,
      active: false
    });

    console.log('[Sale Assistant] Cliente de email abierto');
  }

  cleanPhoneNumber(number) {
    // Remover todos los caracteres no numéricos excepto el +
    return number.replace(/[^\d+]/g, '');
  }

  isValidPhoneNumber(number) {
    // Debe tener al menos 10 dígitos y puede empezar con +
    const regex = /^\+?\d{10,15}$/;
    return regex.test(number);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.isActive !== undefined) {
      this.isActive = newConfig.isActive;
    }
    await chrome.storage.sync.set(newConfig);
    console.log('[Sale Assistant] Configuración actualizada:', newConfig);
  }
}

// Inicializar el asistente
const assistant = new SaleAssistant();

// Manejar clicks en notificaciones con botones
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (assistant.pendingActions && assistant.pendingActions[notificationId]) {
    const { matches, formData, tab } = assistant.pendingActions[notificationId];
    
    if (buttonIndex === 0) {
      // Usuario confirmó - ejecutar acciones
      assistant.executeActions(matches, formData, tab);
    }
    
    // Limpiar acción pendiente
    delete assistant.pendingActions[notificationId];
    chrome.notifications.clear(notificationId);
  }
});

