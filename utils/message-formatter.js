// utils/message-formatter.js
// Formateador de mensajes para WhatsApp y Email

class MessageFormatter {
  constructor() {
    this.maxFieldLength = 200;
  }

  formatForWhatsApp(matches, formData, tab) {
    const keywords = matches.map(m => m.keyword).join(', ');
    
    let message = `🔔 *Alerta de Sale Assistant*\n\n`;
    message += `📄 *Página:* ${this.truncate(tab.title, 100)}\n`;
    message += `🔗 *URL:* ${this.truncate(formData.url, 100)}\n`;
    message += `🎯 *Palabras clave:* ${keywords}\n`;
    message += `📅 *Fecha:* ${new Date().toLocaleString('es-ES')}\n\n`;
    message += `📝 *Contenido del formulario:*\n`;
    
    formData.fields.forEach((field, index) => {
      if (index < 5) { // Limitar a 5 campos
        const value = this.truncate(field.value, this.maxFieldLength);
        message += `• *${field.name}:* ${value}\n`;
      }
    });

    if (formData.fields.length > 5) {
      message += `\n_... y ${formData.fields.length - 5} campos más_`;
    }

    return message;
  }

  formatForEmail(matches, formData, tab) {
    const keywords = matches.map(m => m.keyword).join(', ');
    
    let message = `Alerta de Sale Assistant\n`;
    message += `${'='.repeat(50)}\n\n`;
    message += `Página: ${tab.title}\n`;
    message += `URL: ${formData.url}\n`;
    message += `Palabras clave detectadas: ${keywords}\n`;
    message += `Fecha y hora: ${new Date().toLocaleString('es-ES')}\n\n`;
    message += `Contenido del formulario:\n`;
    message += `${'-'.repeat(50)}\n\n`;
    
    formData.fields.forEach(field => {
      const value = this.truncate(field.value, this.maxFieldLength);
      message += `${field.name}:\n${value}\n\n`;
    });

    message += `${'-'.repeat(50)}\n`;
    message += `Prioridad de las palabras clave:\n`;
    matches.forEach(match => {
      message += `• ${match.keyword} (${match.priority}): ${match.count} ocurrencia(s)\n`;
    });

    return message;
  }

  formatForNotification(matches, tab) {
    const keywordList = matches.map(m => m.keyword).join(', ');
    return {
      title: '🔔 Sale Assistant - Palabra Clave Detectada',
      message: `Encontrado en "${this.truncate(tab.title, 50)}": ${keywordList}`
    };
  }

  truncate(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  sanitize(text) {
    // Remover caracteres peligrosos
    return text
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  }

  createSummary(formData) {
    const totalFields = formData.fields.length;
    const totalChars = formData.fields.reduce((sum, field) => sum + field.value.length, 0);
    
    return {
      totalFields,
      totalChars,
      avgCharsPerField: Math.round(totalChars / totalFields)
    };
  }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MessageFormatter;
}

