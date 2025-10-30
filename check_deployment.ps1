Write-Host "================================" -ForegroundColor Cyan
Write-Host "Verificación de Archivos para Despliegue" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Backend checks
Write-Host "📦 BACKEND - Verificando archivos..." -ForegroundColor Yellow
Set-Location ecommerce_backend

$files = @(
    "requirements.txt",
    "Procfile",
    "build.sh",
    "runtime.txt",
    "data.json",
    ".gitignore",
    "README.md"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file - FALTA" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📄 Verificando settings.py..." -ForegroundColor Yellow
$settingsContent = Get-Content "ecommerce_backend\settings.py" -Raw
if ($settingsContent -match "dj_database_url") {
    Write-Host "✅ settings.py configurado para producción" -ForegroundColor Green
} else {
    Write-Host "❌ settings.py no tiene configuración de producción" -ForegroundColor Red
}

Set-Location ..

# Frontend checks
Write-Host ""
Write-Host "🎨 FRONTEND - Verificando archivos..." -ForegroundColor Yellow
Set-Location ecommerce_frontend

$files = @(
    ".env.example",
    ".gitignore",
    "README.md"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file - FALTA" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📄 Verificando config.js..." -ForegroundColor Yellow
$configContent = Get-Content "src\config.js" -Raw
if ($configContent -match "import\.meta\.env\.VITE_API_BASE_URL") {
    Write-Host "✅ config.js configurado para variables de entorno" -ForegroundColor Green
} else {
    Write-Host "❌ config.js no usa variables de entorno" -ForegroundColor Red
}

Set-Location ..

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Verificacion completada" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "1. Sube el codigo a GitHub" -ForegroundColor White
Write-Host "2. Sigue la guia en DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host ""
