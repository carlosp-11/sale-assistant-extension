// actions/whatsapp-action.js
// Integración con WhatsApp Web

class WhatsAppAction {
  constructor(config) {
    this.numbers = config.whatsappNumbers || [];
    this.delay = config.actionDelay || 2;
  }

  async execute(message, options = {}) {
    if (this.numbers.length === 0) {
      throw new Error('No hay números de WhatsApp configurados');
    }

    const number = options.number || this.numbers[0];
    
    // Limpiar el número (solo dígitos y +)
    const cleanNumber = this.cleanPhoneNumber(number);
    
    // Validar número
    if (!this.isValidPhoneNumber(cleanNumber)) {
      throw new Error(`Número de teléfono inválido: ${number}`);
    }

    // Preparar mensaje
    const formattedMessage = this.formatMessage(message);
    const encodedMessage = encodeURIComponent(formattedMessage);

    // Construir URL
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // Esperar delay si está configurado
    if (this.delay > 0 && options.skipDelay !== true) {
      await this.sleep(this.delay * 1000);
    }

    // Abrir WhatsApp
    const tab = await chrome.tabs.create({
      url: whatsappUrl,
      active: options.active !== false
    });

    return {
      success: true,
      tabId: tab.id,
      number: cleanNumber,
      message: formattedMessage,
      timestamp: Date.now()
    };
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

  formatMessage(message) {
    // Agregar timestamp si no existe
    if (!message.includes('Fecha:')) {
      const timestamp = new Date().toLocaleString('es-ES');
      message = `${message}\n\nFecha: ${timestamp}`;
    }

    return message;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendToMultiple(message, numbers = null) {
    const targetNumbers = numbers || this.numbers;
    const results = [];

    for (const number of targetNumbers) {
      try {
        const result = await this.execute(message, { 
          number, 
          active: false,
          skipDelay: true 
        });
        results.push(result);
        
        // Esperar entre envíos para no saturar
        await this.sleep(1000);
      } catch (error) {
        results.push({
          success: false,
          number,
          error: error.message,
          timestamp: Date.now()
        });
      }
    }

    return results;
  }

  validateConfig() {
    const errors = [];

    if (this.numbers.length === 0) {
      errors.push('No hay números de WhatsApp configurados');
    }

    this.numbers.forEach((number, index) => {
      const clean = this.cleanPhoneNumber(number);
      if (!this.isValidPhoneNumber(clean)) {
        errors.push(`Número ${index + 1} inválido: ${number}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  updateConfig(newConfig) {
    if (newConfig.whatsappNumbers) {
      this.numbers = newConfig.whatsappNumbers;
    }
    if (newConfig.actionDelay !== undefined) {
      this.delay = newConfig.actionDelay;
    }
  }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WhatsAppAction;
}

