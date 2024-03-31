# Aplicativo Móvel para Controle de Gastos Pessoais

Este projeto visa desenvolver um aplicativo móvel utilizando React-Native para dispositivos Android, permitindo aos usuários gerenciar seus gastos pessoais de maneira eficiente. Através da utilização da API do Firebase para persistência de dados e autenticação de usuários, o aplicativo oferece uma plataforma segura e confiável para que os usuários possam acompanhar e controlar seus gastos.

## Funcionalidades

### Autenticação de Usuário
- Os usuários podem se cadastrar, fazer login e logout utilizando a autenticação fornecida pelo Firebase.

### Listagem de Gastos
- Visualizar todos os gastos registrados, incluindo descrição, valor e categoria.

### Adicionar Gasto
- Os usuários podem adicionar novos gastos, especificando descrição, valor e selecionando uma categoria pré-estabelecida.
- Validação de entrada é aplicada; todos os campos são obrigatórios e o valor deve ser estritamente maior que R$0,00.

### Editar Gasto
- É possível editar registros de gastos existentes, permitindo alterações em descrições, valores e categorias.

### Remover Gasto
- Os usuários podem excluir gastos desnecessários de seus registros.

### Listar Categorias
- Acesso a uma lista de categorias pré-definidas para classificar os gastos, melhorando a organização e análise.
- O aplicativo inclui uma tabela estática de categorias, com funcionalidades para adicionar e editar novas categorias.
- Três categorias iniciais são definidas e não podem ser modificadas pelo usuário.

### Navegação por Drawer
- Os usuários podem buscar gastos utilizando palavras-chave ou termos específicos.

### Filtragem e Busca de Gastos
- Filtrar gastos baseando-se em vários critérios como categoria, período de tempo ou valor.
- Buscar por gastos utilizando palavras-chave ou termos específicos.

### Tela Estatística
- O aplicativo dispõe de uma tela de estatísticas que exibe informações como gastos totais, média de gastos por categoria e análise gráfica dos gastos ao longo do tempo.

### Visualização de Informação
- Exibir dados utilizando pelo menos dois tipos diferentes de gráficos.

## Persistência de Dados e Autenticação de Usuários
- O aplicativo utiliza os serviços do Firebase para todas as operações relacionadas à persistência de dados e autenticação de usuários, garantindo segurança e confiabilidade.

## Notas
- Cada funcionalidade contribui com 1,0 pontos para a média do primeiro semestre.
- Para alunos que realizam projeto integrado, a pontuação vai do item 1 ao item 7 da lista de funcionalidades.
