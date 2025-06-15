import { useState, useEffect } from 'react';
import Axios from "axios";
import '../style/Produto.css';

function Movimentacao() {
    const [values, setValues] = useState({ produto_id: '', cliente_id: '', tipo: '', quantidade: '', data: '', id: null });
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [botaoText, setBotaoText] = useState("Cadastrar Movimentação");

    const changeValues = (value) => {
        setValues(prevValue => ({
            ...prevValue,
            [value.target.name]: value.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!values.produto_id || !values.cliente_id || values.tipo === '' || values.quantidade === '' || !values.data) {
            alert('Preencha todos os campos.');
            return;
        }

        if (!values.id) {
            try {
                await Axios.post("http://localhost:3001/api/movimentacao", {
                    produto_id: parseInt(values.produto_id),
                    cliente_id: parseInt(values.cliente_id),
                    tipo: values.tipo,
                    quantidade: parseInt(values.quantidade),
                    data: values.data
                });

                window.location.reload();
            } catch (error) {
                console.error('Erro no cadastro da movimentação:', error);
                alert('Erro ao cadastrar movimentação.');
            }
        } else {
            try {
                await Axios.patch(`http://localhost:3001/api/movimentacao/${values.id}`, {
                    quantidade: parseInt(values.quantidade)
                });

                window.location.reload();
            } catch (error) {
                console.error('Houve um erro ao atualizar a movimentação', error);
                alert('Erro ao atualizar movimentação.');
            }
        }
    };

    const handleDelete = (id) => {
        const confirmar = window.confirm('Deseja excluir o produto?');
        if (!confirmar) return;
        Axios.delete(`http://localhost:3001/api/movimentacao/${id}`).then(() => {
            alert('Movimentação excluída com sucesso.');
            window.location.reload();
        }).catch((error) => {
            console.error('Erro ao excluir a movimentação:', error);
            alert('Erro ao excluir a movimentação.');
        });
    };

    const handleEdit = (id) => {
        const movimentacaoSelecionada = movimentacoes.find(obj => obj.id === id);

        setValues({
            produto_id: movimentacaoSelecionada.produto_id,
            cliente_id: movimentacaoSelecionada.cliente_id,
            tipo: movimentacaoSelecionada.tipo,
            quantidade: movimentacaoSelecionada.quantidade,
            data: movimentacaoSelecionada.data.split('T')[0],
            id: movimentacaoSelecionada.id
        });

        setBotaoText("Editar Movimentação");
    };

    useEffect(() => {
        // Movimentações
        Axios.get('http://localhost:3001/api/movimentacao')
            .then(response => {
                setMovimentacoes(response.data.itens);
            })
            .catch(error => {
                console.error('Erro ao buscar movimentações:', error);
                alert('API não está disponível');
            });

        // Produtos
        Axios.get('http://localhost:3001/api/produto')
            .then(response => {
                setProdutos(response.data.itens);
            })
            .catch(error => {
                console.error('Erro ao buscar produtos:', error);
                alert('Erro ao buscar produtos');
            });

        // Clientes
        Axios.get('http://localhost:3001/api/cliente')
            .then(response => {
                setClientes(response.data.itens);
            })
            .catch(error => {
                console.error('Erro ao buscar clientes:', error);
                alert('Erro ao buscar clientes');
            });
    }, []);
    const totalEstoque = produtos.reduce((acc, produto) => acc + produto.quantidade_disponivel, 0);
    const totalVendido = movimentacoes.filter(mov => mov.tipo === 'SAIDA').reduce((acc, mov) => acc + mov.quantidade, 0);
    const valorEstoque = produtos.reduce((acc, produto) => acc + (produto.preco * produto.quantidade_disponivel), 0);

    const valorVendido = movimentacoes
        .filter(item => item.tipo === 'SAIDA')
        .reduce((acc, item) => {
            const produto = produtos.find(p => p.id === item.produto_id);
            const preco = produto ? produto.preco : 0;
            return acc + (item.quantidade * preco);
        }, 0);

    const vendaXEstoque = valorEstoque-valorVendido;
    const vendaXEstoque_percentual = ((valorVendido/valorEstoque)*100).toFixed(2);;
    const EstoqueXVenda_percentual = 100-vendaXEstoque_percentual;
    return (
        <div className="container">
            <div className="form-container">
                <div className="nav-bar">
                    <a href="/">Cliente</a>
                    <span>|</span>
                    <a href="/produto">Produto</a>
                    <span>|</span>
                    <a href="/movimentacao" className="active">Movimentação</a>
                </div>

                <h2>Cadastro de Movimentação</h2>
                <form onSubmit={handleSubmit}>

                    {/* Produto */}
                    <label htmlFor="mov-produto">Produto</label>
                    <select
                        id="mov-produto"
                        name="produto_id"
                        value={values.produto_id}
                        onChange={changeValues}
                        required
                    >
                        <option value="">Selecione um Produto</option>
                        {produtos.map(prod => (
                            <option key={prod.id} value={prod.id}>
                                {prod.nome}
                            </option>
                        ))}
                    </select>

                    {/* Cliente */}
                    <label htmlFor="mov-cliente">Cliente</label>
                    <select
                        id="mov-cliente"
                        name="cliente_id"
                        value={values.cliente_id}
                        onChange={changeValues}
                        required
                    >
                        <option value="">Selecione um Cliente</option>
                        {clientes.map(cli => (
                            <option key={cli.id} value={cli.id}>
                                {cli.nome}
                            </option>
                        ))}
                    </select>

                    {/* Tipo */}
                    <label htmlFor="mov-tipo">Tipo</label>
                    <select
                        id="mov-tipo"
                        name="tipo"
                        value={values.tipo}
                        onChange={changeValues}
                        required
                    >
                        <option value="">Selecione</option>
                        <option value="ENTRADA">Entrada</option>
                        <option value="SAIDA">Venda</option>
                    </select>

                    {/* Quantidade */}
                    <label htmlFor="mov-quantidade">Quantidade</label>
                    <input
                        type="number"
                        id="mov-quantidade"
                        name="quantidade"
                        min="1"
                        value={values.quantidade}
                        onChange={changeValues}
                        required
                    />

                    {/* Data */}
                    <label htmlFor="mov-data">Data</label>
                    <input
                        type="date"
                        id="mov-data"
                        name="data"
                        value={values.data}
                        onChange={changeValues}
                        required
                    />

                    <button type="submit">{botaoText}</button>
                </form>
            </div>

            <div className="product-list-container">
                
               <div>
  <h2>Visão Geral do Estoque</h2>

  <div className="cards-container">
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Qtd. em Estoque</h5>
        <p className="card-text">{totalEstoque}</p>
      </div>
    </div>

    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Qtd. Vendida</h5>
        <p className="card-text">{totalVendido}</p>
      </div>
    </div>

    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Valor em Estoque</h5>
        <p className="card-text">R$ {valorEstoque}</p>
      </div>
    </div>

    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Valor Vendido</h5>
        <p className="card-text">R$ {valorVendido}</p>
      </div>
    </div>

    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Venda x Estoque</h5>
        <p className="card-text">R$ {vendaXEstoque}</p>
      </div>
    </div>

    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Estoque Vendido (%)</h5>
        <p className="card-text">{vendaXEstoque_percentual}%</p>
      </div>
    </div>

    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Estoque Parado (%)</h5>
        <p className="card-text">{EstoqueXVenda_percentual}%</p>
      </div>
    </div>
  </div>
</div>
<br />

                <h2>Lista de Movimentações</h2>
                <ul id="product-list" className="product-list">
                    {movimentacoes.map(item => (
                    <li key={item.id} className="product-item">
                        <div className="product-info">
                            <strong>ID Movimentação:</strong> {item.id}<br />
                            <strong>Produto:</strong> {produtos.find(p => p.id === item.produto_id)?.nome || item.produto_id}<br />
                            <strong>Cliente:</strong> {clientes.find(c => c.id === item.cliente_id)?.nome || item.cliente_id}<br />
                            <strong>Tipo:</strong> {item.tipo === 'ENTRADA' ? 'Entrada' : 'Venda'}<br />
                            <strong>Quantidade:</strong> {item.quantidade}<br />
                            <strong>Quantidade em Estoque Atual:</strong> {produtos.find(p => p.id === item.produto_id)?.quantidade_disponivel || 0}<br />
                            <strong>Data:</strong> {item.data.split('T')[0]}<br/>
                            
                        </div>
                        </li>))}
                    </ul>
            </div>
            
        </div>
    );
}

export default Movimentacao;
