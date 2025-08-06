import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function Login() {
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/usuarios/auth`;

  // Estados para login e senha
  const [login, setLogin] = React.useState('');
  const [senha, setSenha] = React.useState('');

  // Função para autenticar o usuário
  const autenticar = async () => {
    if (!login || !senha) {
      mensagemErro('Preencha os campos de login e senha.');
      return;
    }

    const data = { login, senha };

    await axios
      .post(baseURL, data)
      .then((response) => {
        // AQUI você deve tratar o token recebido
        // Exemplo: salvar no localStorage para usar em futuras requisições
        const token = response.data.token;
        const nomeUsuario = response.data.nome; // Supondo que a API retorne o nome
        
        localStorage.setItem('user_token', token); 
        
        mensagemSucesso(`Bem-vindo(a), ${nomeUsuario || 'usuário'}!`);
        navigate('/home'); // Redireciona para a tela principal
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.response?.data || 'Login ou senha inválidos.';
        mensagemErro(errorMessage);
      });
  };

  // Função para navegar para a tela de cadastro
  const cadastrar = () => {
    navigate('/cadastro-usuario');
  };

  return (
    <div className='container' style={{ marginTop: '100px', maxWidth: '500px' }}>
      <Card title='Login'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Login: *' htmlFor='inputLogin'>
                <input
                  type='text'
                  id='inputLogin'
                  className='form-control'
                  name='login'
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder='Digite seu login'
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
                  placeholder='Digite sua senha'
                />
              </FormGroup>

              <div className='mt-4 d-grid gap-2'>
                <button onClick={autenticar} type='button' className='btn btn-success'>
                  <i className="pi pi-sign-in"></i> Entrar
                </button>
                <button onClick={cadastrar} type='button' className='btn btn-primary'>
                  <i className="pi pi-plus"></i> Cadastrar-se
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Login;
