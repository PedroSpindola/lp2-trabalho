import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';


import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroColaborador() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/colaboradores`;

  const [id, setId] = useState('');
  const [cpf, setCpf] = useState('');
  const [nome, setnome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [idCargo, setIdCargo] = useState(0);
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
      setIdCargo(0);
      setIdLoja(0);

    } else {
      setId(dados.id)
      setCpf(dados.cpf);
      setnome(dados.nome);
      setTelefone(dados.telefone);
      setCelular(dados.celular);
      setEmail(dados.email);
      setSenha(dados.senha);
      setIdCargo(dados.idCargo);
      setIdLoja(dados.idLoja);
    }
    navigate(`/listagem-colaborador`);
  }

  async function salvar() {
    let data = { id,cpf, nome, telefone, celular, email, senha,idCargo, idLoja};
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
         
          navigate(`/listagem-colaborador`);
        })
        .catch(function (error) {

        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
       
          navigate(`/listagem-Colaborador`);
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
        
    }
  
    setId(dados.id)
    setCpf(dados.cpf);
    setnome(dados.nome);
    setTelefone(dados.telefone);
    setCelular(dados.celular);
    setEmail(dados.email);
    setSenha(dados.senha);
    setIdCargo(dados.idCargo);
    setIdLoja(dados.idLoja);
  }
  const [dadosCargos,setDadosCargos] = React.useState(null)
  const [dadosLoja,setDadosLoja] = React.useState(null)

  useEffect(()=>{

    axios.get(`${BASE_URL}/cargos`).then((response) => {
      setDadosCargos(response.data);
      setDadosLoja(response.data);
    });
  },[]);

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if (!dados) return null;
  if(!dadosCargos) return null; 
  return (
    <div className='container'>
      <Card title='Cadastro de Usuário'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
            <FormGroup label='Cpf: *' htmlFor='inputCpf'>
                <input
                  type='text'
                  id='inputCpf'
                  value={cpf}
                  className='form-control'
                  name='cpfColaborador'
                  onChange={(e) => setnome(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input
                  type='text'
                  id='inputNome'
                  value={nome}
                  className='form-control'
                  name='nomeColaborador'
                  onChange={(e) => setnome(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Telefone: *' htmlFor='inputTelefone'>
                <input
                  type='text'
                  id='inputTelefone'
                  value={telefone}
                  className='form-control'
                  name='telefoneColaborador'
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Celular: *' htmlFor='inputCelular'>
                <input
                  type='text'
                  id='inputCelular'
                  value={celular}
                  className='form-control'
                  name='celularColaborador'
                  onChange={(e) => setCelular(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Email: *' htmlFor='inputEmail'>
                <input
                  type='text'
                  id='inputEmail'
                  value={email}
                  className='form-control'
                  name='EmailColaborador'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup label = "Cargo:" htmlFor='selectCargo'>

                <select className='form-select'
                type='select'
                id='selectCargo'
                name='cargoColaborador'
                value={idCargo}
                onChange={(e)=> setIdCargo(e.target.value)}>

                  {dadosCargos.map((dado)=>(
                    <option key={dado.id} value={dado.id}>
              

                      {dado.nome}

                    </option>

                  ))}

                </select>

              </FormGroup>
              
                <FormGroup label = 'Loja:' htmlFor='selectLoja'>

                  <select className='form-select'
                  type='select'
                  id='selectLoja'
                  name='lojaColaborador'
                  value={idLoja}
                  onChange={(e)=>setIdLoja(e.target.value)}>

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

export default CadastroColaborador;