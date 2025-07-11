import React from 'react';

import Cadastrocargo from './view/cadastro-cargo';
import Cadastrocliente from './view/cadastro-cliente';
import Cadastrocolaborador from './view/cadastro-colaborador';
import Cadastrofuncionario from './view/cadastro-funcionario';
import Cadastroproduto from "./view/cadastro-produto";
import Cadastroservico from "./view/cadastro-servico" ;
import Cadastroloja from "./view/cadastro-loja";
import CadastroFornecedor from "./view/cadastro-fornecedor";
import CadastroAgenda from "./view/cadastro-agenda"
import CadastroVenda from "./view/cadastro-venda"
import Cadastrocomanda from './view/cadastro-comanda';
import CadastroFormaPagamento from './view/cadastro-forma-pagamento';


import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Listagemproduto from './view/listagem-produto';
import Listagemservico from './view/listagem-servico';
import Listagemloja from './view/listagem-loja';
import Listagemcolaborador from './view/listagem-colaborador';
import Listagemcliente from './view/listagem-cliente';
import Listagemcargo from './view/listagem-cargo';
import Listagemfuncionario from './view/listagem-funcionario';
import Listagemfornecedor from './view/listagem-fornecedor';
import Listagemagenda from './view/listagem-Agenda';
import Listagemvenda from './view/listagem-venda';
import Listagemcomanda from './view/listagem-comanda';
import ListagemFormaPagamento from './view/listagem-forma-pagamento';

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
        <Route 
          path='/cadastro-agenda/:idParam?'
          element={<CadastroAgenda/>} 
        />
        <Route 
          path='/cadastro-venda/:idParam?'
          element={<CadastroVenda/>} 
        />
        <Route 
          path='/cadastro-comanda/:idParam?'
          element={<Cadastrocomanda/>} 
        />

          <Route 
          path='/cadastro-forma-pagamento/:idParam?'
          element={<CadastroFormaPagamento/>} 
        />


        <Route path='/listagem-produto' element={<Listagemproduto />} />
        <Route path='/listagem-servico' element={<Listagemservico />} />
        <Route path='/listagem-loja' element={<Listagemloja />} />
        <Route path='/listagem-colaborador' element={<Listagemcolaborador />} />
        <Route path='/listagem-cliente' element={<Listagemcliente />} />
        <Route path='/listagem-cargo' element={<Listagemcargo />} />
        <Route path='/listagem-funcionario' element={<Listagemfuncionario />} />
        <Route path='/listagem-fornecedor' element={<Listagemfornecedor />} />
        <Route path='/listagem-agenda' element={<Listagemagenda />} />
        <Route path='/listagem-venda' element={<Listagemvenda />} />
        <Route path='/listagem-comanda' element={<Listagemcomanda />} />
        <Route path='/listagem-forma-pagamento' element={<ListagemFormaPagamento />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;