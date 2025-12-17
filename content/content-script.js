// content/content-script.js
// Content Script para monitorear formularios web

class FormMonitor {
  constructor() {
    this.forms = new Set();
    this.observer = null;
    this.debounceTimer = null;
    this.processedFields = new Map(); // Para evitar procesar el mismo contenido múltiples veces
  }

  initialize() {
    console.log('[Sale Assistant] Content script iniciado en:', window.location.href);
    
    // Detectar formularios existentes
    this.detectForms();
    
    // Observar nuevos formularios (SPAs)
    this.setupMutationObserver();
    
    // Escuchar eventos de input
    this.setupEventListeners();
  }

  detectForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      this.forms.add(form);
      console.log('[Sale Assistant] Formulario detectado:', form.id || form.className || 'sin-id');
    });

    // También detectar campos fuera de formularios
    const standaloneInputs = document.querySelectorAll('input:not(form input), textarea:not(form textarea)');
    if (standaloneInputs.length > 0) {
      console.log('[Sale Assistant] Campos independientes detectados:', standaloneInputs.length);
    }
  }

  setupMutationObserver() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Buscar formularios en el nodo añadido
            if (node.tagName === 'FORM') {
              this.forms.add(node);
              console.log('[Sale Assistant] Nuevo formulario detectado dinámicamente');
            }
            const forms = node.querySelectorAll ? node.querySelectorAll('form') : [];
            forms.forEach(form => {
              this.forms.add(form);
              console.log('[Sale Assistant] Formulario dinámico agregado');
            });
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupEventListeners() {
    // Delegar eventos desde el body
    document.body.addEventListener('input', (e) => {
      if (this.isFormElement(e.target)) {
        this.handleInput(e.target);
      }
    }, true);

    // Monitorear cambios en textareas y inputs de texto
    document.body.addEventListener('change', (e) => {
      if (this.isFormElement(e.target)) {
        this.handleInput(e.target);
      }
    }, true);

    // Para elementos contenteditable
    document.body.addEventListener('keyup', (e) => {
      if (e.target.isContentEditable) {
        this.handleInput(e.target);
      }
    }, true);
  }

  isFormElement(element) {
    if (!element) return false;
    
    return (
      element.tagName === 'INPUT' ||
      element.tagName === 'TEXTAREA' ||
      element.tagName === 'SELECT' ||
      element.isContentEditable
    );
  }

  handleInput(element) {
    // Debounce para evitar múltiples análisis
    clearTimeout(this.debounceTimer);
    
    this.debounceTimer = setTimeout(() => {
      const formData = this.extractFormData(element);
      
      // Verificar si el contenido ya fue procesado
      const contentHash = this.hashContent(formData);
      if (this.processedFields.get(element) === contentHash) {
        return; // Contenido no ha cambiado
      }
      
      this.processedFields.set(element, contentHash);
      
      // Enviar al background para análisis
      chrome.runtime.sendMessage({
        type: 'FORM_DATA_DETECTED',
        data: formData
      }).catch(error => {
        console.error('[Sale Assistant] Error enviando mensaje:', error);
      });
    }, 500); // Esperar 500ms después del último cambio
  }

  extractFormData(element) {
    const form = element.closest('form') || document.body;
    const data = {
      url: window.location.href,
      pageTitle: document.title,
      timestamp: Date.now(),
      fields: []
    };

    // Extraer todos los campos del formulario
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      // IMPORTANTE: NO capturar campos password
      if (input.type !== 'password' && input.value && input.value.trim()) {
        data.fields.push({
          name: input.name || input.id || input.placeholder || 'unnamed',
          type: input.type || input.tagName.toLowerCase(),
          value: input.value,
          placeholder: input.placeholder || ''
        });
      }
    });

    // Extraer contenido editable
    const editables = form.querySelectorAll('[contenteditable="true"]');
    editables.forEach((editable, index) => {
      const text = (editable.textContent || editable.innerText || '').trim();
      if (text) {
        data.fields.push({
          name: `contenteditable_${index}`,
          type: 'contenteditable',
          value: text,
          placeholder: ''
        });
      }
    });

    return data;
  }

  hashContent(formData) {
    // Simple hash para detectar si el contenido cambió
    const content = formData.fields.map(f => f.value).join('|');
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    clearTimeout(this.debounceTimer);
    this.processedFields.clear();
  }
}

// Inicializar el monitor cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const monitor = new FormMonitor();
    monitor.initialize();
  });
} else {
  // DOM ya está listo
  const monitor = new FormMonitor();
  monitor.initialize();
}

