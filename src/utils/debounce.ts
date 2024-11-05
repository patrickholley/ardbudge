const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;

    const debouncedFunction = function (...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };

    debouncedFunction.cancel = () => {
        clearTimeout(timeout);
    };

    return debouncedFunction;
}

export default debounce;
