import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InputMask from 'react-input-mask';
import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';


import axios from 'axios';
import { BASE_URL } from '../config/axios';
import { mensagemErro, mensagemSucesso } from '../components/toastr';


function CadastroFornecedor() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/fornecedores`;

  const [id, setId] = useState('');
  const [nome, setnome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
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
      setCnpj('');
      setCpf('');
    } else {
      setId(dados.id);
      setnome(dados.nome);
      setTelefone(dados.telefone);
      setCelular(dados.celular);
      setEmail(dados.email);
      setIdLoja(dados.idLoja);
      setCpf(dados.cpf);
      setCnpj(dados.cnpj);
    }
    navigate(`/listagem-fornecedor`);
  }

  async function salvar() {
    let data = { id, nome, telefone, celular, email, idLoja, cpf, cnpj };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Fornecedor ${nome} cadastrado com sucesso!`);
          navigate(`/listagem-fornecedor`);
        })
        .catch(function (error) {
          mensagemErro(error.response.data)
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Fornecedor ${nome} alterado com sucesso!`);
          navigate(`/listagem-fornecedor`);
        })
        .catch(function (error) {
          mensagemErro(error.response.data)
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
    setCpf(dados.cpf);
    setCnpj(dados.cnpj);
  }

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;

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
                <InputMask
                  mask="(99) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                >
                  {(inputProps) => (
                    <input
                      {...inputProps}
                      type="text"
                      id="inputTelefone"
                      name="telefone"
                      className="form-control"
                    />
                  )}
                </InputMask>
              </FormGroup>
              <FormGroup label='Celular: *' htmlFor='inputCelular'>
                <InputMask
                  mask="(99) 99999-9999"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                >
                  {(inputProps) => (
                    <input
                      {...inputProps}
                      type="text"
                      id="inputCelular"
                      name="celular"
                      className="form-control"
                    />
                  )}
                </InputMask>
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

              <FormGroup label='CPF:' htmlFor='inputCpf'>
                <InputMask
                  mask="999.999.999-99"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                >
                  {(inputProps) => (
                    <input
                      {...inputProps}
                      type="text"
                      id="inputCpf"
                      name="cpf"
                      className="form-control"
                    />
                  )}
                </InputMask>
              </FormGroup>

              <FormGroup label='CNPJ: *' htmlFor='inputCnpj'>
                <InputMask
                  mask="99.999.999/9999-99"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                >
                  {(inputProps) => (
                    <input
                      {...inputProps}
                      type="text"
                      id="inputCnpj"
                      name="cnpj"
                      className="form-control"
                    />
                  )}
                </InputMask>
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