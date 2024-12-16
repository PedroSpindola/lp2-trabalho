import React from 'react';

<<<<<<< HEAD
import Cadastrocargo from './view/cadastro-cargo';//
import Cadastrocliente from './view/cadastro-cliente';//
import Cadastrocolaborador from './view/cadastro-colaborador';
import Cadastroproduto from "./view/cadastro-produto";//
import Cadastroservico from "./view/cadastro-servico" //
import Cadastroloja from "./view/cadastro-loja"//


=======
import Cadastroprodutos from "./view/cadastro-produto";
import CadastroServico from "./view/cadastro-servico"
import CadastroLojas from "./view/cadastro-loja"
import CadastroFuncionario from "./view/cadastro-funcionario"
>>>>>>> e36a6e3903cbca3cf02b3d8ef427b0f2e4f03097


import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Listagemproduto from './view/listagem-produto';
import Listagemservico from './view/listagem-servico';
import Listagemloja from './view/listagem-loja';
import Listagemcolaborador from './view/listagem-colaborador';
import Listagemcliente from './view/listagem-cliente';
import Listagemcargo from './view/listagem-cargo';
import ListagemFuncionario from './view/listagem-funcionario';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/cadastro-produto/:idParam?'
          element={<Cadastroproduto />}
        />
        <Route 
          path='/cadastro-servico/:idParam?' 
          element={<Cadastroservico />}
        />
        <Route 
<<<<<<< HEAD
          path='/cadastro-loja/'
          element={<Cadastroloja/>} 
=======
          path='/cadastro-funcionario/:idParam?' 
          element={<CadastroFuncionario />}
        />
        <Route 
          path='/cadastro-lojas/'
          element={<CadastroLojas/>}
>>>>>>> e36a6e3903cbca3cf02b3d8ef427b0f2e4f03097
        />
          <Route 
          path='/cadastro-cargo/'
          element={<Cadastrocargo/>} 
        />
           <Route 
          path='/cadastro-cliente/'
          element={<Cadastrocliente/>} 
        />
            <Route 
          path='/cadastro-cliente/'
          element={<Cadastrocliente/>} 
        />
             <Route 
          path='/cadastro-colaborador/'
          element={<Cadastrocolaborador/>} 
        />

        <Route path='/listagem-produto' element={<Listagemproduto />} />
        <Route path='/listagem-servico' element={<Listagemservico />} />
        <Route path='/listagem-loja' element={<Listagemloja />} />
        <Route path='/listagem-colaborador' element={<Listagemcolaborador />} />
        <Route path='/listagem-cliente' element={<Listagemcliente />} />
        <Route path='/listagem-cargo' element={<Listagemcargo />} />
        <Route path='/listagem-funcionario' element={<ListagemFuncionario />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;