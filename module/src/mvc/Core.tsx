declare const chrome: any;

export class Core {
    private _devSend = (name: string, data: any) => {
        window.postMessage({
            name,
            data,
            source: 'byakko-inspect-page',
        }, '*');
    };

    private _devInterpret = (name: string, data: any) => {
        switch (name) {
            case 'connect':
                this._devSend('connect', 'connect');
                break;
        }
    };

    dev = () => {
        if (!chrome || !chrome.runtime || !chrome.runtime.connect) {
            return;
        }

        const port = chrome.runtime.connect('paeoggkpmcjdnnkmdgefjfflnkkjicff');

        window.addEventListener('message', e => {
            const msg = e.data;

            if (!msg) {
                return;
            }

            switch(msg.source) {
                case 'byakko-inspect-devtools':
                    this._devInterpret(msg.name, msg.data);
                    break;
                case 'byakko-inspect-page':
                    port.postMessage(msg);
                    break;
            }
        });
    };
}
