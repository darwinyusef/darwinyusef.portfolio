# 🔐 GitHub Secrets Setup

Guía para configurar los secrets necesarios en GitHub para CI/CD.

---

## 📋 Secrets Necesarios

Ve a tu repositorio en GitHub:

```
https://github.com/darwinyusef/darwinyusef.portfolio/settings/secrets/actions
```

### 1. Jenkins Credentials

#### `JENKINS_USER`
- **Descripción:** Usuario de Jenkins
- **Valor:** Tu usuario de Jenkins (ej: `admin`)
- **Cómo obtenerlo:**
  1. Ve a Jenkins: http://YOUR_SERVER_IP:8080
  2. Login con tu usuario
  3. Usa ese nombre de usuario

#### `JENKINS_TOKEN`
- **Descripción:** API Token de Jenkins
- **Cómo obtenerlo:**
  1. Jenkins → Click en tu usuario (arriba derecha)
  2. Configure
  3. API Token → Add new Token
  4. Generate
  5. Copiar el token generado

#### `JENKINS_CRUMB` (Opcional)
- **Descripción:** CSRF protection token
- **Cómo obtenerlo:**
  ```bash
  # Desde terminal
  curl -u 'TU_USER:TU_TOKEN' 'http://YOUR_SERVER_IP:8080/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,":",//crumb)'
  ```
- **Nota:** Solo necesario si Jenkins tiene CSRF habilitado

---

## 🔧 Cómo Agregar Secrets en GitHub

### Método GUI

1. Ve a: `Settings` → `Secrets and variables` → `Actions`
2. Click `New repository secret`
3. Ingresa:
   - **Name:** Nombre del secret (ej: `JENKINS_USER`)
   - **Secret:** El valor
4. Click `Add secret`

### Método CLI (GitHub CLI)

```bash
# Instalar gh CLI
brew install gh  # macOS
# o
curl -sS https://webi.sh/gh | sh  # Linux

# Login
gh auth login

# Agregar secrets
gh secret set JENKINS_USER -b "admin"
gh secret set JENKINS_TOKEN -b "tu_token_aqui"
gh secret set JENKINS_CRUMB -b "tu_crumb_aqui"
```

---

## ✅ Verificar Secrets

### En GitHub UI

1. Ve a: `Settings` → `Secrets and variables` → `Actions`
2. Deberías ver:
   - `JENKINS_USER` ✓
   - `JENKINS_TOKEN` ✓
   - `JENKINS_CRUMB` ✓ (opcional)

### Probar en Workflow

Los secrets están disponibles como:
```yaml
${{ secrets.JENKINS_USER }}
${{ secrets.JENKINS_TOKEN }}
${{ secrets.JENKINS_CRUMB }}
```

---

## 🔄 Secrets para Otros Servicios (Opcional)

Si más adelante necesitas agregar más servicios:

### Resend (Email)
```bash
gh secret set RESEND_API_KEY -b "re_xxxxxxxxxxxxx"
```

### DigitalOcean Container Registry
```bash
gh secret set DO_REGISTRY_TOKEN -b "dop_v1_xxxxxxxxxxxxx"
```

### Discord/Slack Notifications
```bash
gh secret set DISCORD_WEBHOOK -b "https://discord.com/api/webhooks/..."
gh secret set SLACK_WEBHOOK -b "https://hooks.slack.com/services/..."
```

---

## 🧪 Test de CI/CD

Después de configurar los secrets:

1. **Hacer un cambio pequeño:**
   ```bash
   # En tu proyecto local
   cd astro-portfolio
   echo "# Test" >> README.md
   git add README.md
   git commit -m "test: CI/CD"
   git push origin main
   ```

2. **Ver GitHub Actions:**
   - Ve a: `Actions` tab en GitHub
   - Deberías ver el workflow corriendo
   - Verifica que no hay errores de secrets

3. **Verificar Jenkins:**
   - Ve a: http://YOUR_SERVER_IP:8080
   - Verifica que el job se ejecutó

---

## 🐛 Troubleshooting

### Error: "Secret not found"

**Solución:**
1. Verifica que el nombre del secret es exacto (case-sensitive)
2. Verifica que está en el repositorio correcto
3. Re-crea el secret

### Error: "Jenkins authentication failed"

**Solución:**
1. Verifica que `JENKINS_USER` es correcto
2. Regenera el `JENKINS_TOKEN`:
   - Jenkins → Usuario → Configure → API Token → Revoke all → Add new
3. Actualiza el secret en GitHub

### Error: "Invalid crumb"

**Solución:**
1. Obtén un nuevo crumb:
   ```bash
   curl -u 'USER:TOKEN' 'http://YOUR_SERVER_IP:8080/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,":",//crumb)'
   ```
2. Actualiza `JENKINS_CRUMB` en GitHub
3. O comenta la línea del crumb en `.github/workflows/deploy.yml`

---

## 📝 Checklist Final

- [ ] `JENKINS_USER` configurado
- [ ] `JENKINS_TOKEN` configurado
- [ ] `JENKINS_CRUMB` configurado (opcional)
- [ ] Secrets verificados en GitHub
- [ ] Test push realizado
- [ ] GitHub Actions ejecutándose correctamente
- [ ] Jenkins recibiendo trigger
- [ ] Deploy funcionando

---

## 🔒 Seguridad de Secrets

### Buenas Prácticas

✅ **DO:**
- Rotar tokens regularmente
- Usar tokens con mínimos permisos necesarios
- No compartir tokens en chat/email
- Revocar tokens viejos

❌ **DON'T:**
- Nunca commitear secrets al código
- No compartir secrets en screenshots
- No usar mismo token para múltiples servicios
- No usar contraseñas, usa tokens

### Rotar Tokens

**Cada 3-6 meses:**
1. Genera nuevo token en Jenkins
2. Actualiza secret en GitHub
3. Verifica que funciona
4. Revoca token viejo

---

## 📞 Ayuda

Si tienes problemas:

1. Verifica los logs de GitHub Actions
2. Verifica los logs de Jenkins
3. Revisa la documentación:
   - [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
   - [Jenkins API Token](https://www.jenkins.io/doc/book/system-administration/authenticating-scripted-clients/)

---

**Última actualización:** Enero 2026
