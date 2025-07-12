import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';




import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroFormaPagamento() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/formapagamento`;

  const [id, setId] = useState('');
  const [nome, setnome] = useState('');
  const [descricao, setDescricao] = useState('');
  


  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setnome('');
      setDescricao('');
    } else {
      setId(dados.id);
      setnome(dados.nome);
      setDescricao(dados.descricao);
    }
    navigate(`/listagem-forma-pagamento`);
  }

  async function salvar() {
    let data = { id, nome, descricao };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
         
          navigate(`/listagem-forma-pagamento`);
        })
        .catch(function (error) {

        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
       
          navigate(`/listagem-forma-pagamento`);
        })
        .catch(function (error) {

        });
    }
  }

  async function buscar() {
    await axios.get(`${baseURL}/${idParam}`).then((response) => {
      setDados(response.data);
    }).catch((a) => {
      console.log(a);
    });
    setId(dados.id);
    setnome(dados.nome);
  }

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Cadastro Forma de Pagamentos'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Forma de Pagamento: *' htmlFor='inputFormaPagamento'>
                <input
                  type='text'
                  id='inputformaPagamento'
                  value={nome}
                  className='form-control'
                  name='formaPagamento'
                  onChange={(e) => setnome(e.target.value)}
                />
              </FormGroup>

               <FormGroup label='Descrição: ' htmlFor='inputdescricao'>
                <input
                  type='text'
                  id='inputdescricao'
                  value={descricao}
                  className='form-control'
                  name='descricao'
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </FormGroup>
              

              <Stack spacing={1} padding={1} direction='row'>
                <button
                  onClick={salvar}
                  type='button'
                  className='btn btn-success'
                >
                  Salvar
                </button>
                <button
                  onClick={inicializar}
                  type='button'
                  className='btn btn-danger'
                >
                  Cancelar
                </button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroFormaPagamento;