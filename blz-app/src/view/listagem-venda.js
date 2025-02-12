import React from 'react';

import Card from '../components/card';

import { mensagemSucesso, mensagemErro } from '../components/toastr';


import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL3 } from '../config/axios3';

const baseURL = `${BASE_URL3}/Venda`;

function Listagemvenda() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-venda`);
  };

  const editar = (id) => {
    navigate(`/cadastro-venda/${id}`);
  };

  const [dados, setDados] = React.useState(null);

   async function excluir(id) {
     let data = JSON.stringify({ id });
     let url = `${baseURL}/${id}`;
     console.log(url);
     await axios
       .delete(url, data, {
         headers: { 'Content-Type': 'application/json' },
       })
       .then(function (response) {
         mensagemSucesso(`Venda excluído com sucesso!`);
         setDados(
           dados.filter((dado) => {
             return dado.id !== id;
           })
         );
       })
       .catch(function (error) {
         mensagemErro(`Erro ao excluir o Venda`);
       });
   }

  React.useEffect(() => {
     axios.get(baseURL).then((response) => {
       setDados(response.data);
     });
   }, []);

   if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Listagem de vendas'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning'
                onClick={() => cadastrar()}
              >
                Nova Venda
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Cliente</th>
                    <th scope='col'>Loja</th>
                    <th scope='col'>Produto</th>
                    <th scope='col'>Data da Compra</th>
                    <th scope='col'>Horário da Compra</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.cliente}</td>
                      <td>{dado.loja}</td>
                      <td>{dado.produto}</td>
                      <td>{dado.dataVenda}</td>
                      <td>{dado.horarioVenda}</td>
                      
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

export default Listagemvenda;