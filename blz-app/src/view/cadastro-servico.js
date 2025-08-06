import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import { mensagemErro, mensagemSucesso } from '../components/toastr';

function CadastroServico() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/servicos`;

  const isNew = idParam == null;

  // Estados dos campos do formulário
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('');
  const [idCargo, setIdCargo] = useState('');
  const [idLoja, setIdLoja] = useState('');
  const [comissao, setComissao] = useState('');
  const [desconto, setDesconto] = useState('');

  // Estados para carregar os selects
  const [dadosCargos, setDadosCargos] = useState([]);
  const [dadosLojas, setDadosLojas] = useState([]);

  // CORREÇÃO: O useEffect agora busca os dados apenas quando o componente monta (se houver idParam)
  useEffect(() => {
    if (!isNew) {
      axios.get(`${baseURL}/${idParam}`)
        .then((response) => {
          const { data } = response;
          setNome(data.nome);
          setPreco(data.preco);
          setDuracao(data.duracao);
          setIdCargo(data.idCargo);
          setIdLoja(data.idLoja);
          setComissao(data.comissao);
          setDesconto(data.desconto);
        })
        .catch((error) => {
          mensagemErro('Não foi possível carregar os dados do serviço para edição.');
          console.error(error);
        });
    }
  }, [idParam, isNew, baseURL]);

  // Carrega dados para os selects
  useEffect(() => {
    axios.get(`${BASE_URL}/cargos`).then((response) => setDadosCargos(response.data));
    axios.get(`${BASE_URL}/lojas`).then((response) => setDadosLojas(response.data));
  }, []);

  async function salvar() {
    const data = { nome, preco, duracao, comissao, desconto, idCargo, idLoja };
    
    // CORREÇÃO: Axios stringify o objeto automaticamente, não precisa fazer manualmente.
    const request = isNew
      ? axios.post(baseURL, data)
      : axios.put(`${baseURL}/${idParam}`, data);

    request
      .then(function (response) {
        mensagemSucesso(`Serviço ${nome} ${isNew ? 'cadastrado' : 'alterado'} com sucesso!`);
        navigate('/listagem-servico');
      })
      .catch(function (error) {
        mensagemErro(error.response.data);
      });
  }

  const cancelar = () => {
    navigate('/listagem-servico');
  };

  return (
    <div className='container'>
      <Card title={isNew ? 'Cadastro de Serviço' : 'Edição de Serviço'}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input type='text' id='inputNome' value={nome} className='form-control' onChange={(e) => setNome(e.target.value)} />
              </FormGroup>
              <FormGroup label='Preço (R$): *' htmlFor='inputPreco'>
                {/* CORREÇÃO: Usando `onValueChange` para atualizar o estado com o valor numérico */}
                <CurrencyInput id="inputPreco" name="preco" className='form-control' value={preco} decimalsLimit={2} decimalSeparator="," groupSeparator="." prefix="R$ " onValueChange={(value) => setPreco(value)} />
              </FormGroup>
              <FormGroup label='Duração (min): *' htmlFor='inputDuracao'>
                <input type='number' id='inputDuracao' value={duracao} className='form-control' onChange={(e) => setDuracao(e.target.value)} />
              </FormGroup>
              <FormGroup label='Comissão (%):' htmlFor='inputComissao'>
                <input type='number' id='inputComissao' value={comissao} className='form-control' onChange={(e) => setComissao(e.target.value)} />
              </FormGroup>
              <FormGroup label='Desconto (%):' htmlFor='inputDesconto'>
                <input type='number' id='inputDesconto' value={desconto} className='form-control' onChange={(e) => setDesconto(e.target.value)} />
              </FormGroup>
              <FormGroup label='Cargo: *' htmlFor='selectCargo'>
                <select className='form-select' id='selectCargo' value={idCargo} onChange={(e) => setIdCargo(e.target.value)}>
                  <option value="">Selecione um Cargo</option>
                  {dadosCargos.map((dado) => (<option key={dado.id} value={dado.id}>{dado.nome}</option>))}
                </select>
              </FormGroup>
              <FormGroup label='Loja: *' htmlFor='selectLoja'>
                <select className='form-select' id='selectLoja' value={idLoja} onChange={(e) => setIdLoja(e.target.value)}>
                   <option value="">Selecione uma Loja</option>
                  {dadosLojas.map((dado) => (<option key={dado.id} value={dado.id}>{dado.nome}</option>))}
                </select>
              </FormGroup>
              <Stack spacing={1} padding={1} direction='row'>
                <button onClick={salvar} type='button' className='btn btn-success'>Salvar</button>
                <button onClick={cancelar} type='button' className='btn btn-danger'>Cancelar</button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroServico;