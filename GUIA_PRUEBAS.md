# 🧪 Guía de Pruebas Paso a Paso

## ⚡ Cambios Realizados

### 🔧 **Interfaz de Configuración Reestructurada**
- ✅ Formulario mucho más claro con labels y grupos
- ✅ Campos organizados visualmente
- ✅ Ayudas contextuales (small text)
- ✅ Mejor UX en desktop y móvil
- ✅ Validaciones mejoradas

---

## 📋 PASO 1: Generar Íconos (OBLIGATORIO)

### 1.1 Abrir el Generador
```
Doble click en: create-icons.html
```

### 1.2 Descargar los 3 Íconos
Se generan automáticamente al abrir el archivo.

**Opción A:** Click en **"⬇️ Descargar Todos"**

**Opción B:** Click derecho en cada ícono → "Guardar imagen como..."
- icon16.png
- icon48.png  
- icon128.png

### 1.3 Guardar en la Carpeta Correcta
```
Guardar en: sale-assistant-extension/icons/
```

⚠️ **Sin los íconos PNG, la extensión NO cargará en Chrome**

---

## 📋 PASO 2: Cargar la Extensión en Chrome

### 2.1 Abrir Chrome Extensions
```
chrome://extensions/
```

### 2.2 Activar Modo Desarrollador
Toggle en la esquina superior derecha

### 2.3 Cargar Extensión
1. Click en **"Cargar extensión sin empaquetar"**
2. Navegar a: `C:\Users\carlo\projects\sale_assistant\sale-assistant-extension`
3. Seleccionar la carpeta
4. Click en **"Seleccionar carpeta"**

### 2.4 Verificar
- ✅ La extensión aparece sin errores
- ✅ El ícono está visible en la barra de herramientas
- ✅ Estado: "Activo"

---

## 📋 PASO 3: Configurar la Extensión

### 3.1 Abrir Configuración
1. Click en el ícono de Sale Assistant
2. Click en **"⚙️ Configuración"**

### 3.2 Agregar Palabras Clave

#### Test 1: Palabra Clave Básica
```
Palabra Clave: urgente
Prioridad: Alta
Acciones: ✓ WhatsApp, ✓ Email
Número WhatsApp específico: [dejar vacío]
Mensaje personalizado: [dejar vacío]
```
Click en **"+ Agregar Palabra Clave"**

#### Test 2: Palabra Clave con Número Específico
```
Palabra Clave: error crítico
Prioridad: Alta
Acciones: ✓ WhatsApp
Número WhatsApp específico: +5491187654321
Mensaje personalizado: 🚨 ALERTA DE ERROR CRÍTICO
Se ha detectado un problema grave.
Atención inmediata requerida.
```
Click en **"+ Agregar Palabra Clave"**

#### Test 3: Palabra Clave Solo Email
```
Palabra Clave: cotización
Prioridad: Media
Acciones: ✓ Email
```
Click en **"+ Agregar Palabra Clave"**

### 3.3 Configurar Números de WhatsApp (Por Defecto)

```
Número: +5491112345678
(o tu número real)
```
Click en **"+ Agregar"**

### 3.4 Configurar Emails

```
Email: tu@email.com
(tu email real)
```
Click en **"+ Agregar"**

### 3.5 Guardar
Click en **"💾 Guardar Configuración"**

Debería aparecer: ✅ "Configuración guardada exitosamente"

---

## 📋 PASO 4: Probar con el Formulario de Prueba

### 4.1 Abrir Formulario de Prueba
```
Doble click en: test-complete.html
```

Se abrirá un formulario completo de pruebas.

### 4.2 Test 1: Palabra Clave Simple

1. **Escribe en el campo "Mensaje":**
   ```
   Necesito una cotización urgente
   ```

2. **Espera 1-2 segundos**

3. **Resultado Esperado:**
   - ✅ Notificación del sistema aparece
   - ✅ Se abre pestaña de WhatsApp Web
   - ✅ Mensaje pre-llenado visible
   - ✅ Se abre pestaña de Email
   - ✅ Email tiene asunto y cuerpo

### 4.3 Test 2: Número Específico

1. **Escribe en el campo "Mensaje":**
   ```
   Tenemos un error crítico en producción
   ```

2. **Espera 1-2 segundos**

3. **Resultado Esperado:**
   - ✅ Se abre WhatsApp Web
   - ✅ **Destinatario:** +5491187654321 (el número específico)
   - ✅ **Mensaje:** Tu mensaje personalizado

### 4.4 Test 3: Seguridad (Password)

1. **Escribe "urgente" en el campo PASSWORD**
2. **Espera 2 segundos**
3. **Resultado:** ❌ NO debería detectarse
   
4. **Escribe "urgente" en el campo COMENTARIO**
5. **Espera 2 segundos**
6. **Resultado:** ✅ SÍ se detecta

### 4.5 Test 4: Múltiples Keywords

1. **Escribe:**
   ```
   Quiero comprar 100 unidades. 
   Necesito cotización urgente y saber el precio.
   ```

2. **Resultado Esperado:**
   - ✅ Detecta: "comprar", "cotización", "urgente", "precio"
   - ✅ Se ejecutan múltiples acciones
   - ✅ Notificación muestra todas las keywords

---

## 📋 PASO 5: Verificar en el Popup

### 5.1 Abrir Popup
Click en el ícono de Sale Assistant

### 5.2 Verificar Estadísticas
```
Formularios: 1 (o más)
Keywords: 2+ (según cuántas detectaste)
Acciones: 2+ (WhatsApp + Email)
```

