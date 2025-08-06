import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InputMask from 'react-input-mask';
import Stack from '@mui/material/Stack';

// NOVO: Imports do Material-UI para o Select múltiplo
import { Select, MenuItem, InputLabel, FormControl, Chip, Box } from '@mui/material';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroCliente() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/usuarios`; // Endpoint para Clientes/Usuários

  // --- ESTADOS DO FORMULÁRIO ---
  const [id, setId] = useState('');
  const [cpf, setCpf] = useState('');
  const [nome, setnome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  
  // NOVO: Estado para a seleção de Lojas
  const [idLojas, setIdLojas] = useState([]); // Array para seleção múltipla

  // Estado para dados de apoio (Lojas)
  const [dadosLojas, setDadosLojas] = useState([]);

  // Mapa para buscar nome da loja por ID (para os 'chips')
  const lojaMap = new Map(dadosLojas.map(l => [l.id.toString(), l.nome]));

  // --- LÓGICA DE DADOS (API) ---
  const buscarCliente = async () => {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      const cliente = response.data;
      setId(cliente.id);
      setnome(cliente.nome);
      setCpf(cliente.cpf || '');
      setTelefone(cliente.telefone || '');
      setCelular(cliente.celular || '');
      setEmail(cliente.email || '');
      setDataNascimento(cliente.dataNascimento ? cliente.dataNascimento.split('T')[0] : '');

      // NOVO: Busca as lojas associadas a este cliente
      // Assumindo um endpoint para buscar as associações ClienteLoja
      const lojasResponse = await axios.get(`${BASE_URL}/clienteLojas?usuarioId=${idParam}`);
      if (lojasResponse.data) {
        const lojaIds = lojasResponse.data.map(clienteLoja => clienteLoja.idLoja.toString());
        setIdLojas(lojaIds);
      }
    } catch (error) {
      mensagemErro('Erro ao buscar dados do cliente.');
    }
  };

  async function salvar() {
    // NOVO: Adicionado 'idLojas' ao objeto de dados
    const data = { id, cpf, nome, telefone, celular, email, senha, dataNascimento, idLojas };

    if (!data.senha) {
      delete data.senha;
    }
    data.idLojas = data.idLojas.map(id => parseInt(id, 10));

    const request = idParam ? axios.put(`${baseURL}/${idParam}`, data) : axios.post(baseURL, data);

    await request
      .then(() => {
        mensagemSucesso(`Cliente ${nome} salvo com sucesso!`);
        navigate(`/listagem-funcionario`);
      })
      .catch((error) => {
        mensagemErro(error.response?.data || 'Ocorreu um erro ao salvar.');
      });
  }

  // --- EFEITOS (LIFECYCLE) ---
  useEffect(() => {
    // Busca a lista de todas as lojas para preencher o select
    axios.get(`${BASE_URL}/lojas`).then((response) => setDadosLojas(response.data));

    if (idParam) {
      buscarCliente();
    }
    // eslint-disable-next-line
  }, [idParam]);

  const cancelar = () => navigate('/listagem-funcionario');

  return (
    <div className='container'>
      <Card title={idParam ? 'Edição de funcinario' : 'Cadastro de funcionario'}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              
              <FormGroup label='CPF:' htmlFor='inputCpf'>
                <InputMask mask="999.999.999-99" value={cpf} onChange={(e) => setCpf(e.target.value)}>
                  {(inputProps) => <input {...inputProps} type="text" id="inputCpf" className="form-control" />}
                </InputMask>
              </FormGroup>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input type='text' id='inputNome' value={nome} className='form-control' onChange={(e) => setnome(e.target.value)} />
              </FormGroup>
              <FormGroup label='Telefone:' htmlFor='inputTelefone'>
                <InputMask mask="(99) 9999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)}>
                  {(inputProps) => <input {...inputProps} type="text" id="inputTelefone" className="form-control" />}
                </InputMask>
              </FormGroup>
              <FormGroup label='Celular: *' htmlFor='inputCelular'>
                <InputMask mask="(99) 99999-9999" value={celular} onChange={(e) => setCelular(e.target.value)}>
                  {(inputProps) => <input {...inputProps} type="text" id="inputCelular" className="form-control" />}
                </InputMask>
              </FormGroup>
              <FormGroup label='Email: *' htmlFor='inputEmail'>
                <input type='email' id='inputEmail' value={email} className='form-control' onChange={(e) => setEmail(e.target.value)} />
              </FormGroup>
              <FormGroup label='Senha: *' htmlFor='inputSenha'>
                <input type='password' id='inputSenha' value={senha} className='form-control' 
                       placeholder={idParam ? "Deixe em branco para não alterar" : "Digite a senha"}
                       onChange={(e) => setSenha(e.target.value)} />
              </FormGroup>
              <FormGroup label='Data de Nascimento: *' htmlFor='inputDtaNasc'>
                <input type='date' id='inputDtaNasc' value={dataNascimento} className='form-control' onChange={(e) => setDataNascimento(e.target.value)} />
              </FormGroup>

              {/* NOVO: Componente de seleção múltipla para Lojas */}
              <FormGroup label='Cadastrado na(s) Loja(s):' htmlFor='select-lojas'>
                <FormControl fullWidth>
                  <InputLabel id="select-lojas-label">Selecione</InputLabel>
                  <Select
                    labelId="select-lojas-label"
                    id="select-lojas"
                    multiple
                    value={idLojas}
                    onChange={(e) => setIdLojas(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                    label="Selecione"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={lojaMap.get(value) || value} />
                        ))}
                      </Box>
                    )}
                  >
                    {dadosLojas.map((loja) => (
                      <MenuItem key={loja.id} value={loja.id.toString()}>
                        {loja.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>

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

export default CadastroCliente;