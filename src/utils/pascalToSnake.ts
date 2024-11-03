const pascalToSnake = (pascalString: string) => pascalString
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

export default pascalToSnake;
