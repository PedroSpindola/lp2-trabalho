import React from 'react';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// NOVO: Ícones para o botão de expandir/recolher
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

// AJUSTE 1: Corrigindo a baseURL para incluir a versão da API do seu controller.
const baseURL = `${BASE_URL}/vendas`;

function Listagemvenda() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-venda`);
  };

  const editar = (id) => {
    navigate(`/cadastro-venda/${id}`);
  };

  const [dados, setDados] = React.useState(null);

  // NOVO: Estados para a funcionalidade de expansão.
  const [expandedRowId, setExpandedRowId] = React.useState(null);
  const [isLoadingItens, setIsLoadingItens] = React.useState(false);
  const [itensPorVenda, setItensPorVenda] = React.useState({});

  async function excluir(id) {
    // AJUSTE 2: Simplificando a requisição delete, o corpo não é padrão.
    await axios.delete(`${baseURL}/${id}`)
      .then(function (response) {
        // AJUSTE 3: Corrigindo o gênero na mensagem.
        mensagemSucesso(`Venda excluída com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir a Venda`);
      });
  }

  // NOVO: Função para buscar e exibir os itens de uma venda.
  const handleRowExpansion = async (vendaId) => {
    const isRowExpanded = expandedRowId === vendaId;
    if (isRowExpanded) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(vendaId);
      if (!itensPorVenda[vendaId]) {
        setIsLoadingItens(true);
        try {
          // Chamada ao endpoint correto do seu controller
          const response = await axios.get(`${baseURL}/${vendaId}/itemVendas`);
          setItensPorVenda(prevState => ({
            ...prevState,
            [vendaId]: response.data
          }));
        } catch (error) {
          mensagemErro("Erro ao buscar os itens desta venda.");
          console.error("Erro ao buscar itens da venda:", error);
        } finally {
          setIsLoadingItens(false);
        }
      }
    }
  };

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    });
  }, []);

  if (!dados) return <p>Carregando vendas...</p>;
  
  // NOVO: Helper para formatar moeda
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className='container'>
      <Card title='Listagem de Vendas'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-3'
                onClick={() => cadastrar()}
              >
                Nova Venda
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    {/* NOVO: Coluna para o botão de expandir */}
                    <th scope='col' style={{ width: '5%' }}></th>
                    <th scope='col'>Cliente</th>
                    <th scope='col'>Loja</th>
                    <th scope='col'>Pagamento</th>
                    <th scope='col'>Data</th>
                    <th scope='col'>Horário</th>
                    <th scope='col' style={{ width: '10%' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <React.Fragment key={dado.id}>
                      <tr onClick={() => handleRowExpansion(dado.id)} style={{ cursor: 'pointer' }}>
                        <td>
                          <IconButton aria-label="expand row" size="small">
                            {expandedRowId === dado.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </td>
                        <td>{dado.nomeUsuario}</td>
                        <td>{dado.nomeLoja}</td>
                        <td>{dado.nomeFormaPagamento}</td>
                        <td>{new Date(dado.dataVenda).toLocaleDateString()}</td>
                        <td>{dado.horario}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <Stack spacing={1} padding={0} direction='row'>
                            <IconButton aria-label='edit' onClick={() => editar(dado.id)}><EditIcon /></IconButton>
                            <IconButton aria-label='delete' onClick={() => excluir(dado.id)}><DeleteIcon /></IconButton>
                          </Stack>
                        </td>
                      </tr>
                      {/* NOVO: Linha expandida para mostrar a lista de itens da venda */}
                      {expandedRowId === dado.id && (
                        <tr>
                          <td colSpan="7" style={{ padding: '16px', backgroundColor: '#f8f9fa' }}>
                            {isLoadingItens && <p>Carregando itens da venda...</p>}
                            {!isLoadingItens && itensPorVenda[dado.id] && (
                              <div>
                                <h5 className="mb-3">Itens da Venda</h5>
                                {itensPorVenda[dado.id].length > 0 ? (
                                  <table className="table table-sm table-bordered bg-white">
                                    <thead className="thead-light">
                                      <tr>
                                        <th>Produto</th>
                                        <th>Quantidade</th>
                                        <th>Preço Unitário</th>
                                        <th>Subtotal</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {itensPorVenda[dado.id].map(item => (
                                        <tr key={item.id}>
                                          {/* AJUSTE 4: Acesso seguro aos dados dos itens */}
                                          <td>{item.nomeProduto || 'Produto não informado'}</td>
                                          <td>{item.quantidade}</td>
                                          <td>{formatCurrency(item.precoUnitario)}</td>
                                          <td>{formatCurrency(item.quantidade * item.precoUnitario)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (<p>Nenhum item encontrado para esta venda.</p>)}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Listagemvenda;