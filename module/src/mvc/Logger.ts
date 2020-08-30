export class Logger {
    sendDev(name: string, data: any) {
        window.postMessage({
            name,
            data,
            source: 'byakko-inspect-page',
        }, '*');
    }
}
