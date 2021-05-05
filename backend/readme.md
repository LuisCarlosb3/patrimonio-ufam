### Arquitetura do Projeto

Baseado no conceito de Clean Architeture, a estrutura deste projeto se apresenta da seguinte maneira:

 - **Data:**
Camada onde são implementados os casos de uso do usuário
 - **Domain:**
Camada onde os modelos de dominio são especificados
 - **Infra:**
Camada de alto desacoplamento, repositoórios com banco de dados, serviços de email e outras bibliotecas são utilizadas nessa camada
 - **Main:**
Camada de alto nivel, onde os modulos são ligados, responsável por gerenciar a execução dos serviços
 - **Presentation**
Camada de entrada onde os dados são tratados, gerenciando as chamadas e as informações solicitadas

A arquitetura é definida com base no livro [Clean Architeture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
***

### Exemplificação da estrutura

 - Na estrutura deste projeto, a camada **Main** executa a aplicação e recebe as requisições nas rotas, cada rota é tratada por um controler ajustado na camada **Presentaion**, realizando as validações de dados necessárias, consultas que impliquem em especificações relacionadas as regras de negócio ou casos de uso especificos são implementados na camada **Data**, que pode ou não realizar chamadas à camada **Infra**, para possiveis consultas a bancos de dados, envio de emails, etc.
 
 - As pastas com nome de **protocols** especificam interfaces a serem utilizadas por implementações. Por exemplo o protocol **http-controller** especifica a interface que deve sem implementada por controllers utilizados para receber requisições HTTP


### Dependências de desenvolvedor:

 - [**eslit**](https://eslint.org/)
 Pacote utilizado para estilizar o código fonte
 - [**typescript**](https://www.typescriptlang.org/)
 Typescript foi selecionado para ajudar durante o projeto, garantindo a tipagem das estruturas
 - [**jest**](https://jestjs.io/)
 Utlizado para construir testes
 - [**husky**](https://www.npmjs.com/package/husky)
 Husky é um hook que valida se não há erros no código e evita que erros sejam enviados para o repositório
 - [**lint-staged**](https://github.com/okonet/lint-staged)
 Lint-staged verifica e corrige problemas com erros no estilo do código antes de realizar um commit, utilizando junto ao husky
 - [**git-commit-msg-linter**](https://www.npmjs.com/package/git-commit-msg-linter)
 Utilizando para padronizar as mensagens dos commits com base na metodologia "small commits", commits fora do padrão serão rejeitados, (verificar [conventional commits](https://www.conventionalcommits.org/pt-br/v1.0.0-beta.4/))

***
