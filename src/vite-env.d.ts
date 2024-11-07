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
    componentTag?: string;
    formName?: string;
    legend?: string;
    budgeId?: string;
    budgeName?: string;
}

interface ImportMetaEnv {
    VITE_APP_VERSION: string;
    MODE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
