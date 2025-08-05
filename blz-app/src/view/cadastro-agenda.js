import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroAgenda() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/agendamentos`;

  // --- ESTADOS DO FORMULÁRIO PRINCIPAL ---
  const [id, setId] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [horario, setHorario] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');
  const [idLoja, setIdLoja] = useState('');
  const [idCliente, setIdCliente] = useState(''); // NOVO: Estado para o cliente

  // Estado para os serviços do agendamento
  const [servicos, setServicos] = useState([{ idServico: '', quantidade: 1 }]);

  // --- Estados para dados de apoio (preencher os selects) ---
  const [dadosLoja, setDadosLoja] = useState([]);
  const [dadosServico, setDadosServico] = useState([]);
  const [dadosFuncionario, setDadosFuncionario] = useState([]);
  const [dadosCliente, setDadosCliente] = useState([]); // NOVO: Estado para a lista de clientes

  // --- LÓGICA DE DADOS (API) ---
  const buscarAgendamento = async () => {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      const agendamento = response.data;
      setId(agendamento.id);
      setDataAgendamento(agendamento.dataAgendamento ? agendamento.dataAgendamento.split('T')[0] : '');
      setHorario(agendamento.horario || '');
      setIdFuncionario(agendamento.idFuncionario?.toString() || '');
      setIdLoja(agendamento.idLoja?.toString() || '');
      setIdCliente(agendamento.idCliente?.toString() || ''); // NOVO: Populando o cliente

      const servicosResponse = await axios.get(`${baseURL}/${idParam}/ordemServicos`);
      if (servicosResponse.data && servicosResponse.data.length > 0) {
        const servicosFormatados = servicosResponse.data.map(item => ({
          idServico: item.idServico.toString(),
          quantidade: item.quantidade
        }));
        setServicos(servicosFormatados);
      }
    } catch (error) {
      mensagemErro('Erro ao buscar dados do agendamento.');
    }
  };

  async function salvar() {
    const servicosValidos = servicos.filter(s => s.idServico && s.quantidade > 0);
    if (servicosValidos.length === 0) {
      mensagemErro('Adicione pelo menos um serviço ao agendamento.');
      return;
    }
    if (!idCliente) {
      mensagemErro('Selecione um cliente para o agendamento.');
      return;
    }

    // NOVO: Adicionado 'idCliente' ao objeto de dados
    const data = { id, dataAgendamento, horario, idFuncionario, idLoja, idCliente, servicos: servicosValidos };
    const request = idParam ? axios.put(`${baseURL}/${idParam}`, data) : axios.post(baseURL, data);

    await request
      .then(() => {
        mensagemSucesso(`Agendamento salvo com sucesso!`);
        navigate(`/listagem-agenda`);
      })
      .catch((error) => {
        mensagemErro(error.response?.data || 'Ocorreu um erro ao salvar.');
      });
  }

  // --- EFEITOS (LIFECYCLE) ---
  useEffect(() => {
    // Busca todos os dados de apoio
    axios.get(`${BASE_URL}/servicos`).then((response) => setDadosServico(response.data));
    axios.get(`${BASE_URL}/lojas`).then((response) => setDadosLoja(response.data));
    axios.get(`${BASE_URL}/funcionarios`).then((response) => setDadosFuncionario(response.data));
    axios.get(`${BASE_URL}/usuarios`).then((response) => setDadosCliente(response.data)); // NOVO: Busca a lista de clientes

    if (idParam) {
      buscarAgendamento();
    }
    // eslint-disable-next-line
  }, [idParam]);

  // --- FUNÇÕES DE MANIPULAÇÃO DOS ITENS ---
  const handleServicoChange = (index, field, value) => {
    const novosServicos = [...servicos];
    novosServicos[index][field] = value;
    setServicos(novosServicos);
  };

  const adicionarServico = () => {
    setServicos([...servicos, { idServico: '', quantidade: 1 }]);
  };

  const removerServico = (index) => {
    const novosServicos = servicos.filter((_, i) => i !== index);
    setServicos(novosServicos);
  };

  const cancelar = () => navigate('/listagem-agenda');

  return (
    <div className='container'>
      <Card title={idParam ? 'Editar Agendamento' : 'Novo Agendamento'}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <div className="row">
                <div className="col-md-6">
                  <FormGroup label='Data: *' htmlFor='inputDataagenda'>
                    <input type='date' id='inputdata' value={dataAgendamento} className='form-control' onChange={(e) => setDataAgendamento(e.target.value)} />
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup label='Horário: *' htmlFor='inputHorarioagenda'>
                    <input type='time' id='inputHorarioagenda' value={horario} className='form-control' onChange={(e) => setHorario(e.target.value)} />
                  </FormGroup>
                </div>
              </div>

              <div className="row">
                {/* NOVO: Campo de seleção de Cliente */}
                <div className="col-md-6">
                  <FormGroup label='Cliente: *' htmlFor='selectCliente'>
                    <select className='form-select' id='selectCliente' value={idCliente} onChange={(e) => setIdCliente(e.target.value)}>
                      <option value="">Selecione um cliente...</option>
                      {dadosCliente.map(d => (<option key={d.id} value={d.id}>{d.nome}</option>))}
                    </select>
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup label='Funcionário de Preferência:' htmlFor='selectFuncionario'>
                    <select className='form-select' id='selectFuncionario' value={idFuncionario} onChange={(e) => setIdFuncionario(e.target.value)}>
                      <option value="">Qualquer um...</option>
                      {dadosFuncionario.map(d => (<option key={d.id} value={d.id}>{d.nome}</option>))}
                    </select>
                  </FormGroup>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-12">
                  <FormGroup label='Loja: *' htmlFor='selectLoja'>
                    <select className='form-select' id='selectLoja' value={idLoja} onChange={(e) => setIdLoja(e.target.value)}>
                       <option value="">Selecione uma loja...</option>
                      {dadosLoja.map(d => (<option key={d.id} value={d.id}>{d.nome}</option>))}
                    </select>
                  </FormGroup>
                </div>
              </div>
              
              <hr/>

              <h5>Serviços Agendados</h5>
              {servicos.map((servico, index) => (
                <div className="row align-items-end mb-3" key={index}>
                  <div className="col-md-7">
                    <FormGroup label={`Serviço ${index + 1}:`} htmlFor={`servico-${index}`}>
                       <select className='form-select' id={`servico-${index}`} value={servico.idServico} onChange={(e) => handleServicoChange(index, 'idServico', e.target.value)}>
                         <option value="">Selecione um serviço...</option>
                         {dadosServico.map(s => (<option key={s.id} value={s.id}>{s.nome}</option>))}
                       </select>
                    </FormGroup>
                  </div>
                  <div className="col-md-3">
                    <FormGroup label="Quantidade:" htmlFor={`qtd-${index}`}>
                      <input type="number" id={`qtd-${index}`} className="form-control" value={servico.quantidade} min="1" onChange={(e) => handleServicoChange(index, 'quantidade', parseInt(e.target.value) || 1)} />
                    </FormGroup>
                  </div>
                  <div className="col-md-2 d-flex align-items-center pb-3">
                     <button onClick={() => removerServico(index)} type='button' className='btn btn-danger w-100'>Remover</button>
                  </div>
                </div>
              ))}
              <button onClick={adicionarServico} type='button' className='btn btn-primary mb-3'>+ Adicionar Serviço</button>
              
              <hr/>
              
              <Stack spacing={1} padding={1} direction='row'>
                <button onClick={salvar} type='button' className='btn btn-success'>Salvar Agendamento</button>
                <button onClick={cancelar} type='button' className='btn btn-outline-danger'>Cancelar</button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroAgenda;