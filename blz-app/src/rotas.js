import React from 'react';

import Cadastroprodutos from "./view/cadastro-produto";
import CadastroServico from "./view/cadastro-servico"
import CadastroLojas from "./view/cadastro-loja"


import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Listagemproduto from './view/listagem-produto';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/Cadastroprodutos/:idParam?'
          element={<Cadastroprodutos />}
        />
        <Route 
          path='/CadastroServico/:idParam?' 
          element={<CadastroServico />}
        />
        <Route 
          path='/CadastroLojas/'
          element={<CadastroLojas/>}
        />
        <Route path='/listagem-produto' element={<Listagemproduto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;