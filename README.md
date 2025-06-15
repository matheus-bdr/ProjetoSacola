# SACOLA

Projeto de extensão desenvolvido para a disciplina de **Programação WEB**.

## Índice

- [Descrição](#descrição)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
  - [Banco de Dados](#banco-de-dados)
  - [Backend](#backend)
  - [Frontend](#frontend)

## Descrição

O projeto **SACOLA** é um sistema web desenvolvido para fins educacionais, utilizando tecnologias modernas de frontend e backend. Ele simula um sistema básico com funcionalidades integradas entre cliente e servidor.

## Tecnologias Utilizadas

- **Node.js** com **Express** para o backend
- **React.js** para o frontend
- **MariaDB** como banco de dados

## Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

Além disso, um editor de código como o [VS Code](https://code.visualstudio.com/) é recomendado.

## Instalação e Execução

### Banco de Dados

1. Caso não tenha o banco instalado local, você pode criar um container docker executando o comando abaixo para iniciar o banco de dados, é importante ressaltar que o Docker tem que estar aberto e o comando deve ser rodado em uma pasta geral:
```bash
docker run --rm -d --name mariadb -p 3306:3306 --env MARIADB_ROOT_PASSWORD=password mariadb:latest
```
2. Caso esteja dando problema, você pode recorrer a 2 soluções, parar manualmente o MySQL apertando Windows + R, digitando "services.msc", parando o MySQL e rodar o código acima novamente. Se mesmo assim não estiver funcionando, rode o pare o Container no Docker, rode o código acima novamente.

3. Importe o arquivo de schema para criar as tabelas ou abra o Dbeaver, conecte no banco com as credenciais e rode o script SQL (ProjetoSacola\sacola\src\schema.sql):

```bash
mysql -u root -p -h 0.0.0.0 < src/schema.sql
```

### Backend

1. Navegue até a pasta do projeto sacola no terminal:
```bash
cd sacola
```
2. Instale as dependências:
```bash
npm install
```
3. Inicie o servidor backend:
```bash
npm run dev
```
A API estará disponível em: http://localhost:3001.

### Frontend

1. Ainda na pasta sacola, inicie o servidor frontend:

```bash
npm run start
```

O frontend estará disponível em: http://localhost:3000.