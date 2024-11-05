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
}

interface ImportMetaEnv {
    VITE_APP_VERSION: string;
    MODE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
