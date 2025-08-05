import React from 'react';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

// AJUSTE 1: A URL base DEVE incluir a versão da API.
const baseURL = `${BASE_URL}/servicos`;

function ListagemServico() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-servico`);
  };

  const editar = (id) => {
    navigate(`/cadastro-servico/${id}`);
  };

  const [dados, setDados] = React.useState(null);
  
  // AJUSTE: Estados simplificados para lidar apenas com produtos, como solicitado.
  const [expandedRowId, setExpandedRowId] = React.useState(null);
  const [isLoadingProdutos, setIsLoadingProdutos] = React.useState(false);
  const [produtosPorServico, setProdutosPorServico] = React.useState({});

  async function excluir(id) {
    let url = `${baseURL}/${id}`;
    await axios
      .delete(url)
      .then(function (response) {
        mensagemSucesso(`Serviço excluído com sucesso!`);
        setDados(dados.filter((dado) => dado.id !== id));
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o serviço.`);
      });
  }

  // AJUSTE: Função de expansão corrigida e simplificada para buscar APENAS os produtos.
  const handleRowExpansion = async (servicoId) => {
    const isRowExpanded = expandedRowId === servicoId;
    if (isRowExpanded) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(servicoId);
      if (!produtosPorServico[servicoId]) {
        setIsLoadingProdutos(true);
        try {
          const response = await axios.get(`${baseURL}/${servicoId}/produtoUtilizados`);
          setProdutosPorServico(prevState => ({
            ...prevState,
            [servicoId]: response.data
          }));
        } catch (error) {
          mensagemErro("Erro ao buscar os produtos do serviço.");
          console.error("Erro ao buscar produtos:", error);
        } finally {
          setIsLoadingProdutos(false);
        }
      }
    }
  };

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    }).catch(error => {
      console.error("Erro ao buscar a lista de serviços:", error);
      mensagemErro("Não foi possível carregar a lista de serviços.");
    });
  }, []);

  if (!dados) return <p>Carregando serviços...</p>;

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className='container'>
      <Card title='Listagem de Serviços'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-3'
                onClick={() => cadastrar()}
              >
                Novo Serviço
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col' style={{ width: '5%' }}></th>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Duração (Min)</th>
                    <th scope='col'>Comissão (%)</th>
                    <th scope='col'>Valor</th>
                    <th scope='col'>Loja</th>
                    <th scope='col'>Cargo</th>
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
                        <td>{dado.nome}</td>
                        <td>{dado.duracao}</td>
                        <td>{dado.comissao}%</td>
                        <td>{formatCurrency(dado.preco)}</td>
                        {/* AJUSTE 2: Lendo os nomes da Loja e do Cargo diretamente do DTO */}
                        <td>{dado.nomeLoja}</td>
                        <td>{dado.nomeCargo}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <Stack spacing={1} padding={0} direction='row'>
                            <IconButton aria-label='edit' onClick={() => editar(dado.id)}><EditIcon /></IconButton>
                            <IconButton aria-label='delete' onClick={() => excluir(dado.id)}><DeleteIcon /></IconButton>
                          </Stack>
                        </td>
                      </tr>
                      {expandedRowId === dado.id && (
                        <tr>
                          <td colSpan="8" style={{ padding: '16px', backgroundColor: '#f8f9fa' }}>
                            {isLoadingProdutos && <p>Carregando produtos...</p>}
                            {!isLoadingProdutos && produtosPorServico[dado.id] && (
                              <div>
                                <h5 className="mb-3">Produtos Utilizados</h5>
                                {produtosPorServico[dado.id].length > 0 ? (
                                  <table className="table table-sm table-bordered bg-white">
                                    <thead className="thead-light"><tr><th>Produto</th></tr></thead>
                                    <tbody>
                                      {produtosPorServico[dado.id].map(item => (
                                        <tr key={item.id}>
                                          {/* AJUSTE 3: Acessando o nome do produto de forma segura */}
                                          <td>{item.produto?.nome || 'Nome não disponível'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (<p>Nenhum produto associado a este serviço.</p>)}
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

export default ListagemServico;