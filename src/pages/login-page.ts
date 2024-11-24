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
        const isNewUser = (this.shadowRoot?.getElementById('new-user-toggle') as HTMLInputElement).checked;
        if (name) {
            if (isNewUser) {
                await store.createUser({name});
            }
            else {
                await store.getUser(name);
            }
        }
    }

    onRender() {
        this.shadowRoot?.getElementById('login-button')?.addEventListener('click', this.loginOrCreateUser);
        console.log(this.shadowRoot);
    }
}

customElements.define(componentTag, LoginPage);
