const connections = {};

chrome.runtime.onMessage.addListener((request, sender) => {
    if (sender.tab) {
        const id = sender.tab.id;

        if (id in connections) {
            connections[id].postMessage(request);
        }
    }

    return true;
});

chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(request => {
        if (request.name === 'init') {
            connections[request.tabId] = port;

            port.onDisconnect.addListener(() => {
                delete connections[request.tabId];
            });

            return;
        }

        chrome.tabs.sendMessage(request.tabId, {
            name: request.name,
            data: request.data,
        });
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId in connections && changeInfo.status === 'complete') {
        connections[tabId].postMessage({
            name: 'reloaded',
        });
    }
});