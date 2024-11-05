import ardRender from "@utils/ardRender";

const componentTag = "landing-page";

class LandingPage extends HTMLElement {
    constructor() {
        super();
        this.componentTag = componentTag;
        ardRender(this);
    }
}

customElements.define(componentTag, LandingPage);
