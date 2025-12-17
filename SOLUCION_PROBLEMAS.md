# 🔧 Solución de Problemas - Sale Assistant

## ❌ Problema: No se pueden agregar teléfonos ni correos

### 🔍 Diagnóstico Rápido

Sigue estos pasos en orden para identificar y resolver el problema:

---

## ✅ PASO 1: Verificar Íconos PNG (CRÍTICO)

### Problema:
Sin los íconos PNG, la extensión NO se carga en Chrome.

### Solución:
1. Abre el archivo: `create-icons.html`
2. Click en el botón **"⬇️ Descargar Todos"**
3. Guarda los 3 archivos en la carpeta `icons/`:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

### Verificar:
```
Ruta: sale-assistant-extension/icons/
Debe contener:
✓ icon16.png
✓ icon48.png
✓ icon128.png
```

**⚠️ SIN ESTOS ARCHIVOS PNG, NADA FUNCIONARÁ**

---

## ✅ PASO 2: Verificar la Extensión en Chrome

### 2.1 Abrir Chrome Extensions
```
chrome://extensions/
```

### 2.2 Activar Modo Desarrollador
- Toggle en la esquina superior derecha

### 2.3 Buscar "Sale Assistant"
¿Aparece la extensión?

#### SI NO APARECE:
1. Click en **"Cargar extensión sin empaquetar"**
2. Navegar a: `C:\Users\carlo\projects\sale_assistant\sale-assistant-extension`
3. Seleccionar la carpeta
4. Click en **"Seleccionar carpeta"**

#### SI APARECE PERO HAY ERRORES:
- ❌ **"Could not load icon"** → Vuelve al PASO 1
- ❌ **"Manifest error"** → Verifica que manifest.json esté correcto
- ❌ Otros errores → Copia el error y búscalo

### 2.4 Verificar Estado
- ✅ Estado: "Activado"
- ✅ Sin errores en rojo
- ✅ Ícono visible en la barra de herramientas

---

## ✅ PASO 3: Usar el Test Simple

He creado un archivo de prueba básico que te ayudará a diagnosticar.

### 3.1 Abrir el Test
```
Archivo: test-simple.html
```

### 3.2 Probar Agregar Número
1. Escribe: `+5491112345678`
2. Click en **"Agregar WhatsApp"**

### 3.3 Verificar Resultado

#### ✅ SI FUNCIONA:
- Aparece: "✅ Número agregado exitosamente"
- El número aparece en la lista debajo
- **Problema resuelto: El Storage funciona**

#### ❌ SI NO FUNCIONA:
- Abre **F12** (DevTools)
- Ve a la pestaña **"Console"**
- Busca mensajes en rojo
- Lee el error

### Errores Comunes:

#### Error: "chrome.storage is not defined"
**Causa:** El archivo no se abrió desde la extensión

**Solución:**
- NO abras `test-simple.html` directamente
- Abre la extensión en Chrome
- Usa el popup o la página de opciones

#### Error: "Cannot read properties of undefined"
**Causa:** La extensión no está cargada

**Solución:**
- Vuelve al PASO 2
- Asegúrate de que la extensión está activa

---

## ✅ PASO 4: Verificar la Página de Opciones

### 4.1 Abrir Configuración Correctamente
**Método correcto:**
1. Click en el **ícono de Sale Assistant** en Chrome
2. Click en **"⚙️ Configuración"**

**❌ NO hagas:**
- NO abras `options.html` directamente desde el explorador
- NO uses doble click en el archivo

### 4.2 Ver Console de la Página de Opciones
1. En la página de configuración, presiona **F12**
2. Ve a **Console**
3. Deberías ver:
   ```
   [Options] Cargando configuración...
   [Options] Configuración cargada: {...}
   ```

### 4.3 Intentar Agregar Número
1. Ingresa: `+5491112345678`
2. Click en **"+ Agregar"**
3. Observa la consola:
   ```
   [Options] Intentando agregar número WhatsApp
   [Options] Número ingresado: +5491112345678
   [Options] Obteniendo números existentes...
   [Options] Números actuales: []
   [Options] Guardando números: ["+5491112345678"]
   [Options] Números guardados exitosamente
   [Options] ✅ Número agregado exitosamente
   ```

### 4.4 Si Aparece Error
Copia el error completo de la consola.

---

## ✅ PASO 5: Verificar Background Worker

### 5.1 Abrir DevTools del Background
1. Ve a `chrome://extensions/`
2. Encuentra "Sale Assistant"
3. Click en **"service worker"**
4. Se abre DevTools

