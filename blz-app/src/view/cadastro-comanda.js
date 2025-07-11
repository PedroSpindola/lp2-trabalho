import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';


import axios from 'axios';
import { BASE_URL } from '../config/axios';

function Cadastrocomanda() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/comandas`;
  

  const [id, setId] = useState('');
  const [idFormaPagamento, setidFormaPagamento] = useState(0);
  const [horario, setHorario] = useState('0');
  const [data, setData] = useState('0');
  const [idAgendamento, setidAgendamento] = useState(0)


  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('')
      setidFormaPagamento(0);
      setHorario('');
      setData('');
      setidAgendamento(0);

    } else {
      setId(dados.id)
      setnome(dados.idFormaPagamento);
      setPreco(dados.horario);
      setDuracao(dados.data);
      setIdCargo(dados.idAgendamento)
    }
    navigate(`/listagem-comanda`);
  }

  async function salvar() {
    let data = { id,idFormaPagamento,horario,data,idAgendamento};
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
         
          navigate(`/listagem-comanda`);
        })
        .catch(function (error) {

        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
       
          navigate(`/listagem-comanda`);
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
      setidFormaPagamento(dados.idFormaPagamento);
      setHorario(dados.horario);
      setData(dados.data);
      setidAgendamento(dados.idAgendamento);

  }

  const [dadosFormaPagamento, setDadosFormaPagamento] = React.useState(null)
  const [dadosAgendamento, setDadosAgendamento] = React.useState(null)

  useEffect(()=>{

    axios.get(`${BASE_URL}/forma-pagamento`).then((response) => {
      setDadosFormaPagamento(response.data);
    });

  },[])

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);
  useEffect(()=>{

    axios.get(`${BASE_URL}/agendamento`).then((response) => {
      setDadosAgendamento(response.data);
    });

  },[])

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);



  if (!dados) return null;
  if(!dadosFormaPagamento) return null;
  if(!dados) return null;
  if(!dadosAgendamento) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Comanda'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
            
             <FormGroup label= 'Forma de Pagamento: *' htmlFor='selectFormaPagamento'>

                <select className='form-select'
                id='selectFormaPagamento'
                name='idFormaPagamento'
                value={idFormaPagamento}
                onChange={(e)=>setIdFormaPagamento(e.target.value)}>
                  <option key='0' value='0'>
                    {''}
                  </option>
                  {dadosFormaPagamento.map((dado)=>(

                    <option key={dado.id} value={dado.id}>
                      {dado.nome}
                    </option>
                  ))}
                    


                </select>
              </FormGroup>



              <FormGroup label='Horario: ' htmlFor='inputHorario'>
                <input
                  type='text'
                  id='inputHorario'
                  value={horario}
                  className='form-control'
                  name='horarioComanda'
                  onChange={(e) => setHorario(e.target.value)}
                />
              </FormGroup>


                 <FormGroup label='Data: ' htmlFor='inputData'>
                <input
                  type='text'
                  id='inputData'
                  value={data}
                  className='form-control'
                  name='dataComanda'
                  onChange={(e) => setData(e.target.value)}
                />
              </FormGroup>
              

            <FormGroup label= 'Agendamento: *' htmlFor='selectAgendamento'>
                <select className='form-select'
                id='selectAgendamento'
                name='idAgendamento'
                value={idAgendamento}
                onChange={(e)=>setidAgendamento(e.target.value)}>
                  <option key='0' value='0'>
                    {''}
                  </option>
                  {dadosAgendamento.map((dado)=>(

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

export default Cadastrocomanda;