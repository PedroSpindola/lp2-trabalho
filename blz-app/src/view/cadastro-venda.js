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
  const [cliente, setcliente] = useState('');
  const [IdProduto, setIdProduto] = useState(0);
  const [data, setdata] = useState('');
  const [horario, setHorario] = useState('');


  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('')
      setcliente('');
      setIdProduto(0);
      setdata('');
      setHorario('')

    } else {
      setId(dados.id)
      setcliente(dados.cliente);
      setIdProduto(dados.IdProduto);
      setdata(dados.data);
      setHorario(dados.horario);
    }
      navigate(`/listagem-venda`);
  }

  async function salvar() {
    let data = { id,cliente, IdProduto, data, horario };
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
      setcliente(dados.cliente);
      setIdProduto(dados.IdProduto);
      setdata(dados.data);
      setHorario(dados.horario);
    }
  }


  const [dadosProdutos, setDadosProdutos] = React.useState(null);
  useEffect(()=>{
    axios.get(`${BASE_URL}/produtos`).then((response) => {
      setDadosProdutos(response.data);
    });
  },[]);
  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;
  if (!dadosProdutos) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Usuário'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
            
              <FormGroup label='Cliente: ' htmlFor='inputcliente'>
                <input
                  type='text'
                  id='inputcliente'
                  value={cliente}
                  className='form-control'
                  name='clientevenda'
                  onChange={(e) => setcliente(e.target.value)}
                />
              </FormGroup>
              
              <FormGroup label= 'Produto:' htmlFor= 'selectProduto'>
                <select
                  className='form-select'
                  id='selectProduto'
                  name='idProduto'
                  value={IdProduto}
                >
                  {dadosProdutos.map((dado)=>(
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
                  value={data}
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
