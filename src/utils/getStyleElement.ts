const getStyleElement = (textContent: string) => Object.assign(
    document.createElement('style'),
    { textContent }
);

export default getStyleElement;
