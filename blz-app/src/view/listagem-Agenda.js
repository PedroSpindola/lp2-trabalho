import React from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { IconButton, Box, Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/agendamentos`;

// --- Componente de Linha da Tabela ---
function Row(props) {
  const { row, onExcluir, onEditar } = props;
  const [open, setOpen] = React.useState(false);
  const [servicos, setServicos] = React.useState([]);
  const [isLoadingServicos, setIsLoadingServicos] = React.useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Data inválida';
    return new Date(`${dateString}T00:00:00`).toLocaleDateString('pt-BR');
  };

  const handleFetchServicos = async () => {
    if (!open && servicos.length === 0) {
      setIsLoadingServicos(true);
      try {
        // Endpoint correto para buscar os serviços do agendamento
        const response = await axios.get(`${baseURL}/${row.id}/ordemServicos`);
        setServicos(response.data);
      } catch (error) {
        mensagemErro("Erro ao buscar os serviços deste agendamento.");
      } finally {
        setIsLoadingServicos(false);
      }
    }
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} hover>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={handleFetchServicos}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.nomeCliente || 'N/A'}</TableCell>
        <TableCell>{row.nomeFuncionario || 'Qualquer um'}</TableCell>
        <TableCell>{row.nomeLoja || 'N/A'}</TableCell>
        <TableCell>{formatDate(row.dataAgendamento)}</TableCell>
        <TableCell>{row.horario}</TableCell>
        <TableCell>
          <Stack spacing={1} padding={0} direction='row'>
            <IconButton size="small" aria-label='edit' onClick={() => onEditar(row.id)}><EditIcon fontSize="inherit" /></IconButton>
            <IconButton size="small" aria-label='delete' onClick={() => onExcluir(row.id)}><DeleteIcon fontSize="inherit" /></IconButton>
          </Stack>
        </TableCell>
      </TableRow>
      {/* Linha com os detalhes dos serviços */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#f8f9fa' }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                Serviços Agendados:
              </Typography>
              {isLoadingServicos ? <p>Carregando...</p> : (
                <ul>
                  {servicos.length > 0 ? (
                    servicos.map((item) => (
                      <li key={item.id}>
                        {item.quantidade}x {item.nomeServico}
                      </li>
                    ))
                  ) : (
                    <li>Nenhum serviço encontrado para este agendamento.</li>
                  )}
                </ul>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// --- Componente Principal da Listagem ---
function ListagemAgenda() {
  const navigate = useNavigate();
  const [dados, setDados] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchAgendamentos = () => {
    setIsLoading(true);
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    }).catch(error => {
      mensagemErro("Erro ao carregar a lista de agendamentos.");
    }).finally(() => {
      setIsLoading(false);
    });
  };

  React.useEffect(() => {
    fetchAgendamentos();
  }, []);

  const cadastrar = () => navigate(`/cadastro-agenda`);
  const editar = (id) => navigate(`/cadastro-agenda/${id}`);

  const excluir = async (id) => {
    await axios.delete(`${baseURL}/${id}`)
      .then(() => {
        mensagemSucesso(`Agendamento excluído com sucesso!`);
        fetchAgendamentos(); // Recarrega a lista
      })
      .catch(() => {
        mensagemErro(`Erro ao excluir o Agendamento`);
      });
  };

  if (isLoading) return <p>Carregando agendamentos...</p>;

  return (
    <div className='container'>
      <Card title='Listagem de Agendamentos'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button type='button' className='btn btn-warning mb-3' onClick={cadastrar}>
                Novo Agendamento
              </button>
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: '5%' }} />
                      <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Funcionário</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Loja</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Horário</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dados.map((dado) => (
                      <Row key={dado.id} row={dado} onExcluir={excluir} onEditar={editar} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemAgenda;