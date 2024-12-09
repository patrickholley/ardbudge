import {lightRender} from "@utils/ardRender";
import {store} from "@store";

const componentTag = 'ard-nav';

class ArdNav extends HTMLElement {
    navContainer?: HTMLElement | null;
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
        [this.slidingNav, this.navContainer].forEach(
            el => el?.classList[addOrRemove]('open')
        );
    }

    onRender() {
        document.addEventListener('click', this.handleDocumentClick);
        this.slidingNav = this.shadowRoot?.getElementById('sliding-nav');
        this.navContainer = this.shadowRoot?.getElementById('nav-menu');

        (this.shadowRoot?.getElementById('sign-out') as HTMLButtonElement)
            ?.addEventListener('click', this.handleSignOut);

        this.shadowRoot?.getElementById('ardfudge-icon-container')
            ?.addEventListener('click', () => this.toggleNav('add'));
    }

    onUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }
}

customElements.define(componentTag, ArdNav);