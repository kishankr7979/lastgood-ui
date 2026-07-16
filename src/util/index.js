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