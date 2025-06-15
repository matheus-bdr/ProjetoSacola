import { useState, useEffect } from 'react';
import '../style/Produto.css';
import Axios from "axios";

function Produto() {
    const [values, setValues] = useState({ codigo: '', nome: '', quantidade: '', preco: '', id: null });
    const [produtos, setProdutos] = useState([]);
    const [botaoText, setBotaoText] = useState("Cadastrar Produto");

    const changeValues = (value) => {
        setValues(prevValue => ({
            ...prevValue,
            [value.target.name]: value.target.value,
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!values.nome || !values.codigo || values.quantidade === '' || values.preco === '') {
            alert('Preencha todos os campos.');
            return;
        }

        if (!values.id) {
            try {
                const response = await Axios.get('http://localhost:3001/api/produto', {
                    params: { codigo: values.codigo }
                });

                if (response.data.itens.length > 0) {
                    alert('O Produto já existe no nosso banco de dados.');
                    return;
                } else {
                    await Axios.post("http://localhost:3001/api/produto", {
                        nome: values.nome,
                        codigo: values.codigo,
                        preco: parseFloat(values.preco) || 0,
                        quantidade_disponivel: parseInt(values.quantidade) || 0
                    });

                    window.location.reload();
                }
            } catch (error) {
                console.error('Erro no cadastro de produto:', error);
                alert('Erro ao cadastrar produto.');
            }
        } else {
            try {
                await Axios.patch(`http://localhost:3001/api/produto/${values.id}`, {
                    nome: values.nome,
                    codigo: values.codigo,
                    preco: parseFloat(values.preco) || 0,
                    quantidade_disponivel: parseInt(values.quantidade) || 0
                });

                window.location.reload();
            } catch (error) {
                console.error('Houve um erro ao atualizar o produto', error);
                alert('Erro ao atualizar produto.');
            }
        }
    };

    const handleDelete = (id) => {
        const confirmar = window.confirm('Deseja excluir o produto?');
        if (!confirmar) return; // se cancelar, não faz nada

        Axios.delete(`http://localhost:3001/api/produto/${id}`).then(() => {
            alert('Produto excluído com sucesso.');
            window.location.reload();
        }).catch((error) => {
            console.error('Erro ao excluir o produto:', error);
            alert('Erro ao excluir o produto.');
        });
    };

    const handleEdit = (id) => {
        const produtoSelecionado = produtos.find(obj => obj.id === id);

        setValues({
            codigo: produtoSelecionado.codigo,
            nome: produtoSelecionado.nome,
            quantidade: produtoSelecionado.quantidade_disponivel,
            preco: produtoSelecionado.preco,
            id: produtoSelecionado.id
        });

        document.getElementById('product-name').value = produtoSelecionado.nome;
        document.getElementById('product-code').value = produtoSelecionado.codigo;
        document.getElementById('product-quantidade').value = produtoSelecionado.quantidade_disponivel;
        document.getElementById('product-preco').value = produtoSelecionado.preco;

        setBotaoText("Editar Produto");
    };

    useEffect(() => {
        Axios.get('http://localhost:3001/api/produto', { timeout: 5000 })
            .then(response => {
                setProdutos(response.data.itens);
            })
            .catch(error => {
                alert('API não está disponível');
                console.error('Erro ao buscar dados:', error);
            });
    }, []);

    return (
        <div className="container">
            <div className="form-container">
                <div className="nav-bar">
                    <a href="/">Cliente</a>
                    <span>|</span>
                    <a href="/produto" className="active">Produto</a>
                    <span>|</span>
                    <a href="/movimentacao">Movimentação</a>
                </div>

                <h2>Cadastro de Produto</h2>
                <form id="product-form" onSubmit={handleSubmit}>
                    <label htmlFor="product-name">Nome do Produto</label>
                    <input
                        type="text"
                        id="product-name"
                        name="nome"
                        onChange={changeValues}
                        required
                    />

                    <label htmlFor="product-code">Código do Produto</label>
                    <input
                        type="text"
                        id="product-code"
                        name="codigo"
                        onChange={changeValues}
                        required
                    />

                    <label htmlFor="product-quantidade">Quantidade do Produto</label>
                    <input
                        type="number"
                        id="product-quantidade"
                        name="quantidade"
                        min="0"
                        onChange={changeValues}
                        required
                    />

                    <label htmlFor="product-preco">Preço do Produto (R$)</label>
                    <input
                        type="number"
                        id="product-preco"
                        name="preco"
                        step="0.01"
                        min="0"
                        onChange={changeValues}
                        required
                    />

                    <button type="submit" style={{ marginBottom: '20px' }}>{botaoText}</button>
                    {values.id && <button type="button" onClick={() => window.location.reload()} className="delete-btn">Cancelar</button>}
                </form>
            </div>

            <div className="product-list-container">
                <h3>Produtos Cadastrados</h3>
                <ul id="product-list" className="product-list">
                    {produtos.map(item => (
                        <li key={item.id} className="product-item">
                            <div className="product-info">
                                <strong>Nome: </strong>{item.nome}<br />
                                <strong>Código: </strong>{item.codigo}<br />
                                <strong>Quantidade: </strong>{item.quantidade_disponivel}<br />
                                <strong>Preço Unitário: </strong>R$ {Number(item.preco).toFixed(2)}<br />
                                <strong>Valor Total em Estoque: </strong>R$ {(item.preco * item.quantidade_disponivel).toFixed(2)}
                            </div>
                            <button onClick={() => handleEdit(item.id)} className="edit-btn">Editar</button>
                            <button onClick={() => handleDelete(item.id)} className="delete-btn">Excluir</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Produto;
