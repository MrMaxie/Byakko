---
type: Component
name: If
---

Component that allows you to render block conditionally. Works the best with <a href="#later">later</a> because it's possible to omit all rerendering stack and render only that block relating on pointed value.

Block inside will be rendered only if given value (or pointed value by <a href="#later">later</a>) will be [**truthy**](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).

<strong>Props</strong>
<div class="list">
<div class="list-item">
    <code>value</code> : <code><a href="#later">Later</a> | any</code>
    <div class="list-tag">
        <tag type="required" />
    </div>
    <div class="list-desc">
        <p>
            Condition value
        </p>
    </div>
</div>
<div class="list-item">
    <code>children</code> : <code>JSX.Element</code>
    <div class="list-tag">
        <tag type="default"><code>undefined</code></tag>
    </div>
    <div class="list-desc">
        <p>
            Rendered content
        </p>
    </div>
</div>
</div>


<strong>Example #1</strong> &mdash; <i>raw usage</i>

```tsx
const ExampleComponent = (props: { showMessage: boolean }) => (
    <If value={props.showMessage}>
        Hello there
    </If>
);

// ExampleComponent need to be rerendered to rerender new state of <If/> block
```
Example #2 - <a href="#later">later</a> usage

```tsx
// Create store holding that value
class Store {
    @observable // Mobx @observable decorator
    showMessage = false;
}
const store = new Store();

const ExampleComponent = () => (
    <If value={later(store, 'showMessage')}>
        Hello there
    </If>
);

// ExampleComponent will be rendered once, <If/> will be always synced with store
```
