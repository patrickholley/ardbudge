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
        const password = (this.shadowRoot?.getElementById('password') as HTMLInputElement).value;
        const isNewUser = (this.shadowRoot?.getElementById('create-tab') as HTMLInputElement).disabled;

        if (name) {
            if (isNewUser) {
                await store.createUser({ name, password });
            } else {
                await store.login(name, password);
            }
        }
    }

    switchTab = () => {
        const signInTab = this.shadowRoot?.getElementById('sign-in-tab') as HTMLButtonElement;
        const createTab = this.shadowRoot?.getElementById('create-tab') as HTMLButtonElement;
        const loginButton = this.shadowRoot?.getElementById('login-button') as HTMLButtonElement;
        const loginContainer = this.shadowRoot?.getElementById('login-container') as HTMLElement;
        const loginIcon = this.shadowRoot?.getElementById('login-icon') as HTMLElement;

        signInTab.disabled = !signInTab.disabled;
        createTab.disabled = !createTab.disabled;
        loginButton.textContent = signInTab.disabled ? 'Sign In' : 'Create User';
        loginContainer.classList.toggle('create-user');
        loginIcon.classList.toggle('create-user');
    }

    handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') this.loginOrCreateUser().then();
    }

    onRender() {
        this.shadowRoot?.getElementById('login-button')?.addEventListener('click', this.loginOrCreateUser);
        this.shadowRoot?.getElementById('sign-in-tab')?.addEventListener('click', this.switchTab);
        this.shadowRoot?.getElementById('create-tab')?.addEventListener('click', this.switchTab);
        this.shadowRoot?.getElementById('username')?.addEventListener('keypress', this.handleKeyPress);
        this.shadowRoot?.getElementById('password')?.addEventListener('keypress', this.handleKeyPress);
    }
}

customElements.define(componentTag, LoginPage);