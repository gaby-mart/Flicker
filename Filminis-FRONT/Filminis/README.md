Flicker - Interface Front-end
Interface web moderna desenvolvida em React + Vite com tema Dark Glassmorphism e detalhes em vermelho (#E01414), projetada para consumir a API de gerenciamento de filmes Filminis.

Sobre o Projeto
O Flicker é a aplicação cliente (front-end) que permite aos usuários navegar por um catálogo dinâmico de filmes, gerenciar perfis, submeter novos filmes e requisições de alteração/exclusão. A aplicação possui um painel administrativo integrado para moderação de conteúdo.

Principais funcionalidades da interface:

Autenticação Segura: Telas de login e cadastro integradas com tokens JWT (Access Token e Refresh Token).

Catálogo Interativo: Listagem de filmes com filtros por nome, paginação customizada e cards detalhados.

Modo Usuário Comum: Envio de solicitações de cadastro de novos filmes, além de pedidos de edição e exclusão de filmes existentes (armazenados localmente via localStorage e integrados com o fluxo de moderação).

Painel Administrativo (/request e /management): Exclusivo para administradores, permitindo revisar solicitações pendentes (com conversão automática de IDs em nomes legíveis para categorias, atores, diretores, etc.), aprovar cadastros, executar edições em lote (PATCH) e gerenciar exclusões diretamente no banco de dados.

Tecnologias Utilizadas
React 18+

React Router DOM (Roteamento de páginas)

Vite (Build tool e servidor de desenvolvimento ultrarrápido)

CSS Modules / Global Styles (Estilização customizada em Dark Glassmorphism)

Cloudinary (Upload e hospedagem de imagens de pôsteres)

Local Storage (Persistência auxiliar de solicitações de usuários)

Estrutura do Projeto (Front-end)
Plaintext
src/
├── assets/images       # Imagens e arquivos estáticos
├── components/         # Componentes reutilizáveis (Modais, Cards, Toast, etc.)
│   └── css/            #Estlização dos componentes
    └── jsx/            #Estrutura dos componentes
├── hooks/              # Custom Hooks (ex: useMovieOptions)
├── pages/              # Páginas principais da aplicação
│   ├── Home.jsx        #Pagina default do usuário
│   ├── MovieDetail.jsx #Detalhes do filme selecionado pelo usuário
│   ├── Request.jsx     # Painel de moderação de solicitações do Admin
│   ├── Management.jsx  # Gerenciamento de filmes
│   └── login.jsx       # Login de acesso ao usuário
    └── user.jsx        # Informações pessoais da conta do usuário
├── service/            # Comunicação com a API e manipulação de dados
│   ├── auth.js         # Gerenciamento de tokens e fetch autenticado
│   ├── http.js         # Requisições gerais para listagens e filmes
│   ├── request.js      # LocalStorage e ações do Admin
│   └── upload.js       # Integração com Cloudinary para imagens
├── App.jsx
├── main.jsx
└── index.css

Como Rodar o Projeto
1. Clonar o repositório
Bash
git clone https://github.com/gaby-mart/Flicker
cd seu-repositorio-front
2. Instalar dependências
Certifique-se de ter o Node.js instalado em sua máquina e execute:

Bash
npm install
3. Configurar Variáveis de Ambiente
Na raiz do projeto front-end, crie um arquivo .env baseado no ambiente de desenvolvimento da sua API backend:

Snippet de código
VITE_DATA_URL=http://localhost:8000
Nota: Certifique-se de que o seu back-end (Filminis API) esteja rodando na porta configurada (http://localhost:8000) para que a comunicação da interface ocorra sem erros de CORS ou conexão.

4. Executar o servidor de desenvolvimento
Bash
npm run dev
O projeto estará disponível por padrão em:

Detalhes: Clique em um filme para ver sinopse, duração, orçamento, atores, diretores e gêneros.

Solicitar Alterações: Caso encontre inconsistências, utilize os botões de Editar ou Excluir na página de detalhes. O pedido será registrado de forma segura.

Para Administradores (Admin)
Acessar Painel de Moderação (/request): O administrador visualiza todas as solicitações pendentes de edição e exclusão enviadas pelos usuários.

Conversão Automática de Dados: Os IDs numéricos de categorias, produtoras, diretores, atores, países e linguagens são automaticamente traduzidos para os seus respectivos nomes legíveis na tela de revisão.

Execução de Ações: Ao clicar em Aceitar, o sistema consome os endpoints seguros do back-end (PUT /filme/aprovar, PATCH /filme ou DELETE /filme), aplicando as mudanças diretamente no banco de dados MySQL.