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

const baseURL = `${BASE_URL}/colaboradores`;

function Listagemcolaborador() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-colaborador`);
  };

  const editar = (id) => {
    navigate(`/cadastro-colaborador/${id}`);
  };

  const [dados, setDados] = React.useState(null);
  // NOVO: Estados para controlar a expansão e os dados das lojas
  const [expandedRowId, setExpandedRowId] = React.useState(null);
  const [lojasPorColaborador, setLojasPorColaborador] = React.useState({});
  const [isLoadingLojas, setIsLoadingLojas] = React.useState(false);


  async function excluir(id) {
    let url = `${baseURL}/${id}`;
    await axios
      .delete(url)
      .then(function (response) {
        // NOVO: Mensagem de sucesso corrigida
        mensagemSucesso(`Colaborador excluído com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        // NOVO: Mensagem de erro corrigida
        mensagemErro(`Erro ao excluir o colaborador.`);
      });
  }

  // NOVO: Função para buscar e exibir as lojas de um colaborador
  const handleRowExpansion = async (colaboradorId) => {
    const isRowExpanded = expandedRowId === colaboradorId;

    if (isRowExpanded) {
      setExpandedRowId(null); // Recolhe a linha
    } else {
      setExpandedRowId(colaboradorId); // Expande a linha
      // Busca as lojas apenas se ainda não foram buscadas
      if (!lojasPorColaborador[colaboradorId]) {
        setIsLoadingLojas(true);
        try {
          const response = await axios.get(`${baseURL}/${colaboradorId}/lojas`);
          setLojasPorColaborador(prevState => ({
            ...prevState,
            [colaboradorId]: response.data
          }));
        } catch (error) {
          mensagemErro('Erro ao buscar as lojas deste colaborador.');
          console.error("Erro ao buscar lojas:", error);
        } finally {
          setIsLoadingLojas(false);
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

  return (
    <div className='container'>
      <Card title='Listagem de Colaboradores'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-3'
                onClick={() => cadastrar()}
              >
                Novo Colaborador
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    {/* NOVO: Coluna para o botão de expandir */}
                    <th scope='col' style={{ width: '5%' }}></th>
                    <th scope='col'>CPF</th>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Telefone</th>
                    <th scope='col'>Celular</th>
                    <th scope='col'>Data Nascimento</th>
                    <th scope='col'>Email</th>
                    {/* A coluna "Loja" foi removida pois agora mostraremos uma lista */}
                    <th scope='col' style={{ width: '10%' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    // NOVO: Usamos React.Fragment para agrupar a linha do colaborador e a de lojas
                    <React.Fragment key={dado.id}>
                      <tr onClick={() => handleRowExpansion(dado.id)} style={{ cursor: 'pointer' }}>
                        <td>
                          <IconButton aria-label="expand row" size="small">
                            {expandedRowId === dado.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </td>
                        <td>{dado.cpf}</td>
                        <td>{dado.nome}</td>
                        <td>{dado.telefone}</td>
                        <td>{dado.celular}</td>
                        <td>{dado.dataNascimento}</td>
                        <td>{dado.email}</td>
                        {/* NOVO: Parar a propagação do clique para não expandir a linha ao clicar nos botões */}
                        <td onClick={(e) => e.stopPropagation()}>
                          <Stack spacing={1} padding={0} direction='row'>
                            <IconButton
                              aria-label='edit'
                              onClick={() => editar(dado.id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label='delete'
                              onClick={() => excluir(dado.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </td>
                      </tr>
                      {/* NOVO: Renderização condicional da linha com a tabela de lojas */}
                      {expandedRowId === dado.id && (
                        <tr>
                          {/* Esta célula ocupa todas as colunas (8) da tabela */}
                          <td colSpan="8" style={{ padding: '16px', backgroundColor: '#f8f9fa' }}>
                            {isLoadingLojas && <p>Carregando lojas...</p>}
                            {!isLoadingLojas && lojasPorColaborador[dado.id] && (
                              <div>
                                <h5 className="mb-3">Lojas Associadas</h5>
                                {lojasPorColaborador[dado.id].length > 0 ? (
                                  <table className="table table-sm table-bordered bg-white">
                                    <thead className="thead-light">
                                      <tr>
                                        <th>Nome da Loja</th>
                                        <th>CNPJ</th>
                                        <th>Telefone</th>
                                        <th>Cidade</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {lojasPorColaborador[dado.id].map(loja => (
                                        <tr key={loja.id}>
                                          <td>{loja.nome}</td>
                                          <td>{loja.cnpj}</td>
                                          <td>{loja.telefone}</td>
                                          <td>{loja.cidade}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (
                                  <p>Nenhuma loja associada a este colaborador.</p>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>{' '}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Listagemcolaborador;