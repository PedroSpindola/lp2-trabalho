import React from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';

import NavbarItem from './navbarItem';

function Navbar(props) {
  return (
    <div className='navbar navbar-expand-lg fixed-top navbar-dark bg-primary'>
      <div className='container'>
        <a href='/' className='navbar-brand'>
          SBLZ
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
            <NavbarItem render='true' href='/listagem-produto' label='Produtos' />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/listagem-servico' label='Serviços' />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/listagem-loja' label='Lojas'/>
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/listagem-colaborador' label='Colaboradores'/>
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/listagem-cliente' label='Clientes'/>
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/listagem-cargo' label='Cargo'/>
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/listagem-funcionario' label='Funcionario'/>
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/listagem-fornecedor' label='Fornecedor'/>
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem render='true' href='/listagem-Agenda' label='Agenda'/>
          </ul>

        </div>
      </div>
    </div>
  );
}

export default Navbar;