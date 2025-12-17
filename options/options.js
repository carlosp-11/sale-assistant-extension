// options.js

document.addEventListener('DOMContentLoaded', async () => {
  // Elementos del DOM
  const keywordList = document.getElementById('keywordList');
  const newKeyword = document.getElementById('newKeyword');
  const keywordPriority = document.getElementById('keywordPriority');
  const actionWhatsApp = document.getElementById('actionWhatsApp');
  const actionEmail = document.getElementById('actionEmail');
  const addKeywordBtn = document.getElementById('addKeyword');
  
  const whatsappList = document.getElementById('whatsappList');
  const newWhatsapp = document.getElementById('newWhatsapp');
  const whatsappName = document.getElementById('whatsappName');
  const addWhatsappBtn = document.getElementById('addWhatsapp');
  
  const emailList = document.getElementById('emailList');
  const newEmail = document.getElementById('newEmail');
  const emailName = document.getElementById('emailName');
  const addEmailBtn = document.getElementById('addEmail');
  
  const enableNotifications = document.getElementById('enableNotifications');
  const enableSound = document.getElementById('enableSound');
  const activationMode = document.getElementById('activationMode');
  const actionDelay = document.getElementById('actionDelay');
  
  const saveConfigBtn = document.getElementById('saveConfig');
  const resetConfigBtn = document.getElementById('resetConfig');

  // Cargar configuración inicial
  await loadConfig();

  // Event Listeners
  addKeywordBtn.addEventListener('click', addKeyword);
  addWhatsappBtn.addEventListener('click', addWhatsappNumber);
  addEmailBtn.addEventListener('click', addEmailAddress);
  saveConfigBtn.addEventListener('click', saveConfig);
  resetConfigBtn.addEventListener('click', resetConfig);

  // Enter key para agregar items
  newKeyword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addKeyword();
  });
  newWhatsapp.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addWhatsappNumber();
  });
  newEmail.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addEmailAddress();
  });

  // Funciones
  async function loadConfig() {
    try {
      const data = await chrome.storage.sync.get([
        'keywords',
        'whatsappNumbers',
        'emailAddresses',
        'notificationsEnabled',
        'enableSound',
        'activationMode',
        'actionDelay'
      ]);

      // Cargar keywords
      if (data.keywords && data.keywords.length > 0) {
        renderKeywords(data.keywords);
      } else {
        keywordList.innerHTML = '<div class="empty-state">No hay palabras clave configuradas</div>';
      }

      // Cargar números de WhatsApp
      if (data.whatsappNumbers && data.whatsappNumbers.length > 0) {
        renderWhatsAppNumbers(data.whatsappNumbers);
      } else {
        whatsappList.innerHTML = '<div class="empty-state">No hay números configurados</div>';
      }

      // Cargar emails
      if (data.emailAddresses && data.emailAddresses.length > 0) {
        renderEmails(data.emailAddresses);
      } else {
        emailList.innerHTML = '<div class="empty-state">No hay emails configurados</div>';
      }

      // Cargar preferencias
      enableNotifications.checked = data.notificationsEnabled !== false;
      enableSound.checked = data.enableSound !== false;
      activationMode.value = data.activationMode || 'auto';
      actionDelay.value = data.actionDelay || 2;

    } catch (error) {
      console.error('Error cargando configuración:', error);
      showNotification('Error cargando configuración', 'error');
    }
  }

  function renderKeywords(keywords) {
    if (keywords.length === 0) {
      keywordList.innerHTML = '<div class="empty-state">No hay palabras clave configuradas</div>';
      return;
    }

    keywordList.innerHTML = keywords.map((kw, index) => `
      <div class="keyword-item">
        <div class="keyword-info">
          <span class="keyword-text">${kw.text}</span>
          <span class="priority-badge priority-${kw.priority}">
            ${kw.priority === 'high' ? 'Alta' : kw.priority === 'medium' ? 'Media' : 'Baja'}
          </span>
          <div class="keyword-actions">
            Acciones: ${kw.actions.join(', ')}
          </div>
        </div>
        <button class="btn-remove" data-index="${index}">Eliminar</button>
      </div>
    `).join('');

    // Agregar event listeners a botones de eliminar
    keywordList.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => removeKeyword(parseInt(btn.dataset.index)));
    });
  }

  function renderWhatsAppNumbers(numbers) {
    if (numbers.length === 0) {
      whatsappList.innerHTML = '<div class="empty-state">No hay números configurados</div>';
      return;
    }

    whatsappList.innerHTML = numbers.map((num, index) => `
      <div class="contact-item">
        <div class="contact-info">
          <div class="contact-value">${num}</div>
        </div>
        <button class="btn-remove" data-index="${index}">Eliminar</button>
      </div>
    `).join('');

    whatsappList.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => removeWhatsAppNumber(parseInt(btn.dataset.index)));
    });
  }

  function renderEmails(emails) {
    if (emails.length === 0) {
      emailList.innerHTML = '<div class="empty-state">No hay emails configurados</div>';
      return;
    }

    emailList.innerHTML = emails.map((email, index) => `
      <div class="contact-item">
        <div class="contact-info">
          <div class="contact-value">${email}</div>
        </div>
        <button class="btn-remove" data-index="${index}">Eliminar</button>
      </div>
    `).join('');

    emailList.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => removeEmail(parseInt(btn.dataset.index)));
    });
  }

  async function addKeyword() {
    const keyword = newKeyword.value.trim();
    if (!keyword) {
      showNotification('Por favor ingresa una palabra clave', 'error');
      return;
    }

    const actions = [];
    if (actionWhatsApp.checked) actions.push('whatsapp');
    if (actionEmail.checked) actions.push('email');

    if (actions.length === 0) {
      showNotification('Selecciona al menos una acción', 'error');
      return;
    }

    try {
      const data = await chrome.storage.sync.get(['keywords']);
      const keywords = data.keywords || [];
      
      // Verificar si ya existe
      if (keywords.some(kw => kw.text.toLowerCase() === keyword.toLowerCase())) {
        showNotification('Esta palabra clave ya existe', 'error');
        return;
      }

      keywords.push({
        text: keyword,
        actions: actions,
        priority: keywordPriority.value
      });

      await chrome.storage.sync.set({ keywords });
      renderKeywords(keywords);
      
      // Limpiar campos
      newKeyword.value = '';
      showNotification('Palabra clave agregada', 'success');
    } catch (error) {
      console.error('Error agregando keyword:', error);
      showNotification('Error agregando palabra clave', 'error');
    }
  }

  async function removeKeyword(index) {
    try {
      const data = await chrome.storage.sync.get(['keywords']);
      const keywords = data.keywords || [];
      keywords.splice(index, 1);
      await chrome.storage.sync.set({ keywords });
      renderKeywords(keywords);
      showNotification('Palabra clave eliminada', 'success');
    } catch (error) {
      console.error('Error eliminando keyword:', error);
      showNotification('Error eliminando palabra clave', 'error');
    }
  }

  async function addWhatsAppNumber() {
    const number = newWhatsapp.value.trim();
    if (!number) {
      showNotification('Por favor ingresa un número', 'error');
      return;
    }

    // Validar formato básico
    if (!number.match(/^\+?\d{10,15}$/)) {
      showNotification('Formato inválido. Usa: +5491112345678', 'error');
      return;
    }

    try {
      const data = await chrome.storage.sync.get(['whatsappNumbers']);
      const numbers = data.whatsappNumbers || [];
      
      if (numbers.includes(number)) {
        showNotification('Este número ya existe', 'error');
        return;
      }

      numbers.push(number);
      await chrome.storage.sync.set({ whatsappNumbers: numbers });
      renderWhatsAppNumbers(numbers);
      
      newWhatsapp.value = '';
      whatsappName.value = '';
      showNotification('Número agregado', 'success');
    } catch (error) {
      console.error('Error agregando número:', error);
      showNotification('Error agregando número', 'error');
    }
  }

  async function removeWhatsAppNumber(index) {
    try {
      const data = await chrome.storage.sync.get(['whatsappNumbers']);
      const numbers = data.whatsappNumbers || [];
      numbers.splice(index, 1);
      await chrome.storage.sync.set({ whatsappNumbers: numbers });
      renderWhatsAppNumbers(numbers);
      showNotification('Número eliminado', 'success');
    } catch (error) {
      console.error('Error eliminando número:', error);
      showNotification('Error eliminando número', 'error');
    }
  }

  async function addEmailAddress() {
    const email = newEmail.value.trim();
    if (!email) {
      showNotification('Por favor ingresa un email', 'error');
      return;
    }

    // Validar formato de email
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showNotification('Formato de email inválido', 'error');
      return;
    }

    try {
      const data = await chrome.storage.sync.get(['emailAddresses']);
      const emails = data.emailAddresses || [];
      
      if (emails.includes(email)) {
        showNotification('Este email ya existe', 'error');
        return;
      }

      emails.push(email);
      await chrome.storage.sync.set({ emailAddresses: emails });
      renderEmails(emails);
      
      newEmail.value = '';
      emailName.value = '';
      showNotification('Email agregado', 'success');
    } catch (error) {
      console.error('Error agregando email:', error);
      showNotification('Error agregando email', 'error');
    }
  }

  async function removeEmail(index) {
    try {
      const data = await chrome.storage.sync.get(['emailAddresses']);
      const emails = data.emailAddresses || [];
      emails.splice(index, 1);
      await chrome.storage.sync.set({ emailAddresses: emails });
      renderEmails(emails);
      showNotification('Email eliminado', 'success');
    } catch (error) {
      console.error('Error eliminando email:', error);
      showNotification('Error eliminando email', 'error');
    }
  }

  async function saveConfig() {
    try {
      const config = {
        notificationsEnabled: enableNotifications.checked,
        enableSound: enableSound.checked,
        activationMode: activationMode.value,
        actionDelay: parseInt(actionDelay.value)
      };

      await chrome.storage.sync.set(config);
      
      // Notificar al background worker
      await chrome.runtime.sendMessage({
        type: 'UPDATE_CONFIG',
        config: config
      });

      showNotification('Configuración guardada exitosamente', 'success');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      showNotification('Error guardando configuración', 'error');
    }
  }

  async function resetConfig() {
    if (!confirm('¿Estás seguro de que deseas restaurar la configuración predeterminada? Esto eliminará todas tus palabras clave, números y emails configurados.')) {
      return;
    }

    try {
      const defaultConfig = {
        keywords: [
          { text: 'urgente', actions: ['whatsapp', 'email'], priority: 'high' },
          { text: 'cotización', actions: ['email'], priority: 'medium' },
          { text: 'comprar', actions: ['whatsapp'], priority: 'high' }
        ],
        whatsappNumbers: [],
        emailAddresses: [],
        notificationsEnabled: true,
        enableSound: true,
        activationMode: 'auto',
        actionDelay: 2
      };

      await chrome.storage.sync.set(defaultConfig);
      await chrome.runtime.sendMessage({
        type: 'UPDATE_CONFIG',
        config: defaultConfig
      });

      await loadConfig();
      showNotification('Configuración restaurada', 'success');
    } catch (error) {
      console.error('Error restaurando configuración:', error);
      showNotification('Error restaurando configuración', 'error');
    }
  }

  function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 3000);
  }
});

