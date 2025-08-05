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

// AJUSTE: A URL base foi atualizada para corresponder ao @RequestMapping do controller
const baseURL = `${BASE_URL}/v1/servicos`;

function ListagemServico() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-servico`);
  };

  const editar = (id) => {
    navigate(`/cadastro-servico/${id}`);
  };

  const [dados, setDados] = React.useState(null);
  const [expandedRowId, setExpandedRowId] = React.useState(null);
  const [isLoadingExpanded, setIsLoadingExpanded] = React.useState(false);
  const [expandedData, setExpandedData] = React.useState({});

  async function excluir(id) {
    let url = `${baseURL}/${id}`;
    await axios
      .delete(url)
      .then(function (response) {
        mensagemSucesso(`Serviço excluído com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o serviço.`);
      });
  }
  
  const handleRowExpansion = async (servicoId) => {
    const isRowExpanded = expandedRowId === servicoId;
    if (isRowExpanded) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(servicoId);
      if (!expandedData[servicoId]) {
        setIsLoadingExpanded(true);
        try {
          // AJUSTE: Os nomes dos endpoints foram corrigidos para 'produtoUtilizados' e 'ordemServicos'
          const [produtosResponse, ordemServicosResponse] = await Promise.all([
            axios.get(`${baseURL}/${servicoId}/produtoUtilizados`),
            axios.get(`${baseURL}/${servicoId}/ordemServicos`)
          ]);

          setExpandedData(prevState => ({
            ...prevState,
            [servicoId]: {
              produtos: produtosResponse.data,
              agendamentos: ordemServicosResponse.data // Continuamos chamando de 'agendamentos' no estado do front-end por clareza
            }
          }));
        } catch (error) {
          mensagemErro("Erro ao buscar detalhes do serviço.");
          console.error("Erro ao buscar detalhes:", error);
        } finally {
          setIsLoadingExpanded(false);
        }
      }
    }
  };

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    });
  }, []);

  if (!dados) return null;

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
                            {isLoadingExpanded && <p>Carregando detalhes...</p>}
                            {!isLoadingExpanded && expandedData[dado.id] && (
                              <div className="row">
                                <div className="col-md-6">
                                  <h5 className="mb-3">Produtos Utilizados</h5>
                                  {expandedData[dado.id].produtos.length > 0 ? (
                                    <table className="table table-sm table-bordered bg-white">
                                      <thead className="thead-light"><tr><th>Produto</th></tr></thead>
                                      <tbody>
                                        {expandedData[dado.id].produtos.map(item => (
                                          // AJUSTE: Acessando o nome do produto via DTO
                                          <tr key={item.id}>
                                            <td>{item.nomeProduto}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  ) : (<p>Nenhum produto associado.</p>)}
                                </div>

                                <div className="col-md-6">
                                  <h5 className="mb-3">Ordens de Serviço (Agendamentos)</h5>
                                  {expandedData[dado.id].agendamentos.length > 0 ? (
                                    <table className="table table-sm table-bordered bg-white">
                                      <thead className="thead-light"><tr><th>Data</th><th>Horário</th><th>Cliente</th></tr></thead>
                                      <tbody>
                                        {expandedData[dado.id].agendamentos.map(item => (
                                          // AJUSTE: Acessando os dados do agendamento via DTO
                                          <tr key={item.id}>
                                            <td>{new Date(item.dataAgendamento).toLocaleDateString()}</td>
                                            <td>{item.horario}</td>
                                            <td>{item.nomeCliente}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  ) : (<p>Nenhuma ordem de serviço encontrada.</p>)}
                                </div>
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