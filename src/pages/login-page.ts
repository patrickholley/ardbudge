import ardRender from "@utils/ardRender";
import {store} from "@store";

const componentTag = "login-page";

class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.componentTag = componentTag;
        ardRender(this);
    }

    login = async () => {
        const userId = (this.shadowRoot?.getElementById('userid') as HTMLInputElement).value;
        if (userId) {
            await store.getUser(userId);
            console.log('logged in?');
        }
    }

    onRender() {
        this.shadowRoot?.getElementById('login-button')?.addEventListener('click', this.login);
        console.log(this.shadowRoot);
    }
}

customElements.define(componentTag, LoginPage);
