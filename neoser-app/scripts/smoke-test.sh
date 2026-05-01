#!/usr/bin/env bash
# NeoSer Smoke Test - Terminal D
# Uso: ./scripts/smoke-test.sh https://tu-url.vercel.app
# Valida endpoints criticos post-deploy en < 30 segundos.

set -euo pipefail

BASE="${1:?Uso: $0 https://tu-url.vercel.app}"
PASS=0
FAIL=0
SKIP=0

check() {
  local name="$1" expected_status="$2" method="$3" url="$4"
  shift 4
  local body="${1:-}"

  local args=(-s -o /dev/null -w "%{http_code}" -X "$method" "$url")
  if [[ -n "$body" ]]; then
    args+=(-H "Content-Type: application/json" -d "$body")
  fi

  local status
  status=$(curl "${args[@]}" 2>/dev/null || echo "000")

  if [[ "$status" == "$expected_status" ]]; then
    echo "  PASS  $name (HTTP $status)"
    ((PASS++))
  else
    echo "  FAIL  $name (esperado $expected_status, obtuvo $status)"
    ((FAIL++))
  fi
}

echo ""
echo "=== NeoSer Smoke Test ==="
echo "URL: $BASE"
echo ""

# Fast-fail if Vercel Preview is protected (401)
probe_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/" 2>/dev/null || echo "000")
if [[ "$probe_status" == "401" ]]; then
  echo "Preview protegido por Vercel Deployment Protection (401)."
  echo "Habilita Shareable Preview Link o desactiva protection temporalmente para ejecutar QA."
  exit 2
fi

echo "--- Paginas ---"
check "Home /" "200" GET "$BASE/"
check "Contacto /contacto" "200" GET "$BASE/contacto"
check "Login /login" "200" GET "$BASE/login"
check "Admin sin sesion -> redirect" "307" GET "$BASE/admin"

echo ""
echo "--- API: contact-leads ---"
check "POST valido" "201" POST "$BASE/api/contact-leads" \
  '{"fullName":"Smoke Test","phone":"51999999999","message":"Test automatizado","source":"web","waConsent":true}'
check "POST invalido" "400" POST "$BASE/api/contact-leads" \
  '{"fullName":"T","phone":"","message":"x"}'

echo ""
echo "--- API: courses ---"
check "GET courses" "200" GET "$BASE/api/courses"

echo ""
echo "--- API: enrollments ---"
check "POST sin auth" "401" POST "$BASE/api/enrollments" \
  '{"courseId":"00000000-0000-0000-0000-000000000000"}'

echo ""
echo "=== Resultado: $PASS passed, $FAIL failed, $SKIP skipped ==="

if [[ $FAIL -gt 0 ]]; then
  echo "HAY FALLOS. Revisar antes de promover a produccion."
  exit 1
else
  echo "Todo OK. Listo para go-live."
  exit 0
fi
