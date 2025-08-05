import React from 'react';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { IconButton, CircularProgress, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/lojas`;

function ListagemLoja() {
  const navigate = useNavigate();

  const [dados, setDados] = React.useState(null);
  const [expandedRowId, setExpandedRowId] = React.useState(null);
  const [isLoadingExpanded, setIsLoadingExpanded] = React.useState(false);
  const [expandedData, setExpandedData] = React.useState({});

  const cadastrar = () => navigate(`/cadastro-loja`);
  const editar = (id) => navigate(`/cadastro-loja/${id}`);

  async function excluir(id) {
    await axios.delete(`${baseURL}/${id}`)
      .then(() => {
        mensagemSucesso(`Loja excluída com sucesso!`);
        setDados(dados.filter((dado) => dado.id !== id));
      })
      .catch(() => mensagemErro(`Erro ao excluir a loja.`));
  }

  const handleRowExpansion = async (lojaId) => {
    const isRowExpanded = expandedRowId === lojaId;
    if (isRowExpanded) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(lojaId);
      if (!expandedData[lojaId]) {
        setIsLoadingExpanded(true);
        try {
          const responses = await Promise.all([
            axios.get(`${baseURL}/${lojaId}/ClienteLojas`),
            axios.get(`${baseURL}/${lojaId}/produtos`),
            axios.get(`${baseURL}/${lojaId}/vendas`),
            axios.get(`${baseURL}/${lojaId}/funcionarios`),
            axios.get(`${baseURL}/${lojaId}/cargos`),
            axios.get(`${baseURL}/${lojaId}/Agendamentos`)
          ]);

          setExpandedData(prevState => ({
            ...prevState,
            [lojaId]: {
              clientes: responses[0].data,
              produtos: responses[1].data,
              vendas: responses[2].data,
              funcionarios: responses[3].data,
              cargos: responses[4].data,
              agendamentos: responses[5].data
            }
          }));
        } catch (error) {
          mensagemErro("Erro ao buscar os detalhes da loja.");
          console.error("Erro ao buscar detalhes:", error);
        } finally {
          setIsLoadingExpanded(false);
        }
      }
    }
  };

  React.useEffect(() => {
    axios.get(baseURL)
      .then((response) => setDados(response.data))
      .catch(() => mensagemErro("Não foi possível carregar a lista de lojas."));
  }, []);

  if (!dados) return <p>Carregando lojas...</p>;
  
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const SubTable = ({ title, items, columns, renderRow }) => (
    <div className="col-md-6 mb-4">
      <h5>{title}</h5>
      {items && items.length > 0 ? (
        <table className="table table-sm table-bordered bg-white">
          <thead className="thead-light">
            <tr>{columns.map(col => <th key={col}>{col}</th>)}</tr>
          </thead>
          <tbody>{items.map(renderRow)}</tbody>
        </table>
      ) : <p>Nenhum item encontrado.</p>}
    </div>
  );

  return (
    <div className='container'>
      <Card title='Listagem de Lojas'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button type='button' className='btn btn-warning mb-3' onClick={cadastrar}>Nova Loja</button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th style={{ width: '5%' }}></th>
                    <th>Nome</th>
                    <th>CNPJ</th>
                    <th>Telefone</th>
                    <th>Cidade/Estado</th>
                    <th style={{ width: '10%' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <React.Fragment key={dado.id}>
                      <tr onClick={() => handleRowExpansion(dado.id)} style={{ cursor: 'pointer' }}>
                        <td><IconButton size="small">{expandedRowId === dado.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton></td>
                        <td>{dado.nome}</td>
                        <td>{dado.cnpj}</td>
                        <td>{dado.telefone}</td>
                        <td>{`${dado.cidade}/${dado.estado}`}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <Stack direction='row'><IconButton onClick={() => editar(dado.id)}><EditIcon /></IconButton><IconButton onClick={() => excluir(dado.id)}><DeleteIcon /></IconButton></Stack>
                        </td>
                      </tr>
                      {expandedRowId === dado.id && (
                        <tr>
                          <td colSpan="6" style={{ padding: '16px', backgroundColor: '#f8f9fa' }}>
                            {isLoadingExpanded ? <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> :
                              <div className="row">
                                {expandedData[dado.id] && <>
                                  <SubTable title="Clientes" items={expandedData[dado.id].clientes} columns={['Nome', 'Celular']} renderRow={item => <tr key={item.id}><td>{item.nome}</td><td>{item.celular}</td></tr>} />
                                  <SubTable title="Produtos" items={expandedData[dado.id].produtos} columns={['Nome', 'Valor', 'Estoque']} renderRow={item => <tr key={item.id}><td>{item.nome}</td><td>{formatCurrency(item.valorVenda)}</td><td>{item.quantidade}</td></tr>} />
                                  <SubTable title="Funcionários" items={expandedData[dado.id].funcionarios} columns={['Nome', 'CPF']} renderRow={item => <tr key={item.id}><td>{item.nome}</td><td>{item.cpf}</td></tr>} />
                                  <SubTable title="Cargos" items={expandedData[dado.id].cargos} columns={['Nome']} renderRow={item => <tr key={item.id}><td>{item.nome}</td></tr>} />
                                  <SubTable title="Vendas" items={expandedData[dado.id].vendas} columns={['Data', 'Valor', 'Cliente']} renderRow={item => <tr key={item.id}><td>{new Date(item.dataVenda).toLocaleDateString()}</td><td>{formatCurrency(item.valorTotal)}</td><td>{item.cliente?.nome || 'N/A'}</td></tr>} />
                                  <SubTable title="Agendamentos" items={expandedData[dado.id].agendamentos} columns={['Data', 'Horário', 'Cliente']} renderRow={item => <tr key={item.id}><td>{new Date(item.dataAgendamento).toLocaleDateString()}</td><td>{item.horario}</td><td>{item.cliente?.nome || 'N/A'}</td></tr>} />
                                </>}
                              </div>
                            }
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

export default ListagemLoja;