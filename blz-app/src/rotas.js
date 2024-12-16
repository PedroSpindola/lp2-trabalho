import React from 'react';

import Cadastroprodutos from "./view/cadastro-produto";
import CadastroServico from "./view/cadastro-servico"
import CadastroLojas from "./view/cadastro-loja"


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
          element={<Cadastroprodutos />}
        />
        <Route 
          path='/cadastro-servico/:idParam?' 
          element={<CadastroServico />}
        />
        <Route 
          path='/cadastro-lojas/'
          element={<CadastroLojas/>}
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