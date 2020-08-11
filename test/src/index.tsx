import React from 'preact';
import App from './App';

const app = document.querySelector('#app-body');

if (app) {
    React.render(<App />, app);
}
