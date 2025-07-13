import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';




import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroCargo() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/cargos`;

  const [id, setId] = useState('');
  const [nome, setnome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idLoja, setIdLoja] = useState('')



  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setnome('');
      setDescricao('');
      setIdLoja('')
    } else {
      setId(dados.id);
      setnome(dados.nome);
      setDescricao(dados.descricao);
      setIdLoja(dados.idLoja);
    }
    navigate(`/listagem-cargo`);
  }

  async function salvar() {
    let data = { id, nome, descricao, idLoja };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {

          navigate(`/listagem-cargo`);
        })
        .catch(function (error) {

        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {

          navigate(`/listagem-cargo`);
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
    setDescricao(dados.descricao);
    setIdLoja(dados.idLoja);
  }

  const [dadosLojas, setDadosLojas] = React.useState(null);
  useEffect(() => {
    axios.get(`${BASE_URL}/lojas`).then((response) => {
      setDadosLojas(response.data);
    });
  }, []);
  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;
  if(!dadosLojas) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Usuário'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Cargo: *' htmlFor='inputcargo'>
                <input
                  type='text'
                  id='inputcargo'
                  value={nome}
                  className='form-control'
                  name='cargo'
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
              <FormGroup label='Loja: *' htmlFor='selectLoja'>
                <select className='form-select'
                  id='selectLoja'
                  name='idLoja'
                  value={idLoja}
                  onChange={(e) => setIdLoja(e.target.value)}>
                  <option key='0' value='0'>
                    {''}
                  </option>
                  {dadosLojas.map((dado) => (

                    <option key={dado.id} value={dado.id}>
                      {dado.nome}
                    </option>
                  ))}
                </select>
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

export default CadastroCargo;