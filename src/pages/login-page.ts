import ardRender from "@utils/ardRender";
import {store} from "@store";

const componentTag = "login-page";

class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.componentTag = componentTag;
        ardRender(this);
    }

    loginOrCreateUser = async () => {
        const name = (this.shadowRoot?.getElementById('username') as HTMLInputElement).value;
        const isNewUser = (this.shadowRoot?.getElementById('create-tab') as HTMLInputElement).disabled;

        if (name) {
            if (isNewUser) {
                await store.createUser({ name });
            } else {
                await store.getUser(name);
            }
        }
    }

    switchTab = () => {
        const signInTab = this.shadowRoot?.getElementById('sign-in-tab') as HTMLButtonElement;
        const createTab = this.shadowRoot?.getElementById('create-tab') as HTMLButtonElement;
        const loginButton = this.shadowRoot?.getElementById('login-button') as HTMLButtonElement;

        signInTab.disabled = !signInTab.disabled;
        createTab.disabled = !createTab.disabled;

        loginButton.textContent = signInTab.disabled ? 'Sign In' : 'Create User';
    }

    onRender() {
        this.shadowRoot?.getElementById('login-button')?.addEventListener('click', this.loginOrCreateUser);
        this.shadowRoot?.getElementById('sign-in-tab')?.addEventListener('click', this.switchTab);
        this.shadowRoot?.getElementById('create-tab')?.addEventListener('click', this.switchTab);
    }
}

customElements.define(componentTag, LoginPage);
