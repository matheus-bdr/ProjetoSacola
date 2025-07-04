CREATE DATABASE IF NOT EXISTS sacola;
USE sacola;

-- Tabela de Produto
CREATE TABLE IF NOT EXISTS produto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    quantidade_disponivel INT NOT NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1 -- Ativo (1=ativo, 0=inativo)
);

-- Tabela de Usuário
CREATE TABLE IF NOT EXISTS usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(255),
    telefone VARCHAR(20),
    cpf VARCHAR(11) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    administrador TINYINT(1) DEFAULT 0
);

-- Tabela de Cliente
CREATE TABLE IF NOT EXISTS cliente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(255),
    email VARCHAR(255),
    telefone VARCHAR(20),
    cpf VARCHAR(11) NOT NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 1 -- Ativo (1=ativo, 0=inativo)
);

-- Tabela de Movimentação
CREATE TABLE IF NOT EXISTS movimentacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    produto_id INT NOT NULL,
    cliente_id INT NOT NULL,
    tipo ENUM('ENTRADA', 'SAIDA') NOT NULL,
    quantidade INT NOT NULL,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
