import React from 'preact';
import App from './App';
import './index.scss';
import './_vars.scss';

const app = document.getElementById('app');

if (app) {
    React.render(<App />, app);
}
