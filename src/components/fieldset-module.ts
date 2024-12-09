abstract class FieldsetModule {
    protected shadowRoot: ShadowRoot;

    protected constructor(shadowRoot: ShadowRoot) {
        this.shadowRoot = shadowRoot;
    }

    abstract onChange(e: Event): void;

    abstract prepareForm(): void;
}

export default FieldsetModule;
