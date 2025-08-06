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
const produtosURL = `${BASE_URL}/produtos`;

// --- Componente de Linha da Tabela (ROW) ---
function Row(props) {
  const { row, onExcluir, onEditar } = props;
  const [open, setOpen] = React.useState(false);
  const [itens, setItens] = React.useState([]);
  const [isLoadingItens, setIsLoadingItens] = React.useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Data inválida';
    return new Date(`${dateString}T00:00:00`).toLocaleDateString('pt-BR');
  }

  // Lógica para buscar os itens e seus nomes
  const handleFetchItens = async () => {
    setOpen(!open);

    // Só busca na API se a linha estiver abrindo e os itens ainda não foram carregados
    if (!open && itens.length === 0) {
      setIsLoadingItens(true);
      try {
        // 1. Busca os itens da venda (que têm idProduto e quantidade)
        const itensResponse = await axios.get(`${baseURL}/${row.id}/itemVendas`);
        const itensDaVenda = itensResponse.data;

        if (itensDaVenda && itensDaVenda.length > 0) {
          // 2. Cria uma "promessa" de busca para cada produto
          const promessasDeProdutos = itensDaVenda.map(item =>
            axios.get(`${produtosURL}/${item.idProduto}`)
          );

          // 3. Espera todas as buscas de produtos terminarem
          const respostasDosProdutos = await Promise.all(promessasDeProdutos);

          // 4. Junta os dados das duas fontes
          const itensCompletos = itensDaVenda.map((itemOriginal, index) => {
            const detalhesDoProduto = respostasDosProdutos[index].data;
            return {
              id: itemOriginal.id,
              quantidade: itemOriginal.quantidade,
              nomeProduto: detalhesDoProduto.nome // O nome que queremos exibir
            };
          });

          setItens(itensCompletos);
        }
      } catch (error) {
        mensagemErro("Erro ao buscar os produtos da venda.");
        // Se der erro aqui, é porque a chamada a /itemVendas ou /produtos falhou.
        // Verifique a aba "Rede" (Network) do navegador para ver o status do erro (404, 500, etc)
      } finally {
        setIsLoadingItens(false);
      }
    }
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
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#f8f9fa' }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                Produtos Vendidos:
              </Typography>
              {isLoadingItens ? <p>Carregando...</p> : (
                 <ul>
                   {itens.length > 0 ? (
                     itens.map((item) => (
                       // --- EXIBIÇÃO SIMPLIFICADA CONFORME SOLICITADO ---
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


// --- O restante do arquivo (Componente ListagemVenda) não precisa de nenhuma alteração ---
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
        fetchVendas();
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