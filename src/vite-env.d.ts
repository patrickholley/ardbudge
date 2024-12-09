declare module '*.css' {
    const content: string;
    export default content;
}

// TODO: See about splitting these if possible, maybe extending the classes instead
interface HTMLElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    onRender?(): void;
    onStoreUpdate?(state?: ArdState): void;
    onUnmount?(): void;
    componentTag?: string;
    formName?: string;
    legend?: string;
    budgetId?: string;
    budgetName?: string;
}

// Remember VITE prefix
interface ImportMetaEnv {
    VITE_DATABASE_URL: string;
    VITE_APP_VERSION: string;
    MODE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