### 5.2 Ver Console
Deberías ver:
```
[Sale Assistant] Background worker iniciado
[Sale Assistant] Configuración cargada: {...}
```

Si hay errores aquí, cópialos.

---

## ✅ PASO 6: Test Manual Completo

### 6.1 Secuencia Completa
1. ✅ Íconos PNG creados
2. ✅ Extensión cargada en Chrome
3. ✅ Sin errores en chrome://extensions/
4. ✅ Click en ícono de extensión
5. ✅ Click en "⚙️ Configuración"
6. ✅ Página de opciones se abre
7. ✅ F12 → Console → Sin errores
8. ✅ Ingresa número: +5491112345678
9. ✅ Click "Agregar"
10. ✅ Ver consola para logs

---

## 🐛 Errores Específicos y Soluciones

### Error: "Manifest file is missing or unreadable"
**Solución:**
- Verifica que `manifest.json` existe
- Abre el archivo y verifica que es JSON válido

### Error: "Could not load icon 'icons/icon16.png'"
**Solución:**
- Genera los íconos PNG con `create-icons.html`
- Verifica que están en la carpeta `icons/`
- Nombres exactos: `icon16.png`, `icon48.png`, `icon128.png`

### Error: "Storage quota exceeded"
**Solución:**
```javascript
// En test-simple.html, click en "Limpiar Storage"
```

### Error: "This operation has been aborted"
**Solución:**
- Recarga la extensión en chrome://extensions/
- Intenta de nuevo

### No aparece notificación después de agregar
**Posibles causas:**
1. JavaScript está deshabilitado
2. Hay un error en la consola (F12)
3. La función `showNotification` no se ejecuta

**Debug:**
```javascript
// En Console de DevTools:
showNotification('Test', 'success')
```

---

## 📊 Checklist de Verificación

Marca cada item después de verificarlo:

- [ ] Íconos PNG creados y guardados en `icons/`
- [ ] Extensión aparece en `chrome://extensions/`
- [ ] Modo desarrollador está activado
- [ ] Extensión está en estado "Activado"
- [ ] No hay errores rojos en chrome://extensions/
- [ ] Ícono visible en barra de herramientas
- [ ] Popup se abre al hacer click
- [ ] Botón "Configuración" funciona
- [ ] Página de opciones se carga
- [ ] Console (F12) muestra: "[Options] Cargando configuración..."
- [ ] No hay errores en la console
- [ ] Test simple funciona
- [ ] Puedo agregar números y emails

---

## 🆘 Si Nada Funciona

### Opción 1: Reinstalación Limpia
```bash
1. En chrome://extensions/ → Eliminar "Sale Assistant"
2. Cerrar Chrome completamente
3. Abrir Chrome
4. Ir a chrome://extensions/
5. Activar Modo desarrollador
6. Cargar extensión sin empaquetar
7. Seleccionar: sale-assistant-extension
```

### Opción 2: Verificar Archivos
```bash
Estructura requerida:
sale-assistant-extension/
├── manifest.json ✓
├── background.js ✓
├── content/content-script.js ✓
├── popup/
│   ├── popup.html ✓
│   ├── popup.css ✓
│   └── popup.js ✓
├── options/
│   ├── options.html ✓
│   ├── options.css ✓
│   └── options.js ✓
└── icons/
    ├── icon16.png ✓ CRÍTICO
    ├── icon48.png ✓ CRÍTICO
    └── icon128.png ✓ CRÍTICO
```

### Opción 3: Log Completo
```javascript
// En Console de DevTools (F12):
chrome.storage.sync.get(null, (data) => {
  console.log('Storage completo:', data);
});
```

---

## 📝 Reportar el Problema

Si después de seguir todos los pasos aún no funciona, proporciona:

1. **Versión de Chrome:**
   ```
   chrome://version/
   ```

2. **Errores en Console:**
   - Abre F12 en la página de opciones
   - Copia todo lo que aparece en rojo

3. **Estado de la Extensión:**
   - Screenshot de chrome://extensions/
   - Screenshot de los logs en la console

4. **Estructura de Archivos:**
   ```bash
   # En la carpeta sale-assistant-extension:
   dir icons
   ```
   ¿Qué archivos aparecen?

---

## ✅ Solución Más Común

**En el 90% de los casos, el problema es:**

```
❌ No se generaron los íconos PNG
```

**Solución:**
1. Abre `create-icons.html`
2. Descarga los 3 PNG
3. Guárdalos en `icons/`
4. Recarga la extensión

**¡Listo!** 🎉

