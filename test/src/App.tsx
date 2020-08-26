import React from 'preact';
import { observable, action } from 'mobx';
import { Core, If, Each, later, isLater, task } from 'byakko';

const core = new Core();
core.dev();

type Item = {
    id: number;
    name: string;
    value: number;
    isDone: boolean;
};

const obj = {
    x: 5,
};

const x = later(obj, 'x');

console.log(x);


class Store {
    i = 0;

    @observable
    list: Item[] = [];

    @task('Login', {
        silent: true,
    })
    login() {
        return new Promise((res, rej) => {
            setTimeout(() => {
                rej();
            }, 1000);
        });
    }

    add = () => {
        const id = ++this.i;

        this.list.push({
            id,
            name: `Nazwa #${id}`,
            value: id * 2,
            isDone: false,
        });
    };

    delete = (id: number) => action(() => {
        this.list = this.list.filter(x => x.id !== id);
    });

    toggle = (id: number) => action(() => {
        for (const item of this.list) {
            if (item.id === id) {
                item.isDone = !item.isDone;
            }
        }
    });
}

const store = new Store();

store.add();
store.add();
store.add();

const row = (item: Item, index: number) => {
    console.log('render item', index);

    return (
        <div key={item.id}>
            <h1>{item.name}</h1>
            <h2>{item.value}</h2>
            <If value={later(item, 'isDone')}>
                Zrobione
            </If>
            <button onClick={store.toggle(item.id)}>Toggle</button>
            <button onClick={store.delete(item.id)}>Usuń</button>
        </div>
    );
};

export default class App extends React.Component {
    @observable
    show = true;

    toggle = action(() => {
        this.show = !this.show;
    });

    render() {
        return (
            <div>
                <button onClick={store.login}>Login</button>
                <h1>Hello there</h1>
                <If value={later(this, 'show')}>
                    <h1>Prawda</h1>
                </If>
                <If value={this.show}>
                    <h1>Prawda</h1>
                </If>
                <Each value={later(store, 'list')} render={row} />
                <button onClick={store.add}>DODAJ</button>
                <button onClick={this.toggle}>TOGGLE</button>
            </div>
        );
    }
}
