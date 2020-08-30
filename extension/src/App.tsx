import React from 'preact';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import './App.scss';

const globalSymbol = 'byakko';

class Store {
    @observable
    isConnected = false;

    @observable
    active = 'log';

    @action
    setActive(active: string) {
        this.active = active;
    }

    @observable
    msgs: Array<any> = [];

    @action
    pushMsg(msg: any) {
        this.msgs.push(msg);
    }

    @action
    clear() {
        this.msgs = [];
        this.isConnected = false;
    }

    @action
    connect() {
        this.clear();
        this.isConnected = true;
    }
}

const context = new Store();

const conn = chrome.runtime.connect({
    name: 'panel',
});

conn.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});

conn.onMessage.addListener(msg => {
    if (!msg || !msg.name || !msg.data) {
        return;
    }

    switch (msg.name) {
        case 'connect':
            context.connect();
            break;
        case 'die':
            context.clear();
            break;
    }
});


export default observer(() => {
    if (!(globalSymbol in window) && false) {
        return (
            <div class="over-bg">
                <span>Cannot connect with Byakko instance</span>
                <span class="try-again">Click anywhere to try again...</span>
            </div>
        );
    }

    const navItems = [
        { name: 'Log', key: 'log' },
        { name: 'Actions', key: 'actions' },
        { name: 'Tasks', key: 'tasks' },
        { name: 'Data', key: 'data' },
    ].map(x => (
        <div
            key={x.key}
            class="tab"
            onClick={() => context.setActive(x.key)}
            data-is-active={context.active === x.key}
        >
            {x.name}
        </div>
    ));

    const msgs = context.msgs.map(x => JSON.stringify(x, null, 4));

    return (
        <div class="app">
            <div class="nav">
                <div class="logo">Byakko</div>
                {navItems}
                <div class="status" data-is-connected={context.isConnected}>
                    {context.isConnected ? 'connected' : 'disconnected'}
                </div>
            </div>
            <pre>
                {msgs}
            </pre>
        </div>
    );
});
