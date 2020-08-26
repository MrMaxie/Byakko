export class Core {
    dev() {
        window['__BYAKKO_DEV__'] = this;
        window.postMessage({
            greeting: 'hello there!',
            source: 'byakko-inspect-devtools'
        }, '*');
    }
}
