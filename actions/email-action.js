// actions/email-action.js
// Integración con cliente de Email

class EmailAction {
  constructor(config) {
    this.addresses = config.emailAddresses || [];
    this.delay = config.actionDelay || 2;
  }

  async execute(message, formData, options = {}) {
    if (this.addresses.length === 0) {
      throw new Error('No hay direcciones de email configuradas');
    }

    // Preparar destinatarios
    const to = options.to || this.addresses.join(',');
    
    // Validar emails
    const emails = to.split(',');
    for (const email of emails) {
      if (!this.isValidEmail(email.trim())) {
        throw new Error(`Email inválido: ${email}`);
      }
    }

    // Preparar asunto
    const subject = options.subject || this.generateSubject(formData);
    const encodedSubject = encodeURIComponent(subject);

    // Preparar cuerpo
    const body = options.body || this.formatBody(message, formData);
    const encodedBody = encodeURIComponent(body);

    // Construir URL mailto
    const mailtoUrl = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;

    // Verificar límite de URL (mailto tiene límites)
    if (mailtoUrl.length > 2000) {
      console.warn('[EmailAction] URL muy larga, el contenido puede ser truncado');
    }

    // Esperar delay si está configurado
    if (this.delay > 0 && options.skipDelay !== true) {
      await this.sleep(this.delay * 1000);
    }

    // Abrir cliente de email
    const tab = await chrome.tabs.create({
      url: mailtoUrl,
      active: options.active !== false
    });

    return {
      success: true,
      tabId: tab.id,
      to: to,
      subject: subject,
      timestamp: Date.now()
    };
  }

  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  generateSubject(formData) {
    const date = new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `Alerta Sale Assistant - ${date}`;
  }

  formatBody(message, formData) {
    let body = message;
    
    // Agregar separador visual
    body += '\n\n' + '='.repeat(50) + '\n';
    body += 'Este mensaje fue generado automáticamente por Sale Assistant\n';
    body += '='.repeat(50);

    return body;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendToMultiple(message, formData, addresses = null) {
    const targetAddresses = addresses || this.addresses;
    const results = [];

    for (const address of targetAddresses) {
      try {
        const result = await this.execute(message, formData, { 
          to: address,
          active: false,
          skipDelay: true 
        });
        results.push(result);
        
        // Esperar entre envíos
        await this.sleep(1000);
      } catch (error) {
        results.push({
          success: false,
          to: address,
          error: error.message,
          timestamp: Date.now()
        });
      }
    }

    return results;
  }

  validateConfig() {
    const errors = [];

    if (this.addresses.length === 0) {
      errors.push('No hay direcciones de email configuradas');
    }

    this.addresses.forEach((email, index) => {
      if (!this.isValidEmail(email)) {
        errors.push(`Email ${index + 1} inválido: ${email}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  updateConfig(newConfig) {
    if (newConfig.emailAddresses) {
      this.addresses = newConfig.emailAddresses;
    }
    if (newConfig.actionDelay !== undefined) {
      this.delay = newConfig.actionDelay;
    }
  }

  // Alternativa: usar Gmail Web API (requiere más configuración)
  async sendViaGmailWeb(message, formData) {
    const gmailComposeUrl = 'https://mail.google.com/mail/?view=cm&fs=1' +
      `&to=${encodeURIComponent(this.addresses.join(','))}` +
      `&su=${encodeURIComponent(this.generateSubject(formData))}` +
      `&body=${encodeURIComponent(message)}`;

    const tab = await chrome.tabs.create({
      url: gmailComposeUrl,
      active: false
    });

    return {
      success: true,
      tabId: tab.id,
      method: 'gmail-web',
      timestamp: Date.now()
    };
  }

  // Alternativa: usar Outlook Web
  async sendViaOutlookWeb(message, formData) {
    const outlookUrl = 'https://outlook.live.com/mail/0/deeplink/compose?' +
      `to=${encodeURIComponent(this.addresses.join(','))}` +
      `&subject=${encodeURIComponent(this.generateSubject(formData))}` +
      `&body=${encodeURIComponent(message)}`;

    const tab = await chrome.tabs.create({
      url: outlookUrl,
      active: false
    });

    return {
      success: true,
      tabId: tab.id,
      method: 'outlook-web',
      timestamp: Date.now()
    };
  }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmailAction;
}

