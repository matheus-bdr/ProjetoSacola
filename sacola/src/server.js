const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Conexão com o banco de dados
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'sacola'
});

// Configurações do CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS', 'DELETE'],
  preflightContinue: true
};

app.use(cors(corsOptions));
app.use(express.json());

// ==============================
// CRUD PRODUTO
// ==============================

app.post('/api/produto', (req, res) => {
  const { nome, codigo, preco, quantidade_disponivel } = req.body;
  const query = `INSERT INTO produto (nome, codigo, preco, quantidade_disponivel, ativo) VALUES (?, ?, ?, ?, 1)`;

  connection.execute(query, [nome, codigo, preco, quantidade_disponivel], (err, results) => {
    if (err) {
      console.error('Erro ao inserir o produto:', err);
      res.status(500).send(`Erro ao inserir o produto. ${err}`);
      return;
    }
    res.json({ mensagem: 'Produto cadastrado com sucesso', itens: results });
  });
});

app.get('/api/produto', (req, res) => {
  const codigo = req.query.codigo;
  let query = "SELECT * FROM produto where ativo=1";
  const params = [];

  if (codigo) {
    query += " and codigo = ?";
    params.push(codigo);
  }

  connection.execute(query, params, (err, results) => {
    if (err) {
      console.error('Erro ao buscar produtos:', err);
      res.status(500).send('Erro ao buscar produtos.');
      return;
    }
    res.json({ itens: results });
  });
});

app.get('/api/produto/:id', (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM produto WHERE id = ?`;

  connection.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar produto:', err);
      res.status(500).send('Erro ao buscar produto.');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Produto não encontrado.');
    } else {
      res.json({ itens: results });
    }
  });
});

app.patch('/api/produto/:id', (req, res) => {
  const id = req.params.id;
  const { nome, codigo, preco, quantidade_disponivel } = req.body;
  const query = `UPDATE produto SET nome = ?, codigo = ?, preco = ?, quantidade_disponivel = ? WHERE id = ?`;

  connection.execute(query, [nome, codigo, preco, quantidade_disponivel, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar produto:', err);
      res.status(500).send(`Erro ao atualizar produto. ${err}`);
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Produto não encontrado.');
    } else {
      res.json({ mensagem: 'Produto atualizado com sucesso', itens: results });
    }
  });
});

app.delete('/api/produto/:id', (req, res) => {
  const id = req.params.id;
  const query = `UPDATE produto SET ativo = 0 WHERE id = ?`;

  connection.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar produto:', err);
      res.status(500).send('Erro ao deletar produto.');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Produto não encontrado.');
    } else {
      res.send('Produto deletado com sucesso.');
    }
  });
});

// ==============================
// CRUD CLIENTE
// ==============================

app.post('/api/cliente', (req, res) => {
  const { nome, endereco, email, telefone, cpf } = req.body;
  const query = `INSERT INTO cliente (nome, endereco, email, telefone, cpf, ativo) VALUES (?, ?, ?, ?, ?,1)`;

  connection.execute(query, [nome, endereco, email, telefone, cpf], (err, results) => {
    if (err) {
      console.error('Erro ao inserir cliente:', err);
      res.status(500).send(`Erro ao inserir cliente. ${err}`);
      return;
    }
    res.json({ mensagem: 'Cliente cadastrado com sucesso', itens: results });
  });
});

app.get('/api/cliente', (req, res) => {
  const email = req.query.email;
  let query = "SELECT * FROM cliente";
  const params = [];

  if (email) {
    query += " WHERE email = ?";
    params.push(email);
  }

  connection.execute(query, params, (err, results) => {
    if (err) {
      console.error('Erro ao buscar clientes:', err);
      res.status(500).send('Erro ao buscar clientes.');
      return;
    }
    res.json({ itens: results });
  });
});

app.get('/api/cliente/:id', (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM cliente WHERE id = ? and ativo=1`;

  connection.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar cliente:', err);
      res.status(500).send('Erro ao buscar cliente.');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Cliente não encontrado.');
    } else {
      res.json({ itens: results });
    }
  });
});

app.patch('/api/cliente/:id', (req, res) => {
  const id = req.params.id;
  const { nome, endereco, email, telefone, cpf } = req.body;
  const query = `UPDATE cliente SET nome = ?, endereco = ?, email = ?, telefone = ?, cpf = ? WHERE id = ?`;

  connection.execute(query, [nome, endereco, email, telefone, cpf, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar cliente:', err);
      res.status(500).send(`Erro ao atualizar cliente. ${err}`);
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Cliente não encontrado.');
    } else {
      res.json({ mensagem: 'Cliente atualizado com sucesso', itens: results });
    }
  });
});

