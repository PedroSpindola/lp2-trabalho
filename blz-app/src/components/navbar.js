import React from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';

import NavbarItem from './navbarItem';

function Navbar(props) {
  return (
    <div className='navbar navbar-expand-lg fixed-top navbar-dark bg-primary'>
      <div className='container'>
        <a href='/' className='navbar-brand'>
          BLZFODA
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarResponsive'
          aria-controls='navbarResponsive'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarResponsive'>
          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/Cadastroprodutos' label='produto' />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/CadastroServico' label='serviço' />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/CadastroLoja' label='loja'/>
          </ul>

        </div>
      </div>
    </div>
  );
}

export default Navbar;