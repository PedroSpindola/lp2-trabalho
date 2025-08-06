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

const baseURL = `${BASE_URL}/cargos`;

function Listagemcargo() {
  const navigate = useNavigate();
  const [dados, setDados] = React.useState(null);

  const cadastrar = () => {
    navigate(`/cadastro-cargo`);
  };

  const editar = (id) => {
    navigate(`/cadastro-cargo/${id}`);
  };

  async function excluir(id) {
    await axios.delete(`${baseURL}/${id}`)
      .then(function (response) {
        mensagemSucesso(`Cargo excluído com sucesso!`);
        // Atualiza o estado para remover o item excluído da lista
        setDados(dados.filter((dado) => dado.id !== id));
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir o cargo.`);
      });
  }

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
                    <th scope='col'>Nome</th>
                    <th scope='col'>Loja</th>
                    <th scope='col'>Descrição</th>
                    <th scope='col' style={{ width: '10%' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.nome}</td>
                      <td>{dado.nomeLoja}</td>
                      <td>{dado.descricao}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton aria-label='edit' onClick={() => editar(dado.id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton aria-label='delete' onClick={() => excluir(dado.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
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