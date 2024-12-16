import React from 'react';

import Cadastrocargo from './view/cadastro-cargo';//
import Cadastrocliente from './view/cadastro-cliente';//
import Cadastrocolaborador from './view/cadastro-colaborador';
import Cadastroproduto from "./view/cadastro-produto";//
import Cadastroservico from "./view/cadastro-servico" //
import Cadastroloja from "./view/cadastro-loja"//




import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Listagemproduto from './view/listagem-produto';
import Listagemservico from './view/listagem-servico';
import Listagemloja from './view/listagem-loja';
import Listagemcolaborador from './view/listagem-colaborador';
import Listagemcliente from './view/listagem-cliente';
import Listagemcargo from './view/listagem-cargo';

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
          path='/cadastro-loja/'
          element={<Cadastroloja/>} 
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

      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;