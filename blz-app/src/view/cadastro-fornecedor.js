import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';


import axios from 'axios';
import { BASE_URL } from '../config/axios';


function CadastroFornecedor() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/fornecedores`;

  const [id, setId] = useState('');
  const [nome, setnome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [dtaNasc, setDtaNasc] = useState('');
  const [idLoja, setIdLoja] = useState(0);
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');


  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('')
      setnome('');
      setTelefone('(xx) xxxx-xxxx');
      setCelular('(xx) xxxxx-xxxx');
      setEmail('');
      setDtaNasc('');
      setIdLoja(0);
      setCnpj('');
      setCpf('');
    } else {
      setId(dados.id);
      setnome(dados.nome);
      setTelefone(dados.telefone);
      setCelular(dados.celular);
      setEmail(dados.email);
      setDtaNasc(dados.dtaNasc);
      setIdLoja(dados.idLoja);
      setCpf(dados.cpf);
      setCnpj(dados.cnpj);
    }
    navigate(`/listagem-fornecedor`);
  }

  async function salvar() {
    let data = { id, nome, telefone, celular, email, dtaNasc, idLoja, cpf,cnpj };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
         
          navigate(`/listagem-fornecedor`);
        })
        .catch(function (error) {

        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
       
          navigate(`/listagem-fornecedor`);
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
    setId(dados.id)
    setnome(dados.nome);
    setTelefone(dados.telefone);
    setCelular(dados.celular);
    setEmail(dados.email);
    setDtaNasc(dados.dtaNasc);
    setIdLoja(dados.idLoja);
    setCpf(dados.cpf);
    setCnpj(dados.cnpj);
  }

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  const [dadosLoja, setDadosLoja] = React.useState(null);
  useEffect(()=>{
    axios.get(`${BASE_URL}/lojas`).then((response) => {
      setDadosLoja(response.data);
    });
  },[]);
  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if(!dados) return null;
  if(!dadosLoja) return null;


  return (
    <div className='container'>
      <Card title='Cadastro de Usuário'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>

              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input
                  type='text'
                  id='inputNome'
                  value={nome}
                  className='form-control'
                  name='nomefornecedor'
                  onChange={(e) => setnome(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Telefone: *' htmlFor='inputTelefone'>
                <input
                  type='text'
                  id='inputTelefone'
                  value={telefone}
                  className='form-control'
                  name='telefonefornecedor'
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Celular: *' htmlFor='inputCelular'>
                <input
                  type='text'
                  id='inputCelular'
                  value={celular}
                  className='form-control'
                  name='celularfornecedor'
                  onChange={(e) => setCelular(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Email: *' htmlFor='inputEmail'>
                <input
                  type='text'
                  id='inputEmail'
                  value={email}
                  className='form-control'
                  name='Emailfornecedor'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>

                <FormGroup label='CPF: ' htmlFor='inputcpf'>
                <input
                  type='text'
                  id='inputcpf'
                  value={cpf}
                  className='form-control'
                  name='cpfFornecedor'
                  onChange={(e) => setCpf(e.target.value)}
                />
              </FormGroup>

                  <FormGroup label='CNPJ: ' htmlFor='inputCNPJ'>
                <input
                  type='text'
                  id='inputcnpj'
                  value={cnpj}
                  className='form-control'
                  name='CNPJfornecedor'
                  onChange={(e) => setCnpj(e.target.value)}
                />
              </FormGroup>





              <FormGroup label= 'Fornecedor da Loja:' htmlFor='selectLoja'>
                <select className='form-select'
                id='selectLoja'
                name='idLoja'
                value={idLoja}
                onChange={(e)=>setIdLoja(e.target.value)}>
                  <option key='0' value='0'>
                    {''}
                  </option>
                  {dadosLoja.map((dado)=>(

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

export default CadastroFornecedor;