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

const baseURL = `${BASE_URL}/lojas`;

function Listagemloja() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-loja`);
  };

  const editar = (id) => {
    
    navigate(`/cadastro-loja/${id}`);
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
        mensagemSucesso(`Loja excluida com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir a loja`);
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
      <Card title='Listagem de lojas dados'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
            <button
                type='button'
                className='btn btn-warning'
                onClick={() => cadastrar()}
              >
                Nova loja
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>CNPJ</th>
                    <th scope='col'>Nome</th>
                    <th scope='col'>E-mail</th>
                    <th scope='col'>Telefone</th>
                    <th scope='col'>Celular</th>
                    <th scope='col'>Data de Criação</th>
                    <th scope='col'>Logradouro</th>
                    <th scope='col'>Numero</th>
                    <th scope='col'>Complemento</th>
                    <th scope='col'>Bairro</th>
                    <th scope='col'>Cidade</th>
                    <th scope='col'>Estado</th>
                    <th scope='col'>Cep</th>
                    

                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.cnpj}</td>
                      <td>{dado.nome}</td>
                      <td>{dado.email}</td>
                      <td>{dado.telefone}</td>
                      <td>{dado.celular}</td>
                      <td>{dado.dtaCriacao}</td>
                      <td>{dado.logradouro}</td>
                      <td>{dado.numero}</td>
                      <td>{dado.complemento}</td>
                      <td>{dado.bairro}</td>
                      <td>{dado.cidade}</td>
                      <td>{dado.estado}</td>
                      <td>{dado.cep}</td>
                      <td> <Stack spacing={1} padding={0} direction='row'>
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
                        </Stack></td>
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

export default Listagemloja;