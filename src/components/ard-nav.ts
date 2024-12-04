import {lightRender} from "@utils/ardRender";
import {store} from "@store";

const componentTag = 'ard-nav';

class ArdNav extends HTMLElement {
    navButton?: HTMLElement | null;
    slidingNav?: HTMLElement | null;

    constructor() {
        super();
        this.componentTag = componentTag;
        lightRender(this);
    }

    handleDocumentClick = (event: Event) => {
        if (!this.contains(event.target as Node))  this.toggleNav('remove');
    }

    handleSignOut = () => {
        store.logOut();
    }

    toggleNav = (addOrRemove: 'add' | 'remove') => {
        [this.slidingNav, this.navButton].forEach(
            el => el?.classList[addOrRemove]('open')
        );
    }

    onRender() {
        document.addEventListener('click', this.handleDocumentClick);
        this.slidingNav = this.shadowRoot?.getElementById('sliding-nav');
        this.navButton = this.shadowRoot?.getElementById('ardfudge-icon-container');

        (this.shadowRoot?.getElementById('sign-out') as HTMLButtonElement)
            ?.addEventListener('click', this.handleSignOut);

        (this.navButton as HTMLButtonElement)
            ?.addEventListener('click', () => this.toggleNav('add'));
    }

    onDismount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }
}

customElements.define(componentTag, ArdNav);