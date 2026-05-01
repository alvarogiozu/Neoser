param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl
)

$pass = 0
$fail = 0

function Check-Status {
  param(
    [string]$Name,
    [string]$Expected,
    [string]$Method,
    [string]$Url,
    [string]$Body = ""
  )

  try {
    if ($Body -ne "") {
      $response = Invoke-WebRequest -Uri $Url -Method $Method -ContentType "application/json" -Body $Body -UseBasicParsing -ErrorAction Stop
      $statusCode = [string]$response.StatusCode
    } else {
      $response = Invoke-WebRequest -Uri $Url -Method $Method -UseBasicParsing -ErrorAction Stop
      $statusCode = [string]$response.StatusCode
    }
  } catch {
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
      $statusCode = [string][int]$_.Exception.Response.StatusCode
    } else {
      $statusCode = "000"
    }
  }

  if ($statusCode -eq $Expected) {
    Write-Host "  PASS  $Name (HTTP $statusCode)" -ForegroundColor Green
    $script:pass++
  } else {
    Write-Host "  FAIL  $Name (esperado $Expected, obtuvo $statusCode)" -ForegroundColor Red
    $script:fail++
  }
}

Write-Host ""
Write-Host "=== NeoSer Smoke Test (PowerShell) ==="
Write-Host "URL: $BaseUrl"
Write-Host ""

try {
  $probe = Invoke-WebRequest -Uri "$BaseUrl/" -Method GET -UseBasicParsing -ErrorAction Stop
  $probeCode = [string]$probe.StatusCode
} catch {
  if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
    $probeCode = [string][int]$_.Exception.Response.StatusCode
  } else {
    $probeCode = "000"
  }
}

if ($probeCode -eq "401") {
  Write-Host "Preview protegido por Vercel Deployment Protection (401)." -ForegroundColor Yellow
  Write-Host "Habilita Shareable Preview Link o desactiva protection temporalmente para QA."
  exit 2
}

Write-Host "--- Paginas ---"
Check-Status "Home /" "200" "GET" "$BaseUrl/"
Check-Status "Contacto /contacto" "200" "GET" "$BaseUrl/contacto"
Check-Status "Login /login" "200" "GET" "$BaseUrl/login"
Check-Status "Admin sin sesion -> redirect" "307" "GET" "$BaseUrl/admin"

Write-Host ""
Write-Host "--- API: contact-leads ---"
Check-Status "POST valido" "201" "POST" "$BaseUrl/api/contact-leads" '{"fullName":"Smoke Test","phone":"51999999999","message":"Test automatizado","source":"web","waConsent":true}'
Check-Status "POST invalido" "400" "POST" "$BaseUrl/api/contact-leads" '{"fullName":"T","phone":"","message":"x"}'

Write-Host ""
Write-Host "--- API: courses ---"
Check-Status "GET courses" "200" "GET" "$BaseUrl/api/courses"

Write-Host ""
Write-Host "--- API: enrollments ---"
Check-Status "POST sin auth" "401" "POST" "$BaseUrl/api/enrollments" '{"courseId":"00000000-0000-0000-0000-000000000000"}'

Write-Host ""
Write-Host "--- API: whatsapp ---"
Check-Status "POST sin auth" "401" "POST" "$BaseUrl/api/whatsapp" '{"to":"51978822368","template":"neoser_bienvenida"}'
Check-Status "Webhook token incorrecto" "403" "GET" "$BaseUrl/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=test"

Write-Host ""
Write-Host "--- API: whatsapp webhook ---"
Check-Status "Webhook opt-out SALIR" "200" "POST" "$BaseUrl/api/whatsapp/webhook" '{"entry":[{"changes":[{"value":{"messages":[{"from":"51900000001","text":{"body":"SALIR"}}]}}]}]}'
Check-Status "Webhook mensaje generico" "200" "POST" "$BaseUrl/api/whatsapp/webhook" '{"entry":[{"changes":[{"value":{"messages":[{"from":"51900000002","text":{"body":"Hola quiero info"}}]}}]}]}'

Write-Host ""
Write-Host "=== Resultado: $pass passed, $fail failed ==="

if ($fail -gt 0) {
  Write-Host "HAY FALLOS. Revisar antes de promover a produccion." -ForegroundColor Red
  exit 1
}

Write-Host "Todo OK. Listo para go-live." -ForegroundColor Green
exit 0
