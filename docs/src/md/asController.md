---
type: Decorator
name: asController
---

Decorator that allows you to set-up class as controller. Without that class will be ignored at controllers registration process.

<strong>Arguments</strong>
<div class="list">
<div class="list-item">
    <code>name</code> : <code>string</code>
    <div class="list-tag">
        <tag type="required" />
    </div>
    <div class="list-desc">
        <p>
            Descriptive short name of controller
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
            Path or paths where controller will be mounted
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
    // Actions here, e.g:
    // - /login
    // - /register
    // - /profile
    // - /logout
    // etc
    // so /login and /user/login will casue running above action
}
```
