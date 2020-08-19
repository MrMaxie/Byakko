---
type: Component
name: Each
---

Component that allows you to render iterable variable. Works the best with [later](#later) because it's possible to omit all rerendering stack and render only that list elements.

<strong>Props</strong>
<div class="list">
<div class="list-item">
    <code>value</code> : <code><a href="#later">Later</a> | any[]</code>
    <div class="list-tag">
        <tag type="required" />
    </div>
    <div class="list-desc">
        <p>
            List of values that will be rendered
        </p>
    </div>
</div>
<div class="list-item">
    <code>render</code> : <code>(item: any, index: number) => JSX.Eelement</code>
    <div class="list-tag">
        <tag type="required" />
    </div>
    <div class="list-desc">
        <p>
            Rendering function
        </p>
    </div>
</div>
</div>


<strong>Example #1</strong> &mdash; <i>raw usage</i>

```tsx
type Item = { id: number; name: string; };

const renderItem = (item: Item, index: number) => (
    <div key={item.id}>{item.name} at {index} position</div>
);

const ExampleComponent = (props: { list: Item[] }) => (
    <Each value={props.list} render={renderItem} />
);

// ExampleComponent need to be rerendered to rerender list
```
Example #2 - <a href="#later">later</a> usage

```tsx
type Item = { id: number; name: string; };

// Create store holding that value
class Store {
    @observable // Mobx @observable decorator
    list: Item[] = [];
}
const store = new Store();

const renderItem = (item: Item, index: number) => (
    <div key={item.id}>{item.name} at {index} position</div>
);

const ExampleComponent = () => (
    <Each value={later(store, 'list')} render={renderItem} />
);

// ExampleComponent will be rendered once
```
