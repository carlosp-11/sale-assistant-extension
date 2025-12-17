# 🧪 Instrucciones de Prueba - Sale Assistant

## ⚠️ Nota Importante sobre Íconos

Los archivos de íconos actualmente son SVG. Para que la extensión funcione correctamente en Chrome, necesitas convertirlos a PNG:

### Opción 1: Convertir en línea
1. Abre https://cloudconvert.com/svg-to-png
2. Sube `icons/icon16.svg`, configura 16x16px y descarga como `icon16.png`
3. Sube `icons/icon48.svg`, configura 48x48px y descarga como `icon48.png`
4. Sube `icons/icon128.svg`, configura 128x128px y descarga como `icon128.png`
5. Guarda todos los .png en la carpeta `icons/`

### Opción 2: Usar herramientas
- **Inkscape**: File → Export PNG Image
- **GIMP**: Abrir SVG → Export As PNG
- **ImageMagick**: `convert icon.svg -resize 128x128 icon128.png`

---

## 🚀 Prueba 1: Cargar la Extensión en Chrome

### Pasos:
1. Abre Google Chrome
2. Navega a `chrome://extensions/`
3. Activa el "Modo de desarrollador" (toggle en la esquina superior derecha)
4. Haz clic en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta `sale-assistant-extension`
6. Verifica que aparece "Sale Assistant" en la lista de extensiones

### Resultado Esperado:
- ✅ La extensión aparece sin errores
- ✅ El ícono es visible en la barra de herramientas
- ✅ Estado: Activo

---

## 🧪 Prueba 2: Verificar Popup

### Pasos:
1. Haz clic en el ícono de Sale Assistant en la barra de herramientas
2. Verifica que se abre el popup
3. Observa las estadísticas (deben estar en 0)
4. Prueba el toggle activar/desactivar
5. Haz clic en "⚙️ Configuración"

### Resultado Esperado:
- ✅ Popup se abre correctamente
- ✅ Estadísticas muestran 0 en todos los contadores
- ✅ Toggle funciona y cambia el indicador de estado
- ✅ Botón de configuración abre la página de opciones

---

## 🧪 Prueba 3: Configurar la Extensión

### Pasos:
1. En la página de opciones, agrega palabras clave:
   - "urgente" (Alta prioridad, WhatsApp y Email)
   - "cotización" (Media prioridad, Email)
   - "comprar" (Alta prioridad, WhatsApp)
2. Agrega tu número de WhatsApp (formato: +5491112345678)
3. Agrega tu email
4. Haz clic en "💾 Guardar Configuración"

### Resultado Esperado:
- ✅ Palabras clave se agregan correctamente
- ✅ Números y emails se guardan
- ✅ Aparece notificación de "Configuración guardada exitosamente"

---

## 🧪 Prueba 4: Prueba en Formulario Real

### Opción A: Crear HTML de Prueba Local

Crea un archivo `test-form.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Formulario de Prueba - Sale Assistant</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
        }
        input, textarea {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        label {
            font-weight: bold;
            display: block;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <h1>Formulario de Contacto</h1>
    <form>
        <label>Nombre:</label>
        <input type="text" name="nombre" placeholder="Tu nombre">
        
        <label>Email:</label>
        <input type="email" name="email" placeholder="tu@email.com">
        
        <label>Mensaje:</label>
        <textarea name="mensaje" rows="5" placeholder="Escribe aquí..."></textarea>
    </form>
</body>
</html>
```

### Pasos:
1. Abre `test-form.html` en Chrome
2. Escribe en el campo "Mensaje": "Necesito una cotización urgente"
3. Espera 1-2 segundos
4. Observa si aparece una notificación del sistema
5. Verifica que se abren pestañas de WhatsApp/Email

### Resultado Esperado:
- ✅ Notificación aparece: "Palabra Clave Detectada: urgente, cotización"
- ✅ Se abre pestaña de WhatsApp Web con mensaje pre-llenado
- ✅ Se abre pestaña del cliente de email con mensaje
- ✅ Las estadísticas en el popup se actualizan

### Opción B: Prueba en Sitios Reales

Prueba en sitios con formularios como:
- Google Forms
- Formulario de contacto de cualquier sitio web
- TypeForm

---

## 🧪 Prueba 5: Verificar Consola del Navegador

### Pasos:
1. Con cualquier página abierta, presiona F12
2. Ve a la pestaña "Console"
3. Busca mensajes de Sale Assistant

### Resultado Esperado:
- ✅ Ves: `[Sale Assistant] Content script iniciado en: [URL]`
- ✅ Cuando detecta formularios: `[Sale Assistant] Formulario detectado`
- ✅ No hay errores en rojo

---

## 🧪 Prueba 6: Verificar Background Worker

### Pasos:
1. Ve a `chrome://extensions/`
2. Encuentra "Sale Assistant"
3. Haz clic en "service worker"
4. Se abre DevTools para el background worker
5. Ve a Console

### Resultado Esperado:
- ✅ Ves: `[Sale Assistant] Background worker iniciado`
- ✅ Ves: `[Sale Assistant] Configuración cargada`
- ✅ No hay errores

---

## 🧪 Prueba 7: Prueba de Campos Password (Seguridad)

### Crear archivo `test-security.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Prueba de Seguridad</title>
</head>
<body>
    <h1>Formulario con Password</h1>
    <form>
        <input type="text" name="usuario" placeholder="Usuario">
        <input type="password" name="password" placeholder="Contraseña">
        <textarea name="mensaje" placeholder="Mensaje"></textarea>
    </form>
</body>
</html>
```

### Pasos:
1. Abre el archivo en Chrome
2. Escribe "urgente" en el campo password
3. Escribe "urgente" en el campo mensaje
4. Observa el comportamiento

### Resultado Esperado:
- ✅ NO se detecta cuando escribes en el campo password
- ✅ SÍ se detecta cuando escribes en el campo mensaje
- ❌ El password NO aparece en el mensaje enviado

---

## 🧪 Prueba 8: Prueba de Estadísticas

### Pasos:
1. Realiza varias detecciones de palabras clave
2. Abre el popup
3. Verifica que los números aumentan:
   - Formularios detectados
   - Keywords encontradas
   - Acciones ejecutadas
4. Ve a "Actividad Reciente"
5. Verifica que se muestran las últimas detecciones

### Resultado Esperado:
- ✅ Estadísticas se actualizan en tiempo real
- ✅ Actividad reciente muestra las últimas 5 detecciones
- ✅ Fechas y horas son correctas

---

## 🧪 Prueba 9: Prueba de Limpieza

### Pasos:
1. Abre el popup
2. Haz clic en "🗑️ Limpiar"
3. Confirma la acción
4. Verifica que las estadísticas vuelven a 0

### Resultado Esperado:
- ✅ Confirma la acción
- ✅ Estadísticas se resetean a 0
- ✅ Actividad reciente se borra

---

## 🧪 Prueba 10: Prueba de Desactivación

### Pasos:
1. Abre el popup
2. Desactiva el toggle
3. Intenta escribir keywords en un formulario
4. Observa que no se ejecutan acciones
5. Reactiva el toggle
6. Verifica que vuelve a funcionar

### Resultado Esperado:
- ✅ Al desactivar, no se detectan keywords
- ✅ Al reactivar, vuelve a funcionar normalmente
- ✅ El indicador de estado cambia de color

---

## 🐛 Problemas Comunes y Soluciones

### Problema: La extensión no aparece en Chrome
**Solución:** 
- Verifica que el modo desarrollador está activado
- Revisa que el manifest.json no tiene errores de sintaxis
- Mira la consola de errores en chrome://extensions/

### Problema: No se detectan formularios
**Solución:**
- Verifica que la extensión está activada (toggle en verde)
- Abre la consola (F12) y busca mensajes de error
- Verifica que tienes permisos para el sitio

### Problema: No se abren WhatsApp/Email
**Solución:**
- Verifica que configuraste números y emails correctamente
- Revisa el formato del número: +5491112345678
- Verifica que el navegador permite popups para la extensión

### Problema: Los íconos no se ven
**Solución:**
- Convierte los SVG a PNG como se indica al inicio
- Verifica que los archivos .png existen en la carpeta icons/

---

## ✅ Checklist de Pruebas Completadas

- [ ] Extensión cargada en Chrome
- [ ] Popup se abre correctamente
- [ ] Configuración se guarda
- [ ] Palabras clave se detectan
- [ ] WhatsApp se abre con mensaje
- [ ] Email se abre con mensaje
- [ ] Campos password NO se capturan
- [ ] Estadísticas se actualizan
- [ ] Limpieza funciona
- [ ] Activar/Desactivar funciona

---

## 📊 Reporte de Bugs

Si encuentras bugs, documenta:
1. ¿Qué estabas haciendo?
2. ¿Qué esperabas que pasara?
3. ¿Qué pasó en realidad?
4. Mensajes de error en la consola
5. Captura de pantalla si es posible

---

**¡Felicidades! Has completado las pruebas básicas de Sale Assistant** 🎉

