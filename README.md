# API Dicionário

Esta API fornece diversos endpoints para consultar palavras a partir de um arquivo JSON. É possível consultar se uma palavra existe, pesquisar por prefixo, infixo e sufixo, obter uma palavra aleatória (com ou sem tamanho específico) e realizar pesquisas avançadas utilizando múltiplos critérios.

## Funcionalidades

- **Checagem de Palavra:** Verifica se uma palavra informada existe.
- **Pesquisa por Prefixo:** Retorna palavras que começam com o prefixo especificado.
- **Pesquisa por Infixo:** Retorna palavras que contém um trecho (infixo) informado.
- **Pesquisa por Sufixo:** Retorna palavras que terminam com o sufixo informado.
- **Palavra Aleatória:** Retorna uma palavra aleatória, podendo ser filtrada por tamanho.
- **Pesquisa Avançada:** Permite buscar palavras que satisfaçam, ao mesmo tempo, condições de prefixo, infixo, sufixo e comprimento mínimo e máximo.

## Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 12 ou superior)

## Como Utilizar
   
   - **Raiz (Bem-vindo):**  
     `GET /`  
     Retorna uma mensagem de boas-vindas à API.

   - **Verificar Palavra:**  
     `GET /palavra/:valor`  
     Exemplo:  
     `GET http://localhost:3000/palavra/abacate`  
     Retorna um array com a palavra se ela existir ou um array vazio com status 404 se não existir.

   - **Pesquisar por Prefixo:**  
     `GET /prefixo/:valor`  
     Exemplo:  
     `GET http://localhost:3000/prefixo/aba`  
     Retorna todas as palavras que iniciam com o valor especificado.

   - **Pesquisar por Infixo:**  
     `GET /infixo/:valor`  
     Exemplo:  
     `GET http://localhost:3000/infixo/cat`  
     Retorna todas as palavras que contém o valor especificado.

   - **Pesquisar por Sufixo:**  
     `GET /sufixo/:valor`  
     Exemplo:  
     `GET http://localhost:3000/sufixo/te`  
     Retorna todas as palavras que terminam com o valor especificado.

   - **Palavra Aleatória:**  
     `GET /aleatorio/`  
     Retorna uma palavra aleatória da lista completa.

   - **Palavra Aleatória com Tamanho Específico:**  
     `GET /aleatorio/:tamanho`  
     Exemplo:  
     `GET http://localhost:3000/aleatorio/7`  
     Retorna uma palavra aleatória de tamanho 7, se existir, caso contrário, retorna `undefined`.

   - **Pesquisa Avançada:**  
     `GET /avancado`  
     Aceita os seguintes query parameters:
     
     - `pfx`: Palavra deve começar com este prefixo (padrão `""`)
     - `ifx`: Palavra deve conter este infixo (padrão `""`)
     - `sfx`: Palavra deve terminar com este sufixo (padrão `""`)
     - `min`: Comprimento mínimo (padrão `"0"`)
     - `max`: Comprimento máximo (padrão `"99"`)
     
     Exemplo:  
     ```
     GET http://localhost:3000/avancado?pfx=ab&ifx=ac&sfx=te&min=4&max=8
     ```
     Isso retornará as palavras que começam com "ab", contém "ac", terminam com "te" e possuem um comprimento entre 4 e 8 caracteres.

## Estrutura do Projeto

- **app.js**: Arquivo principal que configura o servidor Express e os endpoints.
- **palavras.json**: Arquivo JSON contendo o array de palavras para a API.
- **package.json**: Arquivo com as dependências e scripts do projeto.

## Melhorias Futuras

- **Validações Adicionais:** Adicionar validação para casos onde o array filtrado fique vazio, retornando mensagens mais descritivas.
- **Testes Automatizados:** Criação de testes unitários para os endpoints.
- **Documentação da API:** Utilizar ferramentas como Swagger para documentar a API e facilitar a integração.

Sinta-se à vontade para contribuir ou abrir issues para melhorias e bugs. Se tiver dúvidas ou sugestões, entre em contato!

Enjoy coding!
