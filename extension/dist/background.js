const conns = {};

chrome.runtime.onConnect.addListener(port => {
    const handler = (msg, sender, res) => {
        console.log('devt', msg);

        if (msg.name === 'init') {
            conns[msg.tabId] = port;
            console.log(`register for ${msg.tabId}`);
            return;
        }

        chrome.tabs.sendMessage(msg.tabId, msg.data);
    };

    port.onMessage.addListener(handler);

    port.onDisconnect.addListener(port => {
        port.onMessage.removeListener(handler);

        for (const tab in conns) {
            if (conns[tab] === port) {
                delete conns[tab];
                return;
            }
        }
    });
});

chrome.runtime.onMessage.addListener((msg, sender, res) => {
    console.log('page', msg);

    if (!sender.tab) {
        return true;
    }

    if (sender.tab.id in conns) {
        conns[sender.tab.id].postMessage(msg);
    }

    return true;
});
