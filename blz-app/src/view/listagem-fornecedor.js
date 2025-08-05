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

const baseURL = `${BASE_URL}/fornecedores`;

function Listagemfornecedor() {
  const navigate = useNavigate();
  const [dados, setDados] = React.useState(null);
  const [expandedRowId, setExpandedRowId] = React.useState(null);
  const [produtosPorFornecedor, setProdutosPorFornecedor] = React.useState({});
  const [isLoadingProdutos, setIsLoadingProdutos] = React.useState(false);


  const cadastrar = () => {
    navigate(`/cadastro-fornecedor`);
  };

  const editar = (id) => {
    navigate(`/cadastro-fornecedor/${id}`);
  };

  async function excluir(id) {
    let url = `${baseURL}/${id}`;
    await axios
      .delete(url)
      .then(function (response) {
        mensagemSucesso(`Fornecedor excluído com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o fornecedor.`);
      });
  }

  const handleRowExpansion = async (fornecedorId) => {
    const isRowExpanded = expandedRowId === fornecedorId;

    if (isRowExpanded) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(fornecedorId);
      if (!produtosPorFornecedor[fornecedorId]) {
        setIsLoadingProdutos(true);
        try {
          const response = await axios.get(`${baseURL}/${fornecedorId}/produto`);
          setProdutosPorFornecedor(prevState => ({
            ...prevState,
            [fornecedorId]: response.data
          }));
        } catch (error) {
          mensagemErro('Erro ao buscar os produtos deste fornecedor.');
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
    });
  }, []);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Listagem de Fornecedores'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-3'
                onClick={() => cadastrar()}
              >
                Novo Fornecedor
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    
                    <th scope='col'></th> 
                    <th scope='col'>Nome</th>
                    <th scope='col'>Telefone</th>
                    <th scope='col'>Celular</th>
                    <th scope='col'>Email</th>
                    <th scope='col'>CPF</th>
                    <th scope='col'>CNPJ</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <React.Fragment key={dado.id}>
                      <tr>
                        <td>
        
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => handleRowExpansion(dado.id)}
                          >
                            {expandedRowId === dado.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </td>
                        <td>{dado.nome}</td>
                        <td>{dado.telefone}</td>
                        <td>{dado.celular}</td>
                        <td>{dado.email}</td>
                        <td>{dado.cpf}</td>
                        <td>{dado.cnpj}</td>
                        <td>
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
                 
                      {expandedRowId === dado.id && (
                        <tr>
                   
                          <td colSpan="8" style={{ padding: '16px' }}>
                            {isLoadingProdutos && <p>Carregando produtos...</p>}
                            {!isLoadingProdutos && produtosPorFornecedor[dado.id] && (
                              <div>
                                <h5 className="mb-3">Produtos Fornecidos</h5>
                                {produtosPorFornecedor[dado.id].length > 0 ? (
                                  <table className="table table-sm table-bordered">
                                    <thead className="thead-light">
                                      <tr>
                                        <th>Nome do Produto</th>
                                        <th>Valor de Venda</th>
                                        <th>Quantidade em Estoque</th>
                                        <th>Data de Validade</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {produtosPorFornecedor[dado.id].map(produto => (
                                        <tr key={produto.id}>
                                          <td>{produto.nome}</td>
                                          <td>R$ {produto.valorVenda.toFixed(2)}</td>
                                          <td>{produto.quantidade}</td>
                                          <td>{produto.dataValidade}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (
                                  <p>Nenhum produto cadastrado para este fornecedor.</p>
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

export default Listagemfornecedor;