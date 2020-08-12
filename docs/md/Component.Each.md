<h1 id="Each">
    <a href="#Each">#</a>
    Each
</h1>

Component that allows you to iterate trough iterable variable. Works the best with <a href="#later">later</a> because it's possible to omit all rerendering stack and render only that list elements.

Props
- value : `Later | any[]`
- render : `(item: any, index: number) => JSX.Eelement`


Example #1 - raw usage

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
