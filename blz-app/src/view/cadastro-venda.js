import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import axios from 'axios';
import { BASE_URL } from '../config/axios';
import { mensagemErro, mensagemSucesso } from '../components/toastr';

function CadastroVenda() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/vendas`;

  // --- ESTADOS DO FORMULÁRIO PRINCIPAL ---
  const [id, setId] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [dataVenda, setDataVenda] = useState('');
  const [horario, setHorario] = useState('');
  const [idFormaPagamento, setIdFormaPagamento] = useState('');
  const [idLoja, setIdLoja] = useState('');

  // Estado para os itens da venda (produtos e quantidades)
  const [itens, setItens] = useState([{ idProduto: '', quantidade: 1 }]);

  // --- Estados para dados de apoio (preencher os selects) ---
  const [dadosFormaPagamento, setDadosFormaPagamento] = useState([]);
  const [dadosUsuario, setDadosUsuario] = useState([]);
  const [dadosLoja, setDadosLoja] = useState([]);
  const [dadosProdutos, setDadosProdutos] = useState([]);

  // --- LÓGICA DE DADOS (API) ---
  const buscarVenda = async () => {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      const venda = response.data;
      setId(venda.id);
      setIdUsuario(venda.idUsuario?.toString() || '');
      setDataVenda(venda.dataVenda ? venda.dataVenda.split('T')[0] : '');
      setHorario(venda.horario || '');
      setIdFormaPagamento(venda.idFormaPagamento?.toString() || '');
      setIdLoja(venda.idLoja?.toString() || '');

      const itensResponse = await axios.get(`${baseURL}/${idParam}/itemVendas`);
      if (itensResponse.data && itensResponse.data.length > 0) {
        const itensFormatados = itensResponse.data.map(item => ({
          idProduto: item.idProduto.toString(),
          quantidade: item.quantidade
        }));
        setItens(itensFormatados);
      }
    } catch (error) {
      mensagemErro('Erro ao buscar dados da venda.');
    }
  };

  async function salvar() {
    const itensValidos = itens.filter(item => item.idProduto && item.quantidade > 0);
    if (itensValidos.length === 0) {
      mensagemErro('Adicione pelo menos um produto à venda.');
      return;
    }

    const data = { id, idUsuario, dataVenda, horario, idFormaPagamento, idLoja, itens: itensValidos };
    
    // =================================================================
    // LOG ADICIONADO AQUI PARA VERIFICAR O QUE ESTÁ SENDO ENVIADO
    console.log("Enviando para a API:", data);
    // =================================================================

    const request = idParam ? axios.put(`${baseURL}/${idParam}`, data) : axios.post(baseURL, data);

    await request
      .then(() => {
        mensagemSucesso(`Venda salva com sucesso!`);
        navigate(`/listagem-venda`);
      })
      .catch((error) => {
        mensagemErro(error.response?.data || 'Ocorreu um erro ao salvar.');
        // Logar o erro também é uma boa prática
        console.error("Erro ao salvar:", error.response);
      });
  }

  // --- EFEITOS (LIFECYCLE) ---
  useEffect(() => {
    axios.get(`${BASE_URL}/formapagamento`).then((response) => setDadosFormaPagamento(response.data));
    axios.get(`${BASE_URL}/usuarios`).then((response) => setDadosUsuario(response.data));
    axios.get(`${BASE_URL}/lojas`).then((response) => setDadosLoja(response.data));
    axios.get(`${BASE_URL}/produtos`).then((response) => setDadosProdutos(response.data));

    if (idParam) {
      buscarVenda();
    }
    // eslint-disable-next-line
  }, [idParam]);

  // --- FUNÇÕES DE MANIPULAÇÃO DOS ITENS ---
  const handleItemChange = (index, field, value) => {
    const novosItens = [...itens];
    novosItens[index][field] = value;
    setItens(novosItens);
  };

  const adicionarItem = () => {
    setItens([...itens, { idProduto: '', quantidade: 1 }]);
  };

  const removerItem = (index) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  };

  const cancelar = () => navigate('/listagem-venda');

  return (
    <div className='container'>
      <Card title={idParam ? 'Edição de Venda' : 'Registro de Venda'}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>

              {/* --- INFORMAÇÕES GERAIS DA VENDA --- */}
              <div className="row">
                <div className="col-md-6">
                  <FormGroup label='Cliente: *' htmlFor='selectCliente'>
                    <select className='form-select' id='selectCliente' value={idUsuario} onChange={(e) => setIdUsuario(e.target.value)}>
                      <option value="">Selecione...</option>
                      {dadosUsuario.map(d => (<option key={d.id} value={d.id}>{d.nome}</option>))}
                    </select>
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup label='Loja: *' htmlFor='selectLoja'>
                    <select className='form-select' id='selectLoja' value={idLoja} onChange={(e) => setIdLoja(e.target.value)}>
                      <option value="">Selecione...</option>
                      {dadosLoja.map(d => (<option key={d.id} value={d.id}>{d.nome}</option>))}
                    </select>
                  </FormGroup>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-4">
                  <FormGroup label='Data da Venda: *' htmlFor='inputdataVenda'>
                    <input type='date' id='inputdataVenda' value={dataVenda} className='form-control' onChange={(e) => setDataVenda(e.target.value)} />
                  </FormGroup>
                </div>
                <div className="col-md-4">
                  <FormGroup label='Hora da Venda:' htmlFor='inputhoraVenda'>
                    <input type='time' id='inputhoraVenda' value={horario} className='form-control' onChange={(e) => setHorario(e.target.value)} />
                  </FormGroup>
                </div>
                <div className="col-md-4">
                  <FormGroup label='Forma de Pagamento: *' htmlFor='selectFormaPagamento'>
                    <select className='form-select' id='selectFormaPagamento' value={idFormaPagamento} onChange={(e) => setIdFormaPagamento(e.target.value)}>
                      <option value="">Selecione...</option>
                      {dadosFormaPagamento.map(d => (<option key={d.id} value={d.id}>{d.nome}</option>))}
                    </select>
                  </FormGroup>
                </div>
              </div>

              <hr/>

              {/* --- SEÇÃO DE ITENS DA VENDA --- */}
              <h5>Itens da Venda</h5>
              {itens.map((item, index) => (
                <div className="row align-items-end mb-3" key={index}>
                  <div className="col-md-7">
                    <FormGroup label={`Produto ${index + 1}:`} htmlFor={`produto-${index}`}>
                      <select className='form-select' id={`produto-${index}`} value={item.idProduto} onChange={(e) => handleItemChange(index, 'idProduto', e.target.value)}>
                        <option value="">Selecione um produto...</option>
                        {dadosProdutos.map(p => (<option key={p.id} value={p.id}>{p.nome}</option>))}
                      </select>
                    </FormGroup>
                  </div>
                  <div className="col-md-3">
                    <FormGroup label="Quantidade:" htmlFor={`qtd-${index}`}>
                      <input type="number" id={`qtd-${index}`} className="form-control" value={item.quantidade} min="1" onChange={(e) => handleItemChange(index, 'quantidade', parseInt(e.target.value) || 1)} />
                    </FormGroup>
                  </div>
                  <div className="col-md-2 d-flex align-items-center pb-3">
                    <button onClick={() => removerItem(index)} type='button' className='btn btn-danger w-100'>Remover</button>
                  </div>
                </div>
              ))}
              <button onClick={adicionarItem} type='button' className='btn btn-primary mb-3'>+ Adicionar Produto</button>
              
              <hr/>

              {/* --- BOTÕES DE AÇÃO --- */}
              <Stack spacing={1} padding={1} direction='row'>
                <button onClick={salvar} type='button' className='btn btn-success'>Salvar Venda</button>
                <button onClick={cancelar} type='button' className='btn btn-outline-danger'>Cancelar</button>
              </Stack>
              
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroVenda;