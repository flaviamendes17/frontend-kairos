![Banner Kairos](./public/images/banner-kairos.jpg)

# 🕐 **KAIROS** - Sistema de Gerenciamento de Tempo

> *"Kairos" - Do grego antigo, significa "momento certo" ou "tempo oportuno"*

**Kairos** é um sistema moderno e elegante de gerenciamento de tarefas e produtividade, desenvolvido com Next.js 15 e React 19. O projeto foca na organização pessoal, acompanhamento de progresso e análise de desempenho através de insights detalhados.

## ✨ **Características Principais**

- 🎨 **Design Elegante**: Interface com paleta de cores pastéis (roxo, verde, rosa, bege)
- 📊 **Dashboard Interativo**: Visão geral completa do progresso e estatísticas
- 📝 **Gerenciamento de Tarefas**: Sistema completo de criação, edição e acompanhamento
- 📈 **Insights Avançados**: Análises de produtividade e métricas de desempenho
- 👤 **Perfil Personalizado**: Informações pessoais, conquistas e estatísticas
- 🌐 **API Integration**: Conexão com backend com fallback para dados de exemplo
- 📱 **Design Responsivo**: Funciona perfeitamente em todos os dispositivos

## 🚀 **Tecnologias Utilizadas**

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca JavaScript para interfaces
- **CSS Modules** - Estilização organizada e modular
- **Next.js Image** - Otimização automática de imagens
- **Fetch API** - Requisições HTTP com timeout e error handling

## 📁 **Estrutura do Projeto**

```
frontend-kairos/
├── src/
│   └── app/
│       ├── components/
│       │   ├── Navigation.jsx      # Navegação principal
│       │   └── navigation.css      # Estilos da navegação
│       ├── dashboard/              # Página do dashboard
│       ├── tarefas/               # Gerenciamento de tarefas
│       ├── insights/              # Análises e métricas
│       ├── sobre-mim/             # Perfil do usuário
│       ├── globals.css            # Estilos globais
│       ├── kairos.css            # Sistema de design Kairos
│       └── layout.js             # Layout raiz da aplicação
├── public/
│   ├── images/
│   │   └── banner-kairos.jpg     # Banner principal
│   └── icon/
│       ├── ampulheta-kairos.png  # Logo com fundo
│       └── ampulheta-semfundo.png # Logo sem fundo
└── README.md
```

## 🎯 **Funcionalidades**

### 📊 **Dashboard**
- Visão geral das tarefas (pendentes, em andamento, concluídas)
- Gráficos de progresso e produtividade
- Resumo semanal e mensal
- Próximas tarefas e prazos

### 📝 **Tarefas**
- Criação e edição de tarefas
- Sistema de prioridades (Alta, Média, Baixa)
- Status de acompanhamento (Pendente, Em Andamento, Concluída)
- Filtros e ordenação avançada

### 📈 **Insights**
- Análise de produtividade por período
- Métricas de conclusão de tarefas
- Tendências e padrões de trabalho
- Relatórios visuais interativos

### 👤 **Sobre Mim**
- Estatísticas pessoais detalhadas
- Sistema de conquistas e badges
- Histórico de atividades
- Informações de perfil

## 🛠️ **Instalação e Configuração**

### **Pré-requisitos**
- Node.js 18+ 
- npm, yarn, pnpm ou bun

### **1. Clone o repositório**
```bash
git clone <repository-url>
cd frontend-kairos
```

### **2. Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### **3. Execute o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

### **4. Configurar o Backend (Opcional)**
Para funcionalidade completa da API, clone e configure o backend:
```bash
git clone https://github.com/flaviamendes17/backend-kairos.git
cd backend-kairos
# Siga as instruções do README do backend
```

### **5. Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

> **⚠️ Importante**: O sistema funciona com dados de exemplo mesmo sem o backend. Para dados reais, execute o [backend-kairos](https://github.com/flaviamendes17/backend-kairos.git).

## 🌐 **API Integration**

O sistema está configurado para consumir dados da API Kairos:
- **Backend Repository**: [backend-kairos](https://github.com/flaviamendes17/backend-kairos.git)
- **Endpoint**: `http://localhost:3000/api/kairos`
- **Fallback**: Dados de exemplo quando a API não está disponível
- **Timeout**: 5 segundos para requisições
- **Error Handling**: Tratamento robusto de erros de conexão

> 📋 **Nota**: Para funcionalidade completa, clone e execute o [backend-kairos](https://github.com/flaviamendes17/backend-kairos.git) em paralelo.

### **Estrutura de Dados da API**
```json
{
  "message": "API Kairos funcionando",
  "timestamp": "2025-09-09T...",
  "database_connected": true,
  "data": {
    "tasks": {
      "all": [...],
      "pending": [...],
      "in_progress": [...],
      "completed": [...]
    }
  }
}
```

## 🎨 **Sistema de Design**

### **Paleta de Cores**
- **Roxo Pastel**: #B588D4 (Primary)
- **Verde Suave**: #A8D8A8 (Success)  
- **Rosa Claro**: #F4C2C2 (Accent)
- **Bege**: #F5E6D3 (Background)

### **Tipografia**
- Fonte principal otimizada pelo Next.js
- Hierarquia clara de títulos e textos
- Ícones emoji para melhor UX

## 📦 **Scripts Disponíveis**

```bash
npm run dev     # Servidor de desenvolvimento
npm run build   # Build de produção
npm run start   # Servidor de produção
npm run lint    # Verificação de código
```

## 🤝 **Contribuição**

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 **Contato**

- **Projeto**: Kairos - Sistema de Gerenciamento de Tempo
- **Versão**: 1.0.0
- **Framework**: Next.js 15
- **Autor**: Sua equipe de desenvolvimento

---

⭐ **Se este projeto foi útil para você, deixe uma estrela!**
