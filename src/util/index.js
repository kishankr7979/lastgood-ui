const contactCS = () => {

    if (!window.Helploom) {
        console.warn('helploom not init');
        return;
    }
    window.Helploom('open')
}

export {
    contactCS
}

export const isIframe = () => globalThis.top !== globalThis.self
