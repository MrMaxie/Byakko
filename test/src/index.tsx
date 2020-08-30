import React from 'preact';
import ReactDOM from 'preact/compat';
import MobxReact from 'mobx-react';
import App from './App';

MobxReact.observerBatching({
    batchedUpdates: ReactDOM.unstable_batchedUpdates as any,
});

const app = document.querySelector('#app-body');

if (app) {
    React.render(<App />, app);
}
