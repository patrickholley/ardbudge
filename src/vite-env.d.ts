declare module '*.css' {
    const content: string;
    export default content;
}

interface HTMLElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    onRender?(): void;
    onStoreUpdate?(state?: ArdState): void;
    componentTag?: string;
    formName?: string;
    legend?: string;
}

interface ImportMetaEnv {
    VITE_APP_VERSION: string;
    MODE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
