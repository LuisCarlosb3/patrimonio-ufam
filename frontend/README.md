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

---