app.delete('/api/cliente/:id', (req, res) => {
  const id = req.params.id;
  const query = `UPDATE cliente SET ativo = 0 WHERE id = ?`;

  connection.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar cliente:', err);
      res.status(500).send('Erro ao deletar cliente.');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Cliente não encontrado.');
    } else {
      res.send('Cliente deletado com sucesso.');
    }
  });
});

// ==============================
// CRUD MOVIMENTAÇÃO COM CONTROLE DE ESTOQUE
// ==============================

app.post('/api/movimentacao', (req, res) => {
  const { produto_id, cliente_id, tipo, quantidade, data } = req.body;

  if (!produto_id || !cliente_id || !tipo || quantidade == null || !data) {
    return res.status(400).send('Dados incompletos para cadastro de movimentação.');
  }

  const insertQuery = `INSERT INTO movimentacao (produto_id, cliente_id, tipo, quantidade, data) VALUES (?, ?, ?, ?, ?)`;

  connection.beginTransaction(err => {
    if (err) {
      console.error('Erro ao iniciar transação:', err);
      return res.status(500).send('Erro ao processar movimentação.');
    }

    connection.execute(insertQuery, [produto_id, cliente_id, tipo, quantidade, data], (err, results) => {
      if (err) {
        return connection.rollback(() => {
          console.error('Erro ao inserir movimentação:', err);
          res.status(500).send('Erro ao inserir movimentação.');
        });
      }

      const selectProduto = 'SELECT quantidade_disponivel FROM produto WHERE id = ?';

      connection.execute(selectProduto, [produto_id], (err, rows) => {
        if (err) {
          return connection.rollback(() => {
            console.error('Erro ao buscar produto:', err);
            res.status(500).send('Erro ao buscar produto.');
          });
        }

        if (rows.length === 0) {
          return connection.rollback(() => {
            res.status(404).send('Produto não encontrado.');
          });
        }

        let quantidadeAtual = rows[0].quantidade_disponivel;
        let novaQuantidade;

        if (tipo.toLowerCase() === 'entrada') {
          novaQuantidade = quantidadeAtual + quantidade;
        } else if (tipo.toLowerCase() === 'saida') {
          if (quantidade > quantidadeAtual) {
            return connection.rollback(() => {
              res.status(400).send('Quantidade insuficiente no estoque para saída.');
            });
          }
          novaQuantidade = quantidadeAtual - quantidade;
        } else {
          return connection.rollback(() => {
            res.status(400).send('Tipo de movimentação inválido. Use "entrada" ou "saida".');
          });
        }

        const updateProduto = 'UPDATE produto SET quantidade_disponivel = ? WHERE id = ?';

        connection.execute(updateProduto, [novaQuantidade, produto_id], (err) => {
          if (err) {
            return connection.rollback(() => {
              console.error('Erro ao atualizar estoque do produto:', err);
              res.status(500).send('Erro ao atualizar estoque do produto.');
            });
          }

          connection.commit(err => {
            if (err) {
              return connection.rollback(() => {
                console.error('Erro ao finalizar transação:', err);
                res.status(500).send('Erro ao finalizar movimentação.');
              });
            }

            res.json({
              mensagem: 'Movimentação registrada e estoque atualizado com sucesso.',
              movimentacao: results,
              estoque_atualizado: { produto_id, novaQuantidade }
            });
          });
        });
      });
    });
  });
});

app.get('/api/movimentacao', (req, res) => {
  const query = `
    SELECT m.*, p.nome AS nome_produto, c.nome AS nome_cliente 
    FROM movimentacao m
    JOIN produto p ON m.produto_id = p.id
    JOIN cliente c ON m.cliente_id = c.id
    ORDER BY m.data DESC`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar movimentações:', err);
      res.status(500).send('Erro ao buscar movimentações.');
      return;
    }
    res.json({ itens: results });
  });
});

app.get('/api/movimentacao/:id', (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM movimentacao WHERE id = ?`;

  connection.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar movimentação:', err);
      res.status(500).send('Erro ao buscar movimentação.');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Movimentação não encontrada.');
    } else {
      res.json({ itens: results });
    }
  });
});

app.delete('/api/movimentacao/:id', (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM movimentacao WHERE id = ?`;

  connection.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar movimentação:', err);
      res.status(500).send('Erro ao deletar movimentação.');
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).send('Movimentação não encontrada.');
    } else {
      res.send('Movimentação deletada com sucesso.');
    }
  });
});

// ==============================
// INICIAR SERVIDOR
// ==============================

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
