import * as React from 'react';
import Button from '@mui/material/Button';
import 'bootswatch/dist/flatly/bootstrap.css';
import 'toastr/build/toastr.min';
import 'toastr/build/toastr.css';
import Navbar from './components/navbar.js';
import Rotas from './rotas.js'


function App() {
  return (
    <div className='container'>
        <Rotas />
        <Navbar />
      </div>
  );
}

export default App;
