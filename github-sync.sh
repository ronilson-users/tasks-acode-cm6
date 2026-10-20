#!/data/data/com.termux/files/usr/bin/bash

# =====================================
# 🚀 AUTOMAÇÃO DE SINCRONIZAÇÃO GITHUB
# Compatível Termux / Android
# =====================================

set -e  # Parar em caso de erro

# =====================================
# 🔧 Configuração Inicial
# =====================================
GITHUB_USERNAME="ronilson-users"
REPO_NAME="tasks-acode-cm6"
PROJECT_DIR="/data/data/com.termux/files/home/DEV/Acode_Cm6/CLONE_GIT/tasks-acode-cm6"
GITHUB_EMAIL="ronilson.stos@gmail.com"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funções de logging
log_info() { echo -e "${BLUE}ℹ️ $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# =====================================
# 📁 Verificar/Criar Diretório
# =====================================
if [ ! -d "$PROJECT_DIR" ]; then
    log_error "Diretório não encontrado: $PROJECT_DIR"
    log_info "Criando diretório..."
    mkdir -p "$PROJECT_DIR" || {
        log_error "Falha ao criar diretório"
        exit 1
    }
fi

cd "$PROJECT_DIR" || {
    log_error "Falha ao acessar diretório"
    exit 1
}

log_info "📁 Diretório: $(pwd)"
log_info "🚀 Iniciando sincronização: $REPO_NAME"

# =====================================
# 🔐 Obter Token GitHub
# =====================================
if [ -n "$1" ]; then
    GITHUB_TOKEN="$1"
    log_info "🔑 Token recebido via argumento."
else
    log_info "🔑 Digite seu token GitHub:"
    read -s GITHUB_TOKEN
    echo
fi

if [ -z "$GITHUB_TOKEN" ]; then
    log_error "Token vazio. Abortando."
    exit 1
fi

# Verificar formato
if [[ ! "$GITHUB_TOKEN" =~ ^(ghp_|github_pat_) ]]; then
    log_error "Token inválido. Formato esperado: ghp_... ou github_pat_..."
    exit 1
fi

# =====================================
# 🔍 Testar Token
# =====================================
log_info "🔍 Verificando token GitHub..."
USER_CHECK=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    https://api.github.com/user)

if echo "$USER_CHECK" | grep -q '"login":'; then
    USERNAME=$(echo "$USER_CHECK" | grep -o '"login": *"[^"]*"' | cut -d'"' -f4)
    log_success "Token válido para: $USERNAME"
else
    log_error "Token inválido ou sem conexão."
    exit 1
fi

# =====================================
# ⚙️ Configurar Git
# =====================================
log_info "⚙️ Configurando Git..."

if [ ! -d .git ]; then
    log_info "🆕 Inicializando novo repositório Git..."
    git init
fi

git config user.name "$GITHUB_USERNAME"
git config user.email "$GITHUB_EMAIL"

# Configurar remote
REMOTE_URL="https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
REMOTE_URL_CLEAN="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "$REMOTE_URL"
else
    git remote add origin "$REMOTE_URL"
fi

# =====================================
# 📝 Criar Repositório no GitHub
# =====================================
log_info "🔍 Verificando repositório no GitHub..."
REPO_CHECK=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
    "https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}")

if ! echo "$REPO_CHECK" | grep -q '"name":'; then
    log_info "🆕 Criando repositório no GitHub..."
    curl -s -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        https://api.github.com/user/repos \
        -d "{\"name\":\"$REPO_NAME\",\"private\":false}" > /dev/null
    log_success "Repositório criado: $REPO_NAME"
fi

# =====================================
# 📄 Criar Arquivos Padrão
# =====================================
if [ ! -f README.md ]; then
    log_info "📄 Criando README.md..."
    cat > README.md << 'EOF'
# $REPO_NAME

## 📌 Sobre
Projeto sincronizado automaticamente via Termux.

## 🚀 Como Usar
1. Clone o repositório
2. Faça suas alterações
3. Execute o script de sincronização
EOF
    log_success "README.md criado"
fi

if [ ! -f .gitignore ]; then
    log_info "📄 Criando .gitignore..."
    cat > .gitignore << 'EOF'
node_modules/
.env
dist/
*.log
EOF
    log_success ".gitignore criado"
fi

# =====================================
# 💾 Commit e Push
# =====================================
log_info "📤 Preparando commit..."
git add -A

if git diff --cached --quiet; then
    log_warning "Nenhuma mudança para commitar."
else
    COMMIT_MSG="✨ Sync automático: $(date '+%d/%m/%Y %H:%M')"
    git commit -m "$COMMIT_MSG"
    log_success "Commit criado: $COMMIT_MSG"
fi

# Garantir branch main
git branch -M main

log_info "🚀 Enviando para GitHub..."
git push -u origin main
log_success "Push concluído!"

# =====================================
# 🔒 Limpeza de Segurança
# =====================================
git remote set-url origin "$REMOTE_URL_CLEAN"
unset GITHUB_TOKEN

# =====================================
# 🎉 Conclusão
# =====================================
echo ""
echo "===================================="
echo "🎉 SINCRONIZAÇÃO CONCLUÍDA!"
echo "🌍 Repositório: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo "⏰ Feito em: $(date '+%d/%m/%Y %H:%M')"
echo "===================================="