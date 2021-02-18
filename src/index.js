import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as workServer from './workServer';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-table/react-table.css';

ReactDOM.render(<App />, document.getElementById('root'));

workServer.unenroll();
