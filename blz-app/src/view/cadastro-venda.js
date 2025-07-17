import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';


import axios from 'axios';
import {BASE_URL} from '../config/axios';

function Cadastrovenda() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/vendas`;

  const [id, setId] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [IdProduto, setIdProduto] = useState(0);
  const [dataVenda, setdata] = useState('');
  const [horario, setHorario] = useState('');
  const [idFormaPagamento,setIdFormaPagamento] = useState('');


  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('')
      setIdUsuario('');
      setIdProduto(0);
      setdata('');
      setHorario('');
      setIdFormaPagamento('');

    } else {
      setId(dados.id)
      setIdUsuario(dados.idUsuario);
      setIdProduto(dados.IdProduto);
      setdata(dados.dataVenda);
      setHorario(dados.horario);
      setIdFormaPagamento(dados.idFormaPagamento);
    }
      navigate(`/listagem-venda`);
  }

  async function salvar() {
    let data = { id,idUsuario, dataVenda, horario,idFormaPagamento };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
         
          navigate(`/listagem-venda`);
        })
        .catch(function (error) {

        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
       
          navigate(`/listagem-venda`);
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
      setIdUsuario(dados.idUsuario);
      setIdProduto(dados.IdProduto);
      setdata(dados.dataVenda);
      setHorario(dados.horario);
      setIdFormaPagamento(dados.idFormaPagamento);
    }
  }


  const [dadosProdutos, setDadosProdutos] = React.useState(null);
  const [dadosFormaPagamento, setDadosFormaPagamento] = React.useState(null);
  const [dadosUsuario, setDadosUsuario] = React.useState(null);
  useEffect(()=>{
    axios.get(`${BASE_URL}/produtos`).then((response) => {
      setDadosProdutos(response.data);
    });
  },[]);
  useEffect(()=>{
    axios.get(`${BASE_URL}/formapagamento`).then((response) => {
      setDadosFormaPagamento(response.data);
    });
  },[]);
  useEffect(()=>{
    axios.get(`${BASE_URL}/usuarios`).then((response) => {
      setDadosUsuario(response.data);
    });
  },[]);
  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;
  if (!dadosProdutos) return null;
  if(!dadosFormaPagamento) return null;
  if(!dadosUsuario) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Usuário'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
            
              <FormGroup label='Cliente: ' htmlFor='selectCliente'>
                <select
                  className='form-select'
                  id='selectCliente'
                  name='idCliente'
                  value={idUsuario}
                  onChange={(e) => setIdUsuario(e.target.value)}>
                
                  {dadosUsuario.map((dado)=>(
                    <option key={dado.id} value={dado.id}>

                      {dado.nome}
                    
                    </option>
                  ))}
                </select>
              </FormGroup>
              
              <FormGroup label= 'Produto:' htmlFor= 'selectProduto'>
                <select
                  className='form-select'
                  id='selectProduto'
                  name='idProduto'
                  value={IdProduto}
                   onChange={(e) => setIdUsuario(e.target.value)}

        
                >
                  {dadosProdutos.map((dado)=>(
                    <option key={dado.id} value={dado.id}>

                      {dado.nome}
                    
                    </option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup label= 'Forma de Pagamento:' htmlFor= 'selectFormadePagamento'>
                <select
                  className='form-select'
                  id='selectFormadePagamento'
                  name='idFormadePagamento'
                  value={idFormaPagamento}
                  onChange={(e) => setIdFormaPagamento(e.target.value)}
                >
                  {dadosFormaPagamento.map((dado)=>(
                    <option key={dado.id} value={dado.id}>

                      {dado.nome}
                    
                    </option>
                  ))}
                </select>
              </FormGroup>
             
           
              <FormGroup label='Data da Venda: ' htmlFor='inputdataVenda'>
                <input
                  type='text'
                  id='inputdataVenda'
                  value={dataVenda}
                  className='form-control'
                  name='dataVenda'
                  onChange={(e) => setdata(e.target.value)}
                />
              </FormGroup>
              
              <FormGroup label='Hora da Venda:' htmlFor='inputhoraVenda'>
                <input
                  type='text'
                  id='inputhoraVenda'
                  value={horario}
                  className='form-control'
                  name='dataVenda'
                  onChange={(e) => setHorario(e.target.value)}
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

export default Cadastrovenda;
