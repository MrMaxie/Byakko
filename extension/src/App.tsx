import React from 'preact';
import './App.scss';

const globalSymbol = '__BYAKKO_DEV__';

let t = '';
let x = 0;

addEventListener('message', e => {
    t = JSON.stringify(e);
});

export default class App extends React.Component {

    render() {
        if (!(globalSymbol in window) && false) {
            return (
                <div class="over-bg">
                    <span>Cannot connect with Byakko instance</span>
                    <span class="try-again">Click anywhere to try again...</span>
                </div>
            );
        }

        x += 1;

        return (
            <div class="app" onClick={() => this.forceUpdate()}>
                hello {x}
                {t}
            </div>
        );
    }
}
