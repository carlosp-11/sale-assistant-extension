// popup.js

document.addEventListener('DOMContentLoaded', async () => {
  // Elementos del DOM
  const toggleActive = document.getElementById('toggleActive');
  const statusText = document.querySelector('.status-text');
  const statusIndicator = document.querySelector('.status-indicator');
  const openOptionsBtn = document.getElementById('openOptions');
  const clearHistoryBtn = document.getElementById('clearHistory');
  const activityList = document.getElementById('activityList');
  const formsDetected = document.getElementById('formsDetected');
  const keywordsFound = document.getElementById('keywordsFound');
  const actionsExecuted = document.getElementById('actionsExecuted');

  // Cargar estado inicial
  await loadStatus();
  await loadStats();
  await loadActivity();

  // Event Listeners
  toggleActive.addEventListener('change', handleToggle);
  openOptionsBtn.addEventListener('click', openOptions);
  clearHistoryBtn.addEventListener('click', clearHistory);

  // Funciones
  async function loadStatus() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
      const isActive = response.isActive;
      
      toggleActive.checked = isActive;
      statusText.textContent = isActive ? 'Activo' : 'Inactivo';
      
      if (isActive) {
        statusIndicator.classList.remove('inactive');
      } else {
        statusIndicator.classList.add('inactive');
      }
    } catch (error) {
      console.error('Error cargando estado:', error);
    }
  }

  async function loadStats() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
      const stats = response.stats || {
        formsDetected: 0,
        keywordsFound: 0,
        actionsExecuted: 0
      };

      formsDetected.textContent = stats.formsDetected;
      keywordsFound.textContent = stats.keywordsFound;
      actionsExecuted.textContent = stats.actionsExecuted;
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }

  async function loadActivity() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_ACTIVITY' });
      const activities = response.activity || [];

      if (activities.length === 0) {
        activityList.innerHTML = '<li class="empty-state">No hay actividad reciente</li>';
        return;
      }

      activityList.innerHTML = activities
        .slice(0, 5)
        .map(activity => `
          <li>
            <strong>${activity.keyword}</strong> detectado
            <br>
            <small>${new Date(activity.timestamp).toLocaleString('es-ES')}</small>
          </li>
        `)
        .join('');
    } catch (error) {
      console.error('Error cargando actividad:', error);
      activityList.innerHTML = '<li class="empty-state">Error cargando actividad</li>';
    }
  }

  async function handleToggle() {
    const isActive = toggleActive.checked;
    
    try {
      await chrome.runtime.sendMessage({
        type: 'UPDATE_CONFIG',
        config: { isActive }
      });

      statusText.textContent = isActive ? 'Activo' : 'Inactivo';
      
      if (isActive) {
        statusIndicator.classList.remove('inactive');
      } else {
        statusIndicator.classList.add('inactive');
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
      // Revertir el toggle si hubo error
      toggleActive.checked = !isActive;
    }
  }

  function openOptions() {
    chrome.runtime.openOptionsPage();
  }

  async function clearHistory() {
    if (confirm('¿Estás seguro de que deseas limpiar el historial y estadísticas?')) {
      try {
        const today = new Date().toDateString();
        await chrome.storage.local.set({
          stats: { [today]: { formsDetected: 0, keywordsFound: 0, actionsExecuted: 0 } },
          recentActivity: []
        });
        
        // Recargar datos
        await loadStats();
        await loadActivity();
        
        alert('Historial limpiado exitosamente');
      } catch (error) {
        console.error('Error limpiando historial:', error);
        alert('Error al limpiar el historial');
      }
    }
  }
});

