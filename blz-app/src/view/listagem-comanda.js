import React from 'react';

import Card from '../components/card';

import { mensagemSucesso, mensagemErro } from '../components/toastr';


import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/comandas`;

function Listagemcomanda() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-comanda`);
  };

  const editar = (id) => {
    navigate(`/cadastro-comanda/${id}`);
  };

  const [dados, setDados] = React.useState(null);

   async function excluir(id) {
     let data = JSON.stringify({ id });
     let url = `${baseURL}/${id}`;
     
     await axios
       .delete(url, data, {
         headers: { 'Content-Type': 'application/json' },
       })
       .then(function (response) {
         mensagemSucesso(`Comanda excluída com sucesso!`);
         setDados(
           dados.filter((dado) => {
             return dado.id !== id;
           })
         );
       })
       .catch(function (error) {
         mensagemErro(`Erro ao excluir a Comanda`);
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
      <Card title='Listagem de comanda'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning'
                onClick={() => cadastrar()}
              >
                Novo comanda
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Forma de Pagamento</th>
                    <th scope='col'>Horário</th>
                    <th scope='col'>Data</th>
                    <th scope='col'>Agendamento</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.nomeFormaPagamento}</td>
                      <td>{dado.horario}</td>
                      <td>{dado.data}</td>
                      <td>{dado.idAgendamento}</td>
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

export default Listagemcomanda;