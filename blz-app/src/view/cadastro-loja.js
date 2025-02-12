import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';


import axios from 'axios';

import { BASE_URL2 } from '../config/axios2';

function CadastroLoja() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL2}/loja`;

  const [id, setId] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [nome, setnome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [dtaCriacao, setDtaCriacao] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');

  
  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {

    } else {
      setId(dados.id)
      setCnpj(dados.cnpj);
      setnome(dados.nome);
      setTelefone(dados.telefone);
      setCelular(dados.celular);
      setEmail(dados.email);
      setLogradouro(dados.logradouro);
      setDtaCriacao(dados.dtaCriacao);
      setNumero(dados.numero)
      setComplemento(dados.complemento)
      setBairro(dados.bairro)
      setCidade(dados.cidade)
      setEstado(dados.estado)
      setCep(dados.cep)
    }
    navigate(`/listagem-loja`);
  }

  async function salvar() {
    let data = { id,cnpj, nome, telefone, celular, email, logradouro, dtaCriacao,numero, complemento, bairro,cidade,estado,cep };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
         
          navigate(`/listagem-loja`);
        })
        .catch(function (error) {

        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
       
          navigate(`/listagem-loja`);
        })
        .catch(function (error) {

        });
    }
  }

  async function buscar() {
  
    if (idParam != null) {
      await axios.get(`${baseURL}/${idParam}`).then((response) => {
        setDados(response.data);
      }).catch((a) => {
        console.log(a);
      });
  
      setId(dados.id)
      setCnpj(dados.cnpj);
      setnome(dados.nome);
      setTelefone(dados.telefone);
      setCelular(dados.celular);
      setEmail(dados.email);
      setLogradouro(dados.logradouro);
      setDtaCriacao(dados.dtaCriacao);
      setNumero(dados.numero)
      setComplemento(dados.complemento)
      setBairro(dados.bairro)
      setCidade(dados.cidade)
      setEstado(dados.estado)
      setCep(dados.cep)
    }
  }

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Imformações da loja'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
            <FormGroup label='CNPJ: *' htmlFor='inputCnpj'>
                <input
                  type='text'
                  id='inputCnpj'
                  value={cnpj}
                  className='form-control'
                  name='cnpjloja'
                  onChange={(e) => setnome(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input
                  type='text'
                  id='inputNome'
                  value={nome}
                  className='form-control'
                  name='nomeloja'
                  onChange={(e) => setnome(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Telefone: *' htmlFor='inputTelefone'>
                <input
                  type='text'
                  id='inputTelefone'
                  value={telefone}
                  className='form-control'
                  name='telefoneloja'
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Celular: *' htmlFor='inputCelular'>
                <input
                  type='text'
                  id='inputCelular'
                  value={celular}
                  className='form-control'
                  name='celularloja'
                  onChange={(e) => setCelular(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Email: *' htmlFor='inputEmail'>
                <input
                  type='text'
                  id='inputEmail'
                  value={email}
                  className='form-control'
                  name='Emailloja'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Data de Criação: *' htmlFor='inputDtaCriacao'>
                <input
                  type='text'
                  id='inputDtaCriacao'
                  value={dtaCriacao}
                  className='form-control'
                  name='dtaCriacaoloja'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>    
            </div>
          </div>
        </div>
      </Card>
      <Card title='Localização da loja'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
            <FormGroup label='Logradouro: *' htmlFor='inputLogradouro'>
                <input
                  type='text'
                  id='inputLogradouro'
                  value={logradouro}
                  className='form-control'
                  name='Logradouroloja'
                  onChange={(e) => setLogradouro(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Numero: *' htmlFor='inputNumero'>
                <input
                  type='text'
                  id='inputNumero'
                  value={numero}
                  className='form-control'
                  name='numeroloja'
                  onChange={(e) => setNumero(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Complemento: *' htmlFor='inputComplemento'>
                <input
                  type='text'
                  id='inputComplemento'
                  value={complemento}
                  className='form-control'
                  name='complementoloja'
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Celular: *' htmlFor='inputBairro'>
                <input
                  type='text'
                  id='inputBairro'
                  value={bairro}
                  className='form-control'
                  name='bairroloja'
                  onChange={(e) => setBairro(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Cidade: *' htmlFor='inputCidade'>
                <input
                  type='text'
                  id='inputCidade'
                  value={cidade}
                  className='form-control'
                  name='Cidadeloja'
                  onChange={(e) => setCidade(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Estado: *' htmlFor='inputEstado'>
                <input
                  type='text'
                  id='inputEstado'
                  value={estado}
                  className='form-control'
                  name='estadoloja'
                  onChange={(e) => setEstado(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='CEP: *' htmlFor='inputCep'>
                <input
                  type='text'
                  id='inputcep'
                  value={cep}
                  className='form-control'
                  name='ceploja'
                  onChange={(e) => setCep(e.target.value)}
                />
              </FormGroup>
              
              
            </div>
          </div>
        </div>
      </Card>
      <Card title='Deseja salvar?'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
            
              
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

export default CadastroLoja;