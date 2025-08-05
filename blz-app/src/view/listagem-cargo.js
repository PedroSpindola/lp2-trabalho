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
const baseURL = `${BASE_URL}/cargos`;

function Listagemcargo() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-cargo`);
  };

  const editar = (id) => {
    navigate(`/cadastro-cargo/${id}`);
  };

  const [dados, setDados] = React.useState(null);

  // NOVO: Estados para a funcionalidade de expansão
  const [expandedRowId, setExpandedRowId] = React.useState(null);
  const [isLoadingFuncionarios, setIsLoadingFuncionarios] = React.useState(false);
  const [funcionariosPorCargo, setFuncionariosPorCargo] = React.useState({});


  async function excluir(id) {
    // AJUSTE: Simplificando a requisição delete, o corpo não é padrão.
    await axios.delete(`${baseURL}/${id}`)
      .then(function (response) {
        mensagemSucesso(`Cargo excluído com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o cargo.`);
      });
  }

  // NOVO: Função para buscar e exibir os funcionários de um cargo
  const handleRowExpansion = async (cargoId) => {
    const isRowExpanded = expandedRowId === cargoId;
    if (isRowExpanded) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(cargoId);
      if (!funcionariosPorCargo[cargoId]) {
        setIsLoadingFuncionarios(true);
        try {
          // Chamada ao endpoint correto do seu controller
          const response = await axios.get(`${baseURL}/${cargoId}/cargoFuncionario`);
          setFuncionariosPorCargo(prevState => ({
            ...prevState,
            [cargoId]: response.data
          }));
        } catch (error) {
          mensagemErro("Erro ao buscar os funcionários deste cargo.");
          console.error("Erro ao buscar funcionários:", error);
        } finally {
          setIsLoadingFuncionarios(false);
        }
      }
    }
  };

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    });
  }, []);

  if (!dados) return <p>Carregando cargos...</p>;

  return (
    <div className='container'>
      <Card title='Listagem de Cargos'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-3'
                onClick={() => cadastrar()}
              >
                Novo Cargo
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    {/* NOVO: Coluna para o botão de expandir */}
                    <th scope='col' style={{ width: '5%' }}></th>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Loja</th>
                    <th scope='col'>Descrição</th>
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
                        <td>{dado.nomeLoja}</td>
                        <td>{dado.descricao}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <Stack spacing={1} padding={0} direction='row'>
                            <IconButton aria-label='edit' onClick={() => editar(dado.id)}><EditIcon /></IconButton>
                            <IconButton aria-label='delete' onClick={() => excluir(dado.id)}><DeleteIcon /></IconButton>
                          </Stack>
                        </td>
                      </tr>
                      {/* NOVO: Linha expandida para mostrar a lista de funcionários */}
                      {expandedRowId === dado.id && (
                        <tr>
                          <td colSpan="5" style={{ padding: '16px', backgroundColor: '#f8f9fa' }}>
                            {isLoadingFuncionarios && <p>Carregando funcionários...</p>}
                            {!isLoadingFuncionarios && funcionariosPorCargo[dado.id] && (
                              <div>
                                <h5 className="mb-3">Funcionários neste Cargo</h5>
                                {funcionariosPorCargo[dado.id].length > 0 ? (
                                  <table className="table table-sm table-bordered bg-white">
                                    <thead className="thead-light">
                                      <tr>
                                        <th>Nome do Funcionário</th>
                                        <th>CPF</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {funcionariosPorCargo[dado.id].map(item => (
                                        <tr key={item.id}>
                                          {/* AJUSTE 2: Acesso seguro aos dados do funcionário */}
                                          <td>{item.funcionario?.nome || 'Nome não disponível'}</td>
                                          <td>{item.funcionario?.cpf || 'CPF não disponível'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (<p>Nenhum funcionário encontrado para este cargo.</p>)}
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

export default Listagemcargo;