import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';


import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroCliente() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/Clientes`;

  const [id, setId] = useState('');
  const [cpf, setCpf] = useState('');
  const [nome, setnome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [idLoja, setIdLoja] = useState(0);


  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('')
      setCpf('');
      setnome('');
      setTelefone('(xx) xxxx-xxxx');
      setCelular('(xx) xxxxx-xxxx');
      setEmail('');
      setSenha('');
      setIdLoja(0);
    } else {
      setId(dados.id)
      setCpf(dados.cpf);
      setnome(dados.nome);
      setTelefone(dados.telefone);
      setCelular(dados.celular);
      setEmail(dados.email);
      setSenha(dados.senha);
      setIdLoja(dados.idLoja);
    }
     navigate(`/listagem-cliente`);
  }

  async function salvar() {
    let data = { id,cpf, nome, telefone, celular, email, senha, idLoja };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
         
          navigate(`/listagem-cliente`);
        })
        .catch(function (error) {

        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
       
          navigate(`/listagem-cliente`);
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
    setCpf(dados.cpf);
    setnome(dados.nome);
    setTelefone(dados.telefone);
    setCelular(dados.celular);
    setEmail(dados.email);
    setSenha(dados.senha);
    setIdLoja(dados.idLoja);
  }

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  const [dadosLoja, setDadosLoja] = React.useState(null);
  useEffect(()=>{
    axios.get(`${BASE_URL}/Loja`).then((response) => {
      setDadosLoja(response.data);
    });
  },[]);
  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;
  if (!dadosLoja) return null;
  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Usuário'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
            <FormGroup label='CPF: *' htmlFor='inputCpf'>
                <input
                  type='text'
                  id='inputCpf'
                  value={cpf}
                  className='form-control'
                  name='cpfCliente'
                  onChange={(e) => setnome(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input
                  type='text'
                  id='inputNome'
                  value={nome}
                  className='form-control'
                  name='nomeCliente'
                  onChange={(e) => setnome(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Telefone: *' htmlFor='inputTelefone'>
                <input
                  type='text'
                  id='inputTelefone'
                  value={telefone}
                  className='form-control'
                  name='telefoneCliente'
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Celular: *' htmlFor='inputCelular'>
                <input
                  type='text'
                  id='inputCelular'
                  value={celular}
                  className='form-control'
                  name='celularCliente'
                  onChange={(e) => setCelular(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Email: *' htmlFor='inputEmail'>
                <input
                  type='text'
                  id='inputEmail'
                  value={email}
                  className='form-control'
                  name='EmailCliente'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>

              <FormGroup label= 'Cliente da Loja:' htmlFor='selectLoja'>
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

export default CadastroCliente;