### 5.3 Verificar Actividad Reciente
Deberías ver las últimas detecciones con:
- Palabra clave detectada
- Fecha y hora

---

## 📋 PASO 6: Verificar Background Worker

### 6.1 Abrir DevTools del Background
1. Ve a `chrome://extensions/`
2. Encuentra "Sale Assistant"
3. Click en **"service worker"**
4. Se abre DevTools

### 6.2 Ver Console Logs
Deberías ver:
```
[Sale Assistant] Background worker iniciado
[Sale Assistant] Configuración cargada
[Sale Assistant] Analizando datos de formulario
[Sale Assistant] Palabras clave encontradas: ["urgente"]
[Sale Assistant] WhatsApp abierto con mensaje
```

---

## 📋 PASO 7: Probar Email (REAL)

### 7.1 Configurar Email Real
En Configuración, agrega tu email real

### 7.2 Escribir Keyword
Escribe "cotización" en el formulario de prueba

### 7.3 Verificar
- ✅ Se abre tu cliente de email (Outlook/Gmail/etc)
- ✅ Campo "Para": tu email
- ✅ Campo "Asunto": "Alerta Sale Assistant - [fecha]"
- ✅ Campo "Cuerpo": Contiene los datos del formulario

---

## 📋 PASO 8: Probar WhatsApp (REAL)

### 8.1 Configurar Número Real
En Configuración, agrega tu número de WhatsApp real:
```
Formato: +5491112345678
(código país + código área + número)
```

### 8.2 Escribir Keyword
Escribe "urgente" en el formulario de prueba

### 8.3 Verificar
- ✅ Se abre WhatsApp Web
- ✅ Si no tienes WhatsApp Web escaneado, te pide escanear QR
- ✅ Una vez escaneado, se abre el chat contigo mismo
- ✅ Mensaje pre-llenado en el campo de texto
- ✅ Solo falta hacer click en "Enviar"

**⚠️ Nota:** WhatsApp Web debe estar abierto en session o escanear QR

---

## ✅ Checklist de Verificación

### Funcionalidad Básica
- [ ] Extensión carga sin errores
- [ ] Íconos PNG funcionan
- [ ] Configuración se abre
- [ ] Se pueden agregar keywords
- [ ] Se pueden agregar números
- [ ] Se pueden agregar emails
- [ ] Configuración se guarda

### Detección
- [ ] Detecta "urgente" en formularios
- [ ] Detecta múltiples keywords
- [ ] NO detecta en campos password
- [ ] Detecta en contenteditable
- [ ] Funciona con debouncing (espera 500ms)

### Acciones
- [ ] WhatsApp Web se abre
- [ ] Mensaje está pre-llenado en WhatsApp
- [ ] Email cliente se abre
- [ ] Email tiene asunto y cuerpo
- [ ] Número específico funciona
- [ ] Mensaje personalizado funciona

### Notificaciones
- [ ] Notificación del sistema aparece
- [ ] Muestra las keywords detectadas
- [ ] Título correcto

### Estadísticas
- [ ] Popup muestra estadísticas
- [ ] Números se actualizan
- [ ] Actividad reciente funciona
- [ ] Limpiar historial funciona

### Background Worker
- [ ] Logs en consola
- [ ] Sin errores en consola
- [ ] Configuración se carga

---

## 🐛 Problemas Comunes y Soluciones

### Problema: "Could not load icon"
**Solución:** 
1. Verifica que los 3 PNG existen en `icons/`
2. Nombres exactos: icon16.png, icon48.png, icon128.png
3. Recarga la extensión

### Problema: No detecta keywords
**Solución:**
1. Verifica que la extensión está activa (toggle verde en popup)
2. Abre DevTools del background y mira console
3. Verifica que guardaste la configuración
4. Espera 1-2 segundos después de escribir

### Problema: WhatsApp no se abre
**Solución:**
1. Verifica el formato del número: +5491112345678
2. Revisa que marcaste la acción "WhatsApp"
3. Permite popups para la extensión
4. Mira console del background para errores

### Problema: Email no se abre
**Solución:**
1. Verifica el formato del email
2. Marca la acción "Email"
3. Verifica que tienes cliente de email configurado
4. Algunos navegadores bloquean mailto: URLs

---

## 📊 Resultados Esperados

### ✅ TODO FUNCIONANDO:
```
✓ Extensión cargada
✓ Configuración guardada
✓ Keywords detectadas
✓ WhatsApp abierto con mensaje
✓ Email abierto con mensaje
✓ Notificaciones funcionan
✓ Estadísticas actualizadas
✓ No hay errores en console
```

### 🎯 Flujo Completo Exitoso:
```
1. Usuario escribe en formulario
2. Content script detecta cambio
3. Espera 500ms (debouncing)
4. Envía datos al background
5. Background analiza keywords
6. Encuentra coincidencias
7. Muestra notificación
8. Abre WhatsApp Web
9. Abre cliente Email
10. Actualiza estadísticas
```

---

## 🎉 ¡Listo!

Si todos los checks están ✅, la extensión está **100% funcional**.

**Siguiente paso:** Usa en formularios reales de internet.

---

## 📞 Ayuda Adicional

Si algo no funciona:
1. Abre DevTools del background worker
2. Copia los logs de la consola
3. Revisa errores en rojo
4. Verifica la configuración guardada

**Todos los datos se guardan localmente. Nada se envía a servidores externos.** 🔒

