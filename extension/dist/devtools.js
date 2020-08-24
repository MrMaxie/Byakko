chrome.devtools.panels.create('Byakko', null, 'panel.html').then(panel => {

    panel.onShown.addListener(() => {
        console.log("Shown");
    });

    panel.onHidden.addListener(() => {
        console.log("Hidden");
    });
});

chrome.runtime.connect({
    name: 'byakko-inspect-devtools',
});
