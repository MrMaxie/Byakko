---
type: Decorator
name: asAction
---

Decorator that allows you to set-up method as action. Without that method will never be ran as action. The class of this method must be a valid controller.

<strong>Arguments</strong>
<div class="list">
<div class="list-item">
    <code>name</code> : <code>string</code>
    <div class="list-tag">
        <tag type="required" />
    </div>
    <div class="list-desc">
        <p>
            Descriptive short name of action
        </p>
    </div>
</div>
<div class="list-item">
    <code>path</code> : <code>string | string[]</code>
    <div class="list-tag">
        <tag type="default"><code>'/'</code></tag>
    </div>
    <div class="list-desc">
        <p>
            Path or paths where action will be mounted
        </p>
        <p>
            All actions inside will be mounted inside of that path. So if controller is mounted under path <code>/user</code>, inside action will be mounted under <code>/login</code> then, as a result, the action will be registered under the path <code>/user/login</code>.
        </p>
    </div>
</div>
</div>


<strong>Example</strong> &mdash; <i>example controller</i>

```tsx
@asController({
    name: 'User',
    path: ['/', '/user'],
})
class User {
    @asAction({
        name: 'Login',
        path: '/login',
    })
    loginAction() {

    }
}
```
