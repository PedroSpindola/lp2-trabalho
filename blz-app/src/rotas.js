import React from 'react';

import Cadastrocargo from './view/cadastro-cargo';
import Cadastrocliente from './view/cadastro-cliente';
import Cadastrocolaborador from './view/cadastro-colaborador';
import Cadastrofuncionario from './view/cadastro-funcionario';
import Cadastroproduto from "./view/cadastro-produto";
import Cadastroservico from "./view/cadastro-servico" ;
import Cadastroloja from "./view/cadastro-loja";
import CadastroFornecedor from "./view/cadastro-fornecedor";



import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Listagemproduto from './view/listagem-produto';
import Listagemservico from './view/listagem-servico';
import Listagemloja from './view/listagem-loja';
import Listagemcolaborador from './view/listagem-colaborador';
import Listagemcliente from './view/listagem-cliente';
import Listagemcargo from './view/listagem-cargo';
import Listagemfuncionario from './view/listagem-funcionario';
import Listagemfornecedor from './view/listagem-fornecedor';
import ListagemAgenda from './view/listagem-Agenda';

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
          path='/cadastro-loja/:idParam?'
          element={<Cadastroloja/>} 
        />
          <Route 
          path='/cadastro-cargo/:idParam?'
          element={<Cadastrocargo/>} 
        />
           <Route 
          path='/cadastro-cliente/:idParam?'
          element={<Cadastrocliente/>} 
        />
            <Route 
          path='/cadastro-cliente/:idParam?'
          element={<Cadastrocliente/>} 
        />
             <Route 
          path='/cadastro-colaborador/:idParam?'
          element={<Cadastrocolaborador/>} 
        />
              <Route 
          path='/cadastro-funcionario/:idParam?'
          element={<Cadastrofuncionario/>} 
        />
        <Route 
          path='/cadastro-fornecedor/:idParam?'
          element={<CadastroFornecedor/>} 
        />

        <Route path='/listagem-produto' element={<Listagemproduto />} />
        <Route path='/listagem-servico' element={<Listagemservico />} />
        <Route path='/listagem-loja' element={<Listagemloja />} />
        <Route path='/listagem-colaborador' element={<Listagemcolaborador />} />
        <Route path='/listagem-cliente' element={<Listagemcliente />} />
        <Route path='/listagem-cargo' element={<Listagemcargo />} />
        <Route path='/listagem-funcionario' element={<Listagemfuncionario />} />
        <Route path='/listagem-fornecedor' element={<Listagemfornecedor />} />
        <Route path='/listagem-Agenda' element={<ListagemAgenda />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;