const getFileStrings = async (componentId: string): Promise<string[]> => {
    let templateString = '';
    let stylesString = '';

    try {
        templateString = (await import(`../templates/${componentId}.html?raw`)).default;
        stylesString = (await import(`../styles/${componentId}.css?inline`)).default;
    } catch (error: any) {
        console.warn(error.message);
    }

    return [templateString, stylesString];
};

export default getFileStrings;
