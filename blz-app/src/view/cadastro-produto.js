import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';
import Stack from '@mui/material/Stack';
import { Select, MenuItem, InputLabel, FormControl, Chip, Box } from '@mui/material';

import Card from '../components/card';
import FormGroup from '../components/form-group';
import axios from 'axios';
import { BASE_URL } from '../config/axios';
import { mensagemErro, mensagemSucesso } from '../components/toastr';

function Cadastroprodutos() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/produtos`;

  // --- ESTADOS DO COMPONENTE ---
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [valorVenda, setValorVenda] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [idFornecedor, setIdFornecedor] = useState([]);
  const [idLoja, setIdLoja] = useState([]);
  const [unidadeMedida, setUnidadeMedida] = useState('');
  const [desconto, setDesconto] = useState('');
  const [quantidadeMin, setQuantidadeMin] = useState('');
  const [valorCompra, setValorCompra] = useState('');

  const [dadosFornecedor, setDadosFornecedor] = useState([]);
  const [dadosLoja, setDadosLoja] = useState([]);

  // Mapas para buscar nomes por ID de forma eficiente (para os Chips)
  const fornecedorMap = new Map(dadosFornecedor.map(f => [f.id.toString(), f.nome]));
  const lojaMap = new Map(dadosLoja.map(l => [l.id.toString(), l.nome]));

  // --- LÓGICA DE DADOS (API) ---
  
  // Busca os dados do produto para o modo de edição
  const buscarProduto = async () => {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      const produto = response.data;
      
      setId(produto.id);
      setNome(produto.nome);
      setValorVenda(produto.valorVenda?.toString() || '');
      setQuantidade(produto.quantidade?.toString() || '');
      // Formata a data para o formato YYYY-MM-DD que o input[type=date] espera
      setDataValidade(produto.dataValidade ? produto.dataValidade.split('T')[0] : '');
      // Garante que os valores venham como arrays de strings para o Select do MUI
      setIdFornecedor(produto.idFornecedor?.map(String) || []);
      setIdLoja(produto.idLoja?.map(String) || []);
      setUnidadeMedida(produto.unidadeMedida || '');
      setDesconto(produto.desconto?.toString() || '');
      setQuantidadeMin(produto.quantidadeMin?.toString() || '');
      setValorCompra(produto.valorCompra?.toString() || '');
    } catch (error) {
      mensagemErro('Erro ao buscar dados do produto.');
      console.error(error);
    }
  };

  // --- ALTERADO ---
  // Função salvar com a conversão de tipos de dados corrigida.
  async function salvar() {
    // 1. Monta o payload com os dados convertidos para os tipos corretos
    const payload = { 
      nome,
      dataValidade,
      unidadeMedida,
      // Converte os arrays de ID de string para número
      idFornecedor: idFornecedor.map(id => parseInt(id, 10)),
      idLoja: idLoja.map(id => parseInt(id, 10)),
      
      // Converte valores monetários de string para número (float)
      // O "|| 0" previne o envio de NaN (Not a Number) caso o campo esteja vazio
      valorVenda: parseFloat(valorVenda) || 0,
      valorCompra: parseFloat(valorCompra) || 0,
      desconto: parseFloat(desconto) || 0,
      
      // Converte valores inteiros de string para número
      quantidade: parseInt(quantidade, 10) || 0,
      // Para campos opcionais, é melhor enviar 'null' se estiverem vazios
      quantidadeMin: quantidadeMin ? parseInt(quantidadeMin, 10) : null,
    };
    
    // 2. Determina se é uma criação (POST) ou atualização (PUT)
    const request = idParam 
      ? axios.put(`${baseURL}/${idParam}`, payload)
      : axios.post(baseURL, payload);

    // 3. Executa a requisição e trata a resposta
    request
      .then(function (response) {
        const acao = idParam ? 'alterado' : 'cadastrado';
        mensagemSucesso(`Produto ${nome} ${acao} com sucesso!`);
        navigate(`/listagem-produto`);
      })
      .catch(function (error) {
        // Exibe a mensagem de erro vinda do backend, ou uma mensagem genérica
        const erroMsg = error.response?.data || 'Ocorreu um erro ao salvar.';
        mensagemErro(erroMsg);
        console.error("Erro ao salvar:", error.response);
      });
  }

  // --- EFEITOS (LIFECYCLE) ---

  // useEffect consolidado para buscar dados iniciais
  useEffect(() => {
    // Busca fornecedores e lojas apenas uma vez ao carregar o componente
    axios.get(`${BASE_URL}/fornecedores`).then((response) => {
      setDadosFornecedor(response.data);
    });
    axios.get(`${BASE_URL}/lojas`).then((response) => {
      setDadosLoja(response.data);
    });

    // Se houver um idParam (modo de edição), busca os dados do produto
    if (idParam) {
      buscarProduto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam]); // Roda apenas quando o idParam na URL muda

  
  // --- HANDLERS DE EVENTOS ---
  const handleFornecedorChange = (event) => {
    const { target: { value } } = event;
    setIdFornecedor(typeof value === 'string' ? value.split(',') : value);
  };

  const handleLojaChange = (event) => {
    const { target: { value } } = event;
    setIdLoja(typeof value === 'string' ? value.split(',') : value);
  };

  const cancelar = () => {
    navigate('/listagem-produto');
  };
  
  // Evita renderizar o formulário antes de carregar os dados essenciais
  // No modo de edição, espera o 'id' do produto ser preenchido
  if (idParam && !id) {
    return <div>Carregando...</div>;
  }

  return (
    <div className='container'>
      <Card title={idParam ? 'Edição de Produto' : 'Cadastro de Produto'}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              
              {/* --- CAMPOS DO FORMULÁRIO --- */}
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input type='text' id='inputNome' value={nome} className='form-control' name='nomeprodutos' onChange={(e) => setNome(e.target.value)} />
              </FormGroup>

              <FormGroup label='Preço de Venda (R$): *' htmlFor='inputvalorvenda'>
                <CurrencyInput id="inputvalorvenda" name="valorvenda" decimalsLimit={2} className='form-control' value={valorVenda} onValueChange={(value) => setValorVenda(value || '')} />
              </FormGroup>

              <FormGroup label='Valor de Compra (R$): *' htmlFor='inputvalorcompra'>
                <CurrencyInput id="inputvalorcompra" name="valorcompra" decimalsLimit={2} className='form-control' value={valorCompra} onValueChange={(value) => setValorCompra(value || '')} />
              </FormGroup>

              <FormGroup label='Quantidade: *' htmlFor='inputquantidade'>
                <input type='number' id='inputquantidade' value={quantidade} className='form-control' name='quantidadeprodutos' onChange={(e) => setQuantidade(e.target.value)} />
              </FormGroup>

              <FormGroup label='Quantidade Mínima:' htmlFor='inputQuantidadeMin'>
                <input type='number' id='inputQuantidadeMin' value={quantidadeMin} className='form-control' name='quantidadeMinimaprodutos' onChange={(e) => setQuantidadeMin(e.target.value)} />
              </FormGroup>

              <FormGroup label='Data de Validade: *' htmlFor='inputdataValidade'>
                <input type='date' id='inputdataValidade' value={dataValidade} className='form-control' name='dataValidadeprodutos' onChange={(e) => setDataValidade(e.target.value)} />
              </FormGroup>
              
              <FormGroup label='Fornecedor(es):' htmlFor='select-fornecedor'>
                <FormControl fullWidth>
                  <InputLabel id="select-fornecedor-label">Selecione</InputLabel>
                  <Select
                    labelId="select-fornecedor-label"
                    id="select-fornecedor"
                    multiple
                    value={idFornecedor}
                    onChange={handleFornecedorChange}
                    label="Selecione"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={fornecedorMap.get(value) || value} />
                        ))}
                      </Box>
                    )}
                  >
                    {dadosFornecedor.map((fornecedor) => (
                      <MenuItem key={fornecedor.id} value={fornecedor.id.toString()}>
                        {fornecedor.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>

              <FormGroup label='Loja(s):' htmlFor='select-loja'>
                <FormControl fullWidth>
                    <InputLabel id="select-loja-label">Selecione</InputLabel>
                    <Select
                        labelId="select-loja-label"
                        id="select-loja"
                        multiple
                        value={idLoja}
                        onChange={handleLojaChange}
                        label="Selecione"
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={lojaMap.get(value) || value} />
                                ))}
                            </Box>
                        )}
                    >
                        {dadosLoja.map((loja) => (
                            <MenuItem key={loja.id} value={loja.id.toString()}>
                                {loja.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
              </FormGroup>
              
              <FormGroup label='Unidade de Medida:' htmlFor='inputUnidadeMedida'>
                <input type='text' id='inputUnidadeMedida' value={unidadeMedida} className='form-control' name='unidadeMedidaprodutos' onChange={(e) => setUnidadeMedida(e.target.value)} />
              </FormGroup>

              <FormGroup label='Desconto:' htmlFor='inputDesconto'>
                <input type='text' id='inputDesconto' value={desconto} className='form-control' name='descontoprodutos' onChange={(e) => setDesconto(e.target.value)} />
              </FormGroup>

              {/* --- BOTÕES DE AÇÃO --- */}
              <Stack spacing={1} padding={1} direction='row' sx={{ mt: 2 }}>
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

export default Cadastroprodutos;