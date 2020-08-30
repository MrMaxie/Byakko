import React from 'preact';
import ReactDOM from 'preact/compat';
import MobxReact from 'mobx-react';
import App from './App';
import './index.scss';

MobxReact.observerBatching({
    batchedUpdates: ReactDOM.unstable_batchedUpdates as any,
});

const app = document.getElementById('app');

if (app) {
    React.render(<App />, app);
}
