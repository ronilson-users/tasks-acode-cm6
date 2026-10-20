#!/data/data/com.termux/files/usr/bin/bash

set -e  # Sai automaticamente em caso de erro

echo "🚀 Instalando cz e cz-customizable..."
if ! npm install --save-dev commitizen cz-customizable; then
    echo "❌ Erro na instalação do npm"
    exit 1
fi

echo "📦 Criando arquivo cz-config.js..."
cat > cz-config.js <<'EOF'
module.exports = {
  types: [
    { value: "feat",     name: "feat:     ✨ Uma nova funcionalidade" },
    { value: "fix",      name: "fix:      🐛 Correção de bugs" },
    { value: "docs",     name: "docs:     📚 Apenas documentação" },
    { value: "style",    name: "style:    💄 Formatação, ponto e vírgula etc" },
    { value: "refactor", name: "refactor: 🔧 Refatoração sem alteração funcional" },
    { value: "test",     name: "test:     ✅ Adição ou correção de testes" },
    { value: "chore",    name: "chore:    📦 Mudanças em build ou ferramentas" },
    { value: "perf",     name: "perf:     ⚡ Melhorias de performance" },
    { value: "ci",       name: "ci:       🔄 Mudanças na CI/CD" }
  ],
  messages: {
    type: "Selecione o tipo de alteração:",
    scope: "Escopo (opcional):",
    subject: "Escreva uma descrição breve (imperativa):",
    body: "Descrição mais detalhada (opcional). Use | para nova linha:",
    footer: "Issues relacionadas (opcional):",
    confirmCommit: "Deseja prosseguir com o commit acima?"
  },
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['footer'],
  subjectLimit: 72,
  breaklineChar: '|'
};
EOF

echo "🛠️ Atualizando package.json com config cz..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado!"
    echo "📝 Criando package.json básico..."
    npm init -y
fi

node -e "
const fs = require('fs');
try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.commit = 'cz';
    pkg.config = pkg.config || {};
    pkg.config.commitizen = { 
        path: './node_modules/cz-customizable' 
    };
    pkg.config['cz-customizable'] = {
        config: 'cz-config.js'
    };
    
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    console.log('✅ package.json atualizado com sucesso!');
} catch (error) {
    console.error('❌ Erro ao atualizar package.json:', error.message);
    process.exit(1);
}
"

# Criar .gitignore se não existir
if [ ! -f ".gitignore" ]; then
    echo "📦 Criando arquivo .gitignore..."
    cat > .gitignore <<'EOF'
node_modules/
.DS_Store
*.log
.env
.env.local
.env.production
dist/
build/
.coverage
.nyc_output
EOF
    echo "✅ .gitignore criado com sucesso!"
else
    echo "📁 .gitignore já existe, mantendo o atual"
fi

# Verifica se é um repositório git
if [ ! -d ".git" ]; then
    echo "⚠️  Diretório .git não encontrado. Inicializando repositório..."
    git init
fi

echo ""
echo "✅ Commitizen configurado com sucesso!"
echo ""
echo "📘 COMO USAR:"
echo "1. Adicione arquivos: git add ."
echo "2. Execute: npm run commit"
echo "3. Ou use diretamente: npx cz"
echo ""
echo "💡 DICA: Seja sempre Produtivo 🚀"
