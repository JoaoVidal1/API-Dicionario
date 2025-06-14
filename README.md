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

- [Node.js](https://nodejs.org/en/) (versão 14 ou superior)
- Arquivo `dictionary.json` contendo um array de palavras no diretório raiz

## Instalação

1. Clone o repositório
2. Execute `npm install` para instalar as dependências
3. Certifique-se de que o arquivo `dictionary.json` está presente no diretório raiz
4. Execute `node app.js` para iniciar o servidor

## Endpoints da API

### **Raiz (Bem-vindo):**
`GET /`  
Retorna uma mensagem de boas-vindas à API.

**Resposta:**
```
Welcome to the dictionary API
```

### **Verificar Palavra:**
`GET /word/:value`  
Exemplo: `GET http://localhost:3000/word/abacate`  

**Resposta de Sucesso (200):**
```json
["abacate"]
```

**Resposta de Erro (404):**
```json
[]
```

### **Pesquisar por Prefixo:**
`GET /prefix/:value`  
Exemplo: `GET http://localhost:3000/prefix/aba`  

**Resposta de Sucesso (200):**
```json
["abacate", "abacaxi", "abandono"]
```

**Resposta de Erro (404):**
```json
[]
```

### **Pesquisar por Infixo:**
`GET /infix/:value`  
Exemplo: `GET http://localhost:3000/infix/cat`  

**Resposta de Sucesso (200):**
```json
["abacate", "educativo", "indicativo"]
```

**Resposta de Erro (404):**
```json
[]
```

### **Pesquisar por Sufixo:**
`GET /suffix/:value`  
Exemplo: `GET http://localhost:3000/suffix/te`  

**Resposta de Sucesso (200):**
```json
["abacate", "importante", "presente"]
```

**Resposta de Erro (404):**
```json
[]
```

### **Palavra Aleatória:**
`GET /aleatorio/`  
Retorna uma palavra aleatória da lista completa.

**Resposta de Sucesso (200):**
```json
"exemplo"
```

### **Palavra Aleatória com Tamanho Específico:**
`GET /aleatorio/:length`  
Exemplo: `GET http://localhost:3000/aleatorio/7`  

**Resposta de Sucesso (200):**
```json
"exemplo"
```

**Resposta de Erro (404) - Nenhuma palavra encontrada:**
```json
{
  "error": "No words found with length 7"
}
```

**Resposta de Erro (400) - Parâmetro inválido:**
```json
{
  "error": "Invalid Parameter: 'length' must be a positive integer."
}
```

### **Pesquisa Avançada:**
`GET /advanced`  

Aceita os seguintes query parameters:
- `pfx`: Palavra deve começar com este prefixo (padrão `""`)
- `ifx`: Palavra deve conter este infixo (padrão `""`)  
- `sfx`: Palavra deve terminar com este sufixo (padrão `""`)
- `min`: Comprimento mínimo (padrão `"0"`)
- `max`: Comprimento máximo (padrão `"99"`)

**Exemplo:**
```
GET http://localhost:3000/advanced?pfx=ab&ifx=ac&sfx=te&min=4&max=8
```

**Resposta de Sucesso (200):**
```json
["abacate"]
```

**Resposta de Erro (400) - Parâmetros inválidos:**
```json
{
  "error": "Parameters 'min' or 'max' are invalid."
}
```

## Estrutura do Projeto

- **app.js**: Arquivo principal que configura o servidor Express e os endpoints.
- **dictionary.json**: Arquivo JSON contendo o array de palavras para a API.
- **package.json**: Arquivo com as dependências e scripts do projeto.

## Formato do Arquivo dictionary.json

O arquivo deve conter um array de strings com as palavras:

```json
[
  "abacate",
  "abacaxi", 
  "abandono",
  "exemplo",
  "palavra"
]
```

## Observações Importantes

- Todas as consultas são convertidas para minúsculas automaticamente
- A API retorna status 404 quando nenhuma palavra é encontrada nos endpoints de busca
- O endpoint `/aleatorio/` pode retornar `undefined` se o dicionário estiver vazio
- Parâmetros de comprimento devem ser números inteiros positivos

## Melhorias Futuras

- **Validações Adicionais:** Adicionar validação para casos onde o array filtrado fique vazio, retornando mensagens mais descritivas.
- **Testes Automatizados:** Criação de testes unitários para os endpoints.
- **Documentação da API:** Utilizar ferramentas como Swagger para documentar a API e facilitar a integração.

Sinta-se à vontade para contribuir ou abrir issues para melhorias e bugs. Se tiver dúvidas ou sugestões, entre em contato!

Enjoy coding!
