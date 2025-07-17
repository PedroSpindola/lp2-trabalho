import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';


import axios from 'axios';
import { BASE_URL } from '../config/axios';

function Cadastroservico() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/servicos`;
  

  const [id, setId] = useState('');
  const [nome, setnome] = useState('');
  const [preco, setPreco] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const [idCargo, setIdCargo] = useState(0)
  const [idLoja, setIdLoja] = useState(0)
  const [comissao, setComissao] = useState(0)
  const [desconto, setDesconto] = useState(0)


  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('')
      setnome('');
      setPreco('');
      setDuracao('');
      setIdCargo(0);
      setIdLoja(0)
      setComissao(0);
      setDesconto(0);

    } else {
      setId(dados.id)
      setnome(dados.nome);
      setPreco(dados.preco);
      setDuracao(dados.duracao);
      setIdCargo(dados.idCargo)
      setIdLoja(dados.idLoja)
      setComissao(dados.comissao);
      setDesconto(dados.desconto);
    }
    navigate(`/listagem-servico`);
  }

  async function salvar() {
    let data = { id,nome, preco,duracao,comissao, desconto,idCargo,idLoja};
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
         
          navigate(`/listagem-servico`);
        })
        .catch(function (error) {

        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
       
          navigate(`/listagem-servico`);
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
    setPreco(dados.preco);
    setDuracao(dados.duracao);
    setIdCargo(dados.idCargo)
    setComissao(dados.comissao);
    setDesconto(dados.desconto);
    setIdLoja(dados.idLoja)

  }

  const [dadosCargos, setDadosCargos] = React.useState(null)
  const [dadosLoja, setDadosLoja] = React.useState(null)

  useEffect(()=>{

    axios.get(`${BASE_URL}/cargos`).then((response) => {
      setDadosCargos(response.data);
    });

  },[])

  useEffect(()=>{

    axios.get(`${BASE_URL}/lojas`).then((response) => {
      setDadosLoja(response.data);
    });

  },[])

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [id]);

  if(!dados) return null;
  if(!dadosLoja) return null;
  if(!dadosCargos) return null;

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
                  name='nomeservico'
                  onChange={(e) => setnome(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Preço: *' htmlFor='inputpreco'>
                <input
                  type='text'
                  id='inputpreco'
                  value={preco}
                  className='form-control'
                  name='precoservico'
                  onChange={(e) => setPreco(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Duração (min):  *' htmlFor='inputduracao'>
                <input
                  type='text'
                  id='inputduracao'
                  value={duracao}
                  className='form-control'
                  name='duracaoservico'
                  onChange={(e) => setDuracao(e.target.value)}
                />
              </FormGroup>

                <FormGroup label='Comissão' htmlFor='inputcomissao'>
                <input
                  type='text'
                  id='inputcomissao'
                  value={comissao}
                  className='form-control'
                  name='comissaoservico'
                  onChange={(e) => setComissao(e.target.value)}
                />
              </FormGroup>


               <FormGroup label='Desconto:' htmlFor='inputdesconto'>
                <input
                  type='text'
                  id='inputdesconto'
                  value={desconto}
                  className='form-control'
                  name='descontoservico'
                  onChange={(e) => setDesconto(e.target.value)}
                />
              </FormGroup>

              <FormGroup label= 'Cargo: ' htmlFor= 'selectCargo'>
                <select
                  className='form-select'
                  id='selectCarogo'
                  name='idCargo'
                  value={idCargo}
                >
                  {dadosCargos.map((dado)=>(
                    <option key={dado.id} value={dado.id}>

                      {dado.nome}
                    
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label= 'Cadastrar serviço na loja: *' htmlFor= 'selectLoja'>
                <select
                  className='form-select'
                  id='selectLoja'
                  name='idLoja'
                  value={idLoja}
                  onChange={(e) => setIdLoja(e.target.value)}
                >
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

export default Cadastroservico;