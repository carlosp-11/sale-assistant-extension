# 📝 Ejemplos de Uso - Sale Assistant

## ✅ Funcionalidad Verificada

### **WhatsApp Integration** ✓ PROBADO
La extensión **SÍ es capaz de enviar mensajes a WhatsApp** usando la API `wa.me`.

**Cómo funciona:**
- La extensión crea una URL especial: `https://wa.me/[NÚMERO]?text=[MENSAJE]`
- Al abrirse, WhatsApp Web se carga con el mensaje ya escrito
- El usuario solo debe hacer clic en "Enviar"

**Prueba realizada:**
```
URL: https://wa.me/5491112345678?text=Hola%20esto%20es%20una%20prueba%20de%20Sale%20Assistant
Resultado: ✅ Se abre WhatsApp Web correctamente con el mensaje pre-llenado
```

---

## 🎯 Nueva Funcionalidad: Mensajes y Números Personalizados

### **Característica Agregada**
Ahora puedes configurar **para cada palabra clave**:
- ✅ Un número de WhatsApp específico
- ✅ Un mensaje personalizado
- ✅ Diferentes acciones por keyword

---

## 📋 Ejemplos de Configuración

### **Ejemplo 1: Soporte Técnico Urgente**

**Configuración:**
- **Palabra clave:** "error crítico"
- **Prioridad:** Alta
- **Acciones:** WhatsApp
- **Número específico:** +5491112345678 (Soporte técnico)
- **Mensaje personalizado:** 
  ```
  🚨 ALERTA DE ERROR CRÍTICO
  Un cliente ha reportado un error crítico en el sistema.
  Por favor, contactar inmediatamente.
  ```

**Resultado:**
Cuando alguien escribe "error crítico" en un formulario, se envía automáticamente ese mensaje al equipo de soporte técnico.

---

### **Ejemplo 2: Ventas VIP**

**Configuración:**
- **Palabra clave:** "compra superior a 10000"
- **Prioridad:** Alta
- **Acciones:** WhatsApp
- **Número específico:** +5491187654321 (Gerente de ventas)
- **Mensaje personalizado:**
  ```
  💰 OPORTUNIDAD DE VENTA VIP
  Un cliente potencial está interesado en una compra grande.
  Atención prioritaria requerida.
  ```

---

### **Ejemplo 3: Consultas de Precio**

**Configuración:**
- **Palabra clave:** "precio"
- **Prioridad:** Media
- **Acciones:** WhatsApp, Email
- **Número específico:** +5491198765432 (Equipo comercial)
- **Mensaje personalizado:**
  ```
  📊 Consulta de Precios
  Un cliente está solicitando información de precios.
  Responder dentro de 24 horas.
  ```

---

### **Ejemplo 4: Reclamos**

**Configuración:**
- **Palabra clave:** "reclamo"
- **Prioridad:** Alta
- **Acciones:** WhatsApp, Email
- **Número específico:** +5491176543210 (Atención al cliente)
- **Mensaje personalizado:**
  ```
  ⚠️ RECLAMO DE CLIENTE
  Se ha recibido un reclamo. Gestionar con prioridad.
  Plazo máximo de respuesta: 48 horas.
  ```

---

### **Ejemplo 5: Múltiples Keywords, Múltiples Números**

Puedes configurar diferentes palabras clave que envíen a diferentes personas:

| Palabra Clave | Número | Destinatario |
|---------------|---------|-------------|
| "urgente" | +5491112345678 | Gerente General |
| "bug" | +5491123456789 | Desarrollador Principal |
| "factura" | +5491134567890 | Departamento de Finanzas |
| "entrega" | +5491145678901 | Logística |
| "devolución" | +5491156789012 | Servicio al Cliente |

---

## 🔧 Cómo Configurar

### **Paso 1: Abrir Configuración**
1. Click en el ícono de Sale Assistant
2. Click en "⚙️ Configuración"

### **Paso 2: Agregar Palabra Clave con Configuración Personalizada**
1. Escribe la palabra clave (ej: "urgente")
2. Selecciona la prioridad
3. Marca las acciones (WhatsApp/Email)
4. **(NUEVO)** Ingresa un número de WhatsApp específico (opcional)
5. **(NUEVO)** Escribe un mensaje personalizado (opcional)
6. Click en "Agregar"

### **Paso 3: Guardar**
Click en "💾 Guardar Configuración"

---

## 🧪 Prueba de Ejemplo

### **Crear un Formulario de Prueba**

Crea un archivo `test-personalized.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Prueba - Mensajes Personalizados</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        form {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        label {
            display: block;
            margin-top: 15px;
            font-weight: bold;
        }
        input, textarea {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .ejemplo {
            background: #fffbeb;
            border: 2px solid #fbbf24;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>🧪 Formulario de Prueba - Sale Assistant</h1>
    
    <div class="ejemplo">
        <strong>💡 Prueba estas palabras clave:</strong>
        <ul>
            <li>"urgente" - Para probar mensaje estándar</li>
            <li>"error crítico" - Si configuraste mensaje personalizado</li>
            <li>"compra superior a 10000" - Para ventas VIP</li>
        </ul>
    </div>

    <form>
        <label>Nombre:</label>
        <input type="text" name="nombre" placeholder="Tu nombre">
        
        <label>Email:</label>
        <input type="email" name="email" placeholder="tu@email.com">
        
        <label>Mensaje:</label>
        <textarea name="mensaje" rows="5" placeholder="Escribe aquí... Prueba con palabras como 'urgente' o 'error crítico'"></textarea>
    </form>

    <div class="ejemplo" style="background: #dcfce7; border-color: #10b981; margin-top: 30px;">
        <strong>✅ ¿Qué debería pasar?</strong>
        <ol>
            <li>Escribe en el campo "Mensaje"</li>
            <li>Espera 1-2 segundos</li>
            <li>Verás una notificación del sistema</li>
            <li>Se abrirá WhatsApp Web con tu mensaje personalizado</li>
        </ol>
    </div>
</body>
</html>
```

### **Resultado Esperado:**

Si configuraste "error crítico" con:
- Número: +5491112345678
- Mensaje: "🚨 ALERTA DE ERROR CRÍTICO..."

Al escribir "error crítico" en el formulario:
1. ✅ Se abre WhatsApp Web
2. ✅ Destinatario: +5491112345678
3. ✅ Mensaje pre-llenado: "🚨 ALERTA DE ERROR CRÍTICO..."

---

## 📊 Ventajas de esta Funcionalidad

### **1. Departamentalización**
Diferentes palabras clave van a diferentes departamentos automáticamente.

### **2. Priorización**
Mensajes críticos van directamente al gerente, consultas normales al equipo general.

### **3. Contexto Inmediato**
Los mensajes personalizados dan contexto inmediato sin necesidad de explicaciones adicionales.

### **4. Eficiencia**
El destinatario sabe exactamente qué hacer sin leer todo el formulario primero.

---

## 🎯 Casos de Uso Reales

### **E-commerce**
- "carrito abandonado" → Equipo de recuperación de ventas
- "problema de pago" → Soporte técnico de pagos
- "consulta de envío" → Logística
- "quiero devolver" → Atención al cliente

### **SaaS / Software**
- "bug crítico" → Desarrolladores on-call
- "no puedo acceder" → Soporte nivel 1
- "necesito más licencias" → Ventas
- "cancelar suscripción" → Retención

### **Servicios**
- "urgente" → Gerente de operaciones
- "cotización grande" → Gerente comercial
- "consulta técnica" → Equipo técnico
- "facturación" → Finanzas

---

## 🔒 Notas de Seguridad

- ✅ Los mensajes se envían SOLO a los números que configuras
- ✅ Puedes tener números diferentes por palabra clave
- ✅ Los campos de contraseña NUNCA se capturan
- ✅ Todo funciona localmente, sin servidores externos

---

## 🆕 Cambios Realizados

### **Backend (background.js)**
- ✅ Soporte para `whatsappNumber` por keyword
- ✅ Soporte para `customMessage` por keyword
- ✅ Lógica para usar número específico o por defecto
- ✅ Lógica para usar mensaje personalizado o estándar

### **Frontend (options.html/js/css)**
- ✅ Campo para número de WhatsApp específico
- ✅ Campo para mensaje personalizado
- ✅ Validación de formato de número
- ✅ Visualización de configuraciones en la lista
- ✅ Grid layout mejorado

---

## 📝 Notas Finales

Esta funcionalidad te permite crear un **sistema de enrutamiento inteligente** donde cada tipo de consulta va automáticamente a la persona o equipo correcto, con el contexto apropiado.

**¡Perfecto para equipos con múltiples personas y roles!** 🎉

