import { Card } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Agenda(){

    return(
        <div className='container'>
            <Card title='Agenda'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-componet'>
                            <table className='table table-hover'>
                                <thead>
                                    <tr>
                                        <th scope='col'>Horario</th>
                                        <th scope='col'>Edylaine</th>
                                        <th scope='col'>Jurema</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>

                                        <td>8hrs</td>

                                    </tr>
                                </tbody>
                            </table>{' '}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default Agenda;