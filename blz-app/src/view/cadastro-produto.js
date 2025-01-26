import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';


import axios from 'axios';
import { BASE_URL } from '../config/axios';

function Cadastroprodutos() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/produtos`;

  const [id, setId] = useState('');
  const [nome, setnome] = useState('');
  const [valorvenda, setValorVenda] = useState('0');
  const [quantidade, setQuantidade] = useState('0');
  const [dataValidade, setDataValidade] = useState('');
  const [idFornecedor, setIdFornecedor] = useState(0);


  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('')
      setnome('');
      setValorVenda('');
      setQuantidade('');
      setDataValidade('');
      setIdFornecedor(0)

    } else {
      setId(dados.id)
      setnome(dados.nome);
      setValorVenda(dados.valorvenda);
      setQuantidade(dados.quantidade);
      setDataValidade(dados.dataValidade);
      setIdFornecedor(dados.idFornecedor);
    }
  }

  async function salvar() {
    let data = { id,nome, valorvenda, quantidade, dataValidade, idFornecedor };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
         
          navigate(`/listagem-produto`);
        })
        .catch(function (error) {

        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
       
          navigate(`/listagem-produto`);
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
      setId(dados.id);
      setnome(dados.nome);
      setValorVenda(dados.valorvenda);
      setQuantidade(dados.quantidade);
      setDataValidade(dados.dataValidade);
      setIdFornecedor(dados.idFornecedor);
    }
  }


  const [dadosFornecedor, setDadosFornecedor] = React.useState(null);
  useEffect(()=>{
    axios.get(`${BASE_URL}/fornecedor`).then((response) => {
      setDadosFornecedor(response.data);
    });
  },[]);
  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;
  if (!dadosFornecedor) return null;

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
                  name='nomeprodutos'
                  onChange={(e) => setnome(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='preço: *' htmlFor='inputvalorvenda'>
                <input
                  type='text'
                  id='inputvalorvenda'
                  value={valorvenda}
                  className='form-control'
                  name='valorvendaprodutos'
                  onChange={(e) => setValorVenda(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='quantidade: *' htmlFor='inputquantidade'>
                <input
                  type='text'
                  id='inputquantidade'
                  value={quantidade}
                  className='form-control'
                  name='quantidadeprodutos'
                  onChange={(e) => setQuantidade(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='dataValidade: *' htmlFor='inputdataValidade'>
                <input
                  type='text'
                  id='inputdataValidade'
                  value={dataValidade}
                  className='form-control'
                  name='dataValidadeprodutos'
                  onChange={(e) => setDataValidade(e.target.value)}
                />
              </FormGroup>
              <FormGroup label= 'Fornecedor' htmlFor='selectFornecedor'>

                <select className='form-select'
                id='selectFornecedor'
                name='idFornecedor'
                value={idFornecedor}
                onChange={(e)=>setIdFornecedor(e.target.value)}>
                  <option key='0' value='0'>
                    {''}
                  </option>
                  {dadosFornecedor.map((dado)=>(

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

export default Cadastroprodutos;
