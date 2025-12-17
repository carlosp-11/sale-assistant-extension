# 🚀 Sale Assistant - Asistente de Ventas Automatizado

Extensión de navegador que monitorea formularios web en tiempo real, detecta palabras clave específicas y activa automáticamente acciones de comunicación (WhatsApp, Email).

## 📋 Características

- ✅ Monitoreo en tiempo real de formularios web
- ✅ Detección de palabras clave configurables
- ✅ Integración con WhatsApp Web
- ✅ Integración con cliente de Email
- ✅ Notificaciones de escritorio
- ✅ Estadísticas de actividad
- ✅ Compatible con Chrome, Edge y Safari

## 🔧 Instalación para Desarrollo

1. Clona el repositorio
2. Abre Chrome y ve a `chrome://extensions`
3. Activa el "Modo de desarrollador"
4. Haz clic en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta `sale-assistant-extension`

## 🎯 Configuración Inicial

1. Haz clic en el icono de la extensión
2. Ve a "⚙️ Configuración"
3. Agrega tus palabras clave
4. Configura tu número de WhatsApp (formato: +5491112345678)
5. Agrega tu email de contacto
6. Guarda la configuración

## 🏗️ Estructura del Proyecto

```
sale-assistant-extension/
├── manifest.json              # Configuración de la extensión
├── background.js              # Service Worker (lógica central)
├── content/
│   └── content-script.js     # Monitor de formularios
├── popup/
│   ├── popup.html            # UI del panel de control
│   ├── popup.js              # Lógica del popup
│   └── popup.css             # Estilos del popup
├── options/
│   ├── options.html          # Página de configuración
│   ├── options.js            # Lógica de opciones
│   └── options.css           # Estilos de opciones
├── utils/
│   ├── keyword-matcher.js    # Motor de detección
│   ├── message-formatter.js  # Formateador de mensajes
│   └── storage-helper.js     # Ayudante de almacenamiento
├── actions/
│   ├── whatsapp-action.js    # Integración WhatsApp
│   └── email-action.js       # Integración Email
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🔒 Privacidad y Seguridad

- ❌ NO recopila datos personales
- ❌ NO transmite datos a servidores externos
- ✅ TODO se procesa localmente en tu navegador
- ✅ NO captura campos de contraseña

## 📝 Licencia

MIT License - Ver archivo LICENSE para más detalles

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir cambios mayores.

## 📞 Soporte

Para reportar bugs o solicitar características, abre un issue en GitHub.

---

**Versión:** 1.0.0  
**Estado:** En Desarrollo

