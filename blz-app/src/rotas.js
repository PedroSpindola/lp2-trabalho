import React from 'react';

import Cadastroprodutos from "./view/cadastro-produto";
import CadastroServico from "./view/cadastro-servico"
import CadastroLojas from "./view/cadastro-loja"


import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Listagemproduto from './view/listagem-produto';
import Listagemservico from './view/listagem-servico';

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

      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;