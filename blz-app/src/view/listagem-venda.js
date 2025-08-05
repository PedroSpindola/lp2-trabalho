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

const baseURL = `${BASE_URL}/vendas`;

// --- Componente de Linha da Tabela (com lógica de expansão simplificada) ---
function Row(props) {
  const { row, onExcluir, onEditar } = props;
  const [open, setOpen] = React.useState(false);
  const [itens, setItens] = React.useState([]);
  const [isLoadingItens, setIsLoadingItens] = React.useState(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Data inválida';
    // Adiciona 'T00:00:00' para evitar problemas com fuso horário
    return new Date(`${dateString}T00:00:00`).toLocaleDateString('pt-BR');
  }

  const handleFetchItens = async () => {
    // A lógica de busca continua a mesma, pois é eficiente
    if (!open && itens.length === 0) {
      setIsLoadingItens(true);
      try {
        const response = await axios.get(`${baseURL}/${row.id}/itemVendas`);
        setItens(response.data);
      } catch (error) {
        mensagemErro("Erro ao buscar os itens desta venda.");
      } finally {
        setIsLoadingItens(false);
      }
    }
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} hover>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={handleFetchItens}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{row.nomeUsuario}</TableCell>
        <TableCell>{row.nomeLoja}</TableCell>
        <TableCell>{row.nomeFormaPagamento}</TableCell>
        <TableCell>{formatDate(row.dataVenda)}</TableCell>
        <TableCell>{row.horario}</TableCell>
        <TableCell>
          <Stack spacing={1} padding={0} direction='row'>
            <IconButton size="small" aria-label='edit' onClick={() => onEditar(row.id)}><EditIcon fontSize="inherit" /></IconButton>
            <IconButton size="small" aria-label='delete' onClick={() => onExcluir(row.id)}><DeleteIcon fontSize="inherit" /></IconButton>
          </Stack>
        </TableCell>
      </TableRow>
      {/* Linha com os detalhes dos itens */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#f8f9fa' }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                Produtos Vendidos:
              </Typography>
              {isLoadingItens ? <p>Carregando...</p> : (
                // ALTERADO: Substituindo a tabela complexa por uma lista simples
                <ul>
                  {itens.length > 0 ? (
                    itens.map((item) => (
                      <li key={item.id}>
                        {item.quantidade}x {item.nomeProduto}
                      </li>
                    ))
                  ) : (
                    <li>Nenhum item encontrado para esta venda.</li>
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
function ListagemVenda() {
  const navigate = useNavigate();
  const [dados, setDados] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchVendas = () => {
    setIsLoading(true);
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    }).catch(error => {
      mensagemErro("Erro ao carregar a lista de vendas.");
    }).finally(() => {
      setIsLoading(false);
    });
  };

  React.useEffect(() => {
    fetchVendas();
  }, []);

  const cadastrar = () => navigate(`/cadastro-venda`);
  const editar = (id) => navigate(`/cadastro-venda/${id}`);

  const excluir = async (id) => {
    await axios.delete(`${baseURL}/${id}`)
      .then(() => {
        mensagemSucesso(`Venda excluída com sucesso!`);
        fetchVendas(); // Recarrega a lista após excluir
      })
      .catch(() => {
        mensagemErro(`Erro ao excluir a Venda`);
      });
  };

  if (isLoading) return <p>Carregando vendas...</p>;

  return (
    <div className='container'>
      <Card title='Listagem de Vendas'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button type='button' className='btn btn-warning mb-3' onClick={cadastrar}>
                Nova Venda
              </button>
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: '5%' }} />
                      <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Loja</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Pagamento</TableCell>
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

export default ListagemVenda;