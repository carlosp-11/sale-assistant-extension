# Script para generar íconos PNG desde SVG
# Requiere Chrome instalado

Write-Host "`n╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "║        🎨 GENERADOR DE ÍCONOS PNG 🎨                          ║" -ForegroundColor Green
Write-Host "║                                                               ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar si existe la carpeta icons
if (-not (Test-Path "icons")) {
    Write-Host "❌ No se encontró la carpeta 'icons'" -ForegroundColor Red
    exit 1
}

# Crear archivo temporal HTML para generación automática
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Generador de Íconos</title>
</head>
<body>
    <h1>Generando íconos...</h1>
    <canvas id="canvas16" width="16" height="16"></canvas>
    <canvas id="canvas48" width="48" height="48"></canvas>
    <canvas id="canvas128" width="128" height="128"></canvas>
    
    <script>
        function createIcon(size) {
            const canvas = document.getElementById('canvas' + size);
            const ctx = canvas.getContext('2d');
            
            // Fondo degradado
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            
            // Borde redondeado
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = Math.max(1, size / 32);
            ctx.roundRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8, size * 0.1);
            ctx.stroke();
            
            // Letra "S" blanca
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold ' + (size * 0.6) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('S', size / 2, size / 2);
            
            return canvas.toDataURL('image/png');
        }
        
        // Generar y descargar
        setTimeout(() => {
            const sizes = [16, 48, 128];
            sizes.forEach(size => {
                const dataUrl = createIcon(size);
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = 'icon' + size + '.png';
                a.click();
            });
            
            // Notificar completado
            document.body.innerHTML = '<h1 style="color: green;">✅ Íconos generados</h1><p>Revisa tu carpeta de descargas</p>';
        }, 1000);
    </script>
</body>
</html>
"@

# Guardar HTML temporal
$tempFile = [System.IO.Path]::GetTempFileName() + ".html"
$htmlContent | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "📝 Archivo temporal creado: $tempFile" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Abriendo navegador..." -ForegroundColor Yellow
Write-Host ""

# Abrir en Chrome
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (Test-Path $chromePath) {
    Start-Process $chromePath -ArgumentList $tempFile
} else {
    # Intentar con el navegador predeterminado
    Start-Process $tempFile
}

Write-Host "✅ Se abrió el navegador" -ForegroundColor Green
Write-Host ""
Write-Host "📋 INSTRUCCIONES:" -ForegroundColor Yellow
Write-Host "   1. Los 3 íconos se descargarán automáticamente" -ForegroundColor White
Write-Host "   2. Ve a tu carpeta de Descargas" -ForegroundColor White
Write-Host "   3. Busca: icon16.png, icon48.png, icon128.png" -ForegroundColor White
Write-Host "   4. Muévelos a: $PWD\icons\" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Esperando 10 segundos..." -ForegroundColor Gray
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "🔍 Verificando íconos..." -ForegroundColor Yellow

$iconsFound = 0
$iconsNeeded = @("icon16.png", "icon48.png", "icon128.png")

foreach ($icon in $iconsNeeded) {
    $path = Join-Path "icons" $icon
    if (Test-Path $path) {
        Write-Host "   ✅ $icon" -ForegroundColor Green
        $iconsFound++
    } else {
        Write-Host "   ❌ $icon - NO ENCONTRADO" -ForegroundColor Red
    }
}

Write-Host ""

if ($iconsFound -eq 3) {
    Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                               ║" -ForegroundColor Green
    Write-Host "║        ✅ TODOS LOS ÍCONOS ESTÁN LISTOS ✅                    ║" -ForegroundColor White
    Write-Host "║                                                               ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 PRÓXIMO PASO: Carga la extensión en Chrome" -ForegroundColor Yellow
    Write-Host "   1. Abre: chrome://extensions/" -ForegroundColor White
    Write-Host "   2. Activa 'Modo desarrollador'" -ForegroundColor White
    Write-Host "   3. Click 'Cargar extensión sin empaquetar'" -ForegroundColor White
    Write-Host "   4. Selecciona: $PWD" -ForegroundColor White
} else {
    Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║                                                               ║" -ForegroundColor Red
    Write-Host "║        ⚠️  FALTAN ÍCONOS ⚠️                                   ║" -ForegroundColor Yellow
    Write-Host "║                                                               ║" -ForegroundColor Red
    Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 ACCIÓN REQUERIDA:" -ForegroundColor Yellow
    Write-Host "   1. Ve a tu carpeta de Descargas" -ForegroundColor White
    Write-Host "   2. Busca los archivos descargados:" -ForegroundColor White
    Write-Host "      • icon16.png" -ForegroundColor Gray
    Write-Host "      • icon48.png" -ForegroundColor Gray
    Write-Host "      • icon128.png" -ForegroundColor Gray
    Write-Host "   3. Cópialos a: $PWD\icons\" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 O usa create-icons.html manualmente" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🗑️  Limpiando archivo temporal..." -ForegroundColor Gray
Remove-Item $tempFile -ErrorAction SilentlyContinue

Write-Host "✅ Proceso completado" -ForegroundColor Green
Write-Host ""

