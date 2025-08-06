import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroUsuario() {
  // Hook para navegação entre as telas
  const navigate = useNavigate();
  
  // URL base da API para usuários
  const baseURL = `${BASE_URL}/usuarios`;

  // Estados para armazenar os dados do formulário
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [cpf, setCpf] = React.useState('');
  const [login, setLogin] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [senhaRepeticao, setSenhaRepeticao] = React.useState('');

  // Função para validar os campos antes de enviar
  const validar = () => {
    if (!nome || !email || !login || !senha || !senhaRepeticao) {
      mensagemErro('Preencha todos os campos obrigatórios (*).');
      return false;
    }

    if (senha !== senhaRepeticao) {
      mensagemErro('As senhas não conferem.');
      return false;
    }
    
    return true;
  };

  // Função para salvar o novo usuário
  const salvar = async () => {
    if (!validar()) {
      return;
    }

    const data = { nome, email, cpf, login, senha, senhaRepeticao };

    await axios
      .post(baseURL, data)
      .then(() => {
        mensagemSucesso('Usuário cadastrado com sucesso! Faça o login para continuar.');
        navigate('/login'); // Redireciona para a tela de login
      })
      .catch((error) => {
        mensagemErro(error.response?.data || 'Ocorreu um erro ao tentar cadastrar.');
      });
  };

  // Função para cancelar e voltar para a tela de login
  const cancelar = () => {
    navigate('/login');
  };

  return (
    <div className='container' style={{ marginTop: '50px' }}>
      <Card title='Cadastro de Usuário'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              {/* Campos do formulário */}
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input
                  type='text'
                  id='inputNome'
                  className='form-control'
                  name='nome'
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Email: *' htmlFor='inputEmail'>
                <input
                  type='email'
                  id='inputEmail'
                  className='form-control'
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
               <FormGroup label='CPF:' htmlFor='inputCpf'>
                <input
                  type='text'
                  id='inputCpf'
                  className='form-control'
                  name='cpf'
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Login: *' htmlFor='inputLogin'>
                <input
                  type='text'
                  id='inputLogin'
                  className='form-control'
                  name='login'
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Senha: *' htmlFor='inputSenha'>
                <input
                  type='password'
                  id='inputSenha'
                  className='form-control'
                  name='senha'
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Repita a Senha: *' htmlFor='inputRepitaSenha'>
                <input
                  type='password'
                  id='inputRepitaSenha'
                  className='form-control'
                  name='senhaRepeticao'
                  value={senhaRepeticao}
                  onChange={(e) => setSenhaRepeticao(e.target.value)}
                />
              </FormGroup>

              {/* Botões de ação */}
              <div className='mt-3'>
                <button onClick={salvar} type='button' className='btn btn-success me-2'>
                  <i className="pi pi-save"></i> Salvar
                </button>
                <button onClick={cancelar} type='button' className='btn btn-danger'>
                  <i className="pi pi-times"></i> Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroUsuario;
