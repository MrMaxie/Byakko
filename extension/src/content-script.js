window.window.addEventListener('message', event => {
    const msg = event.data;

    if (typeof msg !== 'object'
        || msg === null
        || msg.source !== 'byakko-inspect-page') {
        return;
    }

    chrome.runtime.sendMessage({
        name: msg.name,
        data: msg.data,
    });
});

chrome.runtime.onMessage.addListener(msg => {
    msg.source = 'byakko-inspect-devtools';
    window.postMessage(msg, '*');
});

window.window.addEventListener('beforeunload', () => {
    window.window.postMessage({
        name: 'die',
        data: 'die',
        source: 'byakko-inspect-page',
    }, '*');
});

window.window.addEventListener('message', event => {
    if (event.source !== window) {
        return;
    }

    const msg = event.data;

    if (typeof msg !== 'object'
        || msg === null
        || msg.source !== 'byakko-inspect-devtools') {
        return;
    }

    console.log('devtools says', msg);
});

window.window.postMessage({
    name: 'connect',
    data: 'connect',
    source: 'byakko-inspect-devtools',
}, '*');
