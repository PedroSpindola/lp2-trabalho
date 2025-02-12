import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';


import axios from 'axios';
import { BASE_URL } from '../config/axios';

function Cadastroagenda() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/agenda`;

  const [id, setId] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('0');
  const [idServico, setIdServico] = useState(0);
  const [idFuncionario, setIdFuncionario] = useState(0);


  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('')
      setData('');
      setHorario('');
      setIdServico(0);
      setIdFuncionario(0)

    } else {
      setId(dados.id)
      setData(dados.data);
      setHorario(dados.horario);
      setIdServico(dados.idServico);
      setIdFuncionario(dados.idFuncionario);
    }
    navigate(`/listagem-agenda`);
  }

  async function salvar() {
    let data = { id,data, horario, idServico, idFuncionario };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
         
          navigate(`/listagem-agenda`);
        })
        .catch(function (error) {

        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
       
          navigate(`/listagem-agenda`);
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
      setData(dados.data);
      setHorario(dados.horario);
      setIdServico(dados.idServico);
      setIdFuncionario(dados.idFuncionario);
    }
  }


  const [dadosServico, setDadosServico] = React.useState(null);
  useEffect(()=>{
    axios.get(`${BASE_URL}/servico`).then((response) => {
      setDadosServico(response.data);
    });
  },[]);
  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);


  
  
  
  
  
  const [dadosFuncionario, setDadosFuncionario] = React.useState(null);
  useEffect(()=>{
    axios.get(`${BASE_URL}/funcionario`).then((response) => {
      setDadosFuncionario(response.data);
    });
  },[]);
  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;
  if (!dadosServico) return null;
  if (!dados) return null;
  if (!dadosFuncionario) return null;

  

  return (
    <div className='container'>
      <Card title='agenda'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
            
              <FormGroup label='Data: *' htmlFor='inputDataagenda'>
                <input
                  type='text'
                  id='inputdata'
                  value={data}
                  className='form-control'
                  name='Dataagenda'
                  onChange={(e) => setData(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Horario de Preferência: *' htmlFor='inputHorarioagenda'>
                <input
                  type='text'
                  id='inputHorarioagenda'
                  value={horario}
                  className='form-control'
                  name='horarioagenda'
                  onChange={(e) => setHorario(e.target.value)}
                />
              </FormGroup>
             
              <FormGroup label= 'Serviço Desejado *' htmlFor='selectServico'>
                <select className='form-select'
                id='selectServico'
                name='idServico'
                value={idServico}
                onChange={(e)=>setIdServico(e.target.value)}>
                  <option key='0' value='0'>
                    {''}
                  </option>
                  {dadosServico.map((dado)=>(

                    <option key={dado.id} value={dado.id}>
                      {dado.nome}
                    </option>
                  ))}
                </select>
              </FormGroup>
              
              <FormGroup label= 'Funcionário de Preferência' htmlFor='selectFuncionario'>
                <select className='form-select'
                id='selectFuncionario'
                name='idFuncionario'
                value={idFuncionario}
                onChange={(e)=>setIdFuncionario(e.target.value)}>
                  <option key='0' value='0'>
                    {''}
                  </option>
                  {dadosFuncionario.map((dado)=>(

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

export default Cadastroagenda;
