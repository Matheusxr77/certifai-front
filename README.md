**CertifAI** - Certificação e Autenticação Inteligente 🚀

---

# CertifAI Front-end

CertifAI é uma aplicação web moderna desenvolvida em React que oferece funcionalidades relacionadas à certificação e autenticação de usuários. O projeto utiliza uma arquitetura baseada em componentes com padrão MVC e integração com APIs externas.

## 👥 Equipe

- [Luana Vitória](https://github.com/LuBrito371)
- [Matheus Marcos](https://github.com/Matheusxr77)
- [Mayara Karoline](https://github.com/mayeufraferreira)

## 🚀 Tecnologias Utilizadas

### Core
- **React 18+** - Biblioteca principal para construção da interface
- **Vite** - Ferramenta de build e desenvolvimento ultrarrápida
- **TypeScript** - Superset do JavaScript para tipagem estática
- **React Router DOM** - Roteamento de páginas SPA
- **CSS3** - Estilização customizada

### Bibliotecas e Dependências
- **React Icons (Feather Icons)** - Biblioteca de ícones
- **React Hooks** - Gerenciamento de estado e efeitos
- **Google OAuth** - Autenticação social com Google

## 📁 Estrutura do Projeto

```
src/
├── assets/
│   └── images/           # Imagens e recursos estáticos
├── components/           # Componentes reutilizáveis
│   └── UnderConstruction/
│       ├── index.tsx     # Componente de view
│       ├── indexController.ts  # Lógica de negócio
│       ├── indexModel.ts # Tipos e interfaces
│       └── styles.css    # Estilos do componente
├── pages/               # Páginas da aplicação
│   ├── register/
│   │   ├── index.tsx
│   │   ├── indexController.tsx
│   │   ├── indexModel.tsx
│   │   └── styles.css
│   └── dashboard/       # Outras páginas
└── ...
```

## 🏗️ Arquitetura

O projeto segue uma arquitetura baseada no padrão **MVC (Model-View-Controller)**:

- **Model** (`indexModel.ts`) - Interfaces, tipos e estruturas de dados
- **View** (`index.tsx`) - Componentes React e renderização
- **Controller** (`indexController.ts`) - Lógica de negócio e gerenciamento de estado

### Características Arquiteturais
- **Componentes Funcionais** - Uso exclusivo de hooks
- **Custom Hooks** - Controladores como hooks customizados
- **TypeScript Strict** - Tipagem rigorosa em todo o projeto
- **Separação de Responsabilidades** - Cada arquivo tem uma responsabilidade específica

## 🔧 Funcionalidades

### Autenticação
- ✅ Registro de usuários
- ✅ Login tradicional (email/senha)
- ✅ Integração com Google OAuth
- ✅ Validação de formulários em tempo real
- ✅ Diferentes perfis de usuário
- ✅ Cadastro de certificações
- ✅ Cadastro de questões
- ✅ Montagem de calendário de estudos

### Interface
- ✅ Design responsivo
- ✅ Componentes reutilizáveis
- ✅ Páginas "Em Construção" animadas
- ✅ Navegação fluida entre páginas
- ✅ Feedback visual para ações do usuário

## 📋 Pré-requisitos

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 ou **yarn** >= 1.22.0
- **Git** para controle de versão

## 🚀 Como Executar

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/certifai-front.git
cd certifai-front
```

### 2. Instale as dependências
```bash
# Com npm
npm install

# Com yarn
yarn install
```

### 3. Execute o projeto
```bash
# Modo desenvolvimento
npm run dev
# ou
yarn run dev

# O projeto estará disponível em http://localhost:5173
```

## 🌐 Deploy

A aplicação está configurada para deploy no Vercel: (certifai-front-ruby.vercel.app)

## 📱 Responsividade

O projeto é totalmente responsivo e otimizado para:
- 📱 **Mobile** - 320px+
- 📱 **Tablet** - 768px+
- 💻 **Desktop** - 1024px+
- 🖥️ **Large Desktop** - 1440px+

### Padrões de Código
- Use TypeScript para todos os novos arquivos
- Siga o padrão MVC para novos componentes
- Mantenha os testes atualizados
- Use nomes descritivos para variáveis e funções
- Documente funções complexas
