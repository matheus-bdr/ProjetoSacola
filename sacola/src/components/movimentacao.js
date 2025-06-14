import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import '../style/Movimentacao.css';

function Movimentacao() {
    const [movimento, setMovimento] = useState({
        tipo: '',
        quantidade: '',
        produto_id: '',
    });

    const [produtos, setProdutos] = useState([]);
    const [movimentacoes, setMovimentacoes] = useState([]);

    useEffect(() => {
        Axios.get('http://localhost:3001/api/produto')
            .then(res => setProdutos(res.data.itens))
            .catch(err => console.error(err));

        Axios.get('http://localhost:3001/api/movimentacao')
            .then(res => setMovimentacoes(res.data.itens))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovimento(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3001/api/movimentacao', {
            ...movimento,
            data: new Date().toISOString().slice(0, 10)
        })
        .then(() => {
            alert('Movimentação registrada!');
            window.location.reload();
        })
        .catch(() => alert('Erro ao registrar movimentação.'));
    };

    const handleDelete = (id) => {
        if (window.confirm('Deseja realmente excluir essa movimentação?')) {
            Axios.delete(`http://localhost:3001/api/movimentacao/${id}`)
                .then(() => {
                    alert('Movimentação excluída');
                    window.location.reload();
                })
                .catch(() => alert('Erro ao excluir.'));
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <div className="nav-bar">
                    <a href="/">Cliente</a><span>|</span>
                    <a href="/produto">Produto</a><span>|</span>
                    <a href="/movimentacao" className="active">Movimentação</a>
                </div>

                <h2>Registrar Movimentação</h2>
                <form onSubmit={handleSubmit}>
                    <label>Tipo</label>
                    <select name="tipo" onChange={handleChange} required>
                        <option value="">Selecione</option>
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saída</option>
                    </select>

                    <label>Produto</label>
                    <select name="produto_id" onChange={handleChange} required>
                        <option value="">Selecione</option>
                        {produtos.map(prod => (
                            <option key={prod.id} value={prod.id}>{prod.nome}</option>
                        ))}
                    </select>

                    <label>Quantidade</label>
                    <input type="number" name="quantidade" onChange={handleChange} required />

                    <button type="submit">Registrar</button>
                </form>

                <h3>Movimentações</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimentacoes.map(m => (
                            <tr key={m.id}>
                                <td>{m.id}</td>
                                <td>{m.tipo}</td>
                                <td>{m.produto}</td>
                                <td>{m.quantidade}</td>
                                <td>{m.data}</td>
                                <td>
                                    <button onClick={() => handleDelete(m.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Movimentacao;
