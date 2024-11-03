import { store } from '@store';
import { ArdState } from '@app-types/store';
import render from "@utils/render";

class LandingPage extends HTMLElement {
    private _budges: string[] = Object.keys(store.getBudges());
    //private _newBudgeName: string = '';

    constructor() {
        super();
        render(this);
    }

    onStoreUpdate = (state: ArdState) => {
        this._budges = Object.keys(state);
    }

    /*private handleNewBudgeNameChange = (event: Event) => {
        const input = event.target as HTMLInputElement;
        this._newBudgeName = input.value;
    }

    private handleAddBudge = () => {
        if (this._newBudgeName.trim()) {
            store.addBudge(this._newBudgeName.trim());
            this._newBudgeName = '';
        }
    }*/
}

customElements.define('landing-page', LandingPage);

export default LandingPage;