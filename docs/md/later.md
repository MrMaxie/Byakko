---
type: Function
name: later
---

Function that allows you to pack pointed value into recognizable box. Pointed value will be getted only at request, so any [Proxy getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) will be not fired before real usage. If such value will be getted in any kind of [Mobx' observer context](https://mobx.js.org/best/react.html), then you can to track such value with possibility to attach it as prop or argument for deeper usage.

<strong>Props</strong>
<div class="list">
<div class="list-item">
    <code>target</code> : <code>object | any[]</code>
    <div class="list-tag">
        <tag type="required" />
    </div>
    <div class="list-desc">
        <p>
            Owner of observable value
        </p>
    </div>
</div>
<div class="list-item">
    <code>key</code> : <code>string | number</code>
    <div class="list-tag">
        <tag type="required" />
    </div>
    <div class="list-desc">
        <p>
            Name of property inside of target value
        </p>
    </div>
</div>
</div>
<strong>Returns</strong>
<div class="list">
<div class="list-item">
    <code>{ get: () => any }</code>
    <div class="list-desc">
        <p>
            Object with getter of pointed value
        </p>
    </div>
</div>
</div>

<strong>Example #1</strong> &mdash; <i>raw usage</i>

```typescript
class Store {
    @observable
    value = 'test?';
}
const store = new Store();

const value = later(store, 'value');

value.get(); // 'test?'

store.value = 'test!';

value.get(); // 'test!'
```

<strong>Example #2</strong> &mdash; <i>deep anonymous usage</i>

```typescript
const logValueOnChange = (value: Later<string>) => {
    // value is SOME later value that returns string
    autorun(() => {
        console.log(value.get());
    });
};

class Store {
    @observable
    value = 'test?';
}
const store = new Store();
logValueOnChange(later(store, 'value')); // prints 'test?'
store.value = 'test!'; // prints 'test!'
```
