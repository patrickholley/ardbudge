/// <reference types="vite/client" />
import {ArdState} from "@app-types/store";

declare module '*.css' {
    const content: string;
    export default content;
}

interface HTMLElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    onRender?(): void;
    onStoreUpdate?(state?: ArdState): void;
}
