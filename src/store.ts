import {ArdBudgeDatum, ArdListener, ArdState} from "@app-types/store";

class Store {
    private readonly _state: ArdState;
    private _listeners: ArdListener[] = [];

    constructor(initialState: ArdState) {
        const savedState = localStorage.getItem('storeState');
        this._state = savedState ? JSON.parse(savedState) : initialState;
    }

    getBudges(): ArdState {
        return this._state;
    }

    addBudge(budgeName: string): void {
        if (!this._state[budgeName]) {
            this._state[budgeName] = {
                name: budgeName,
                rows: []
            };
        } else {
            alert(`Budge already exists with name: ${budgeName} - please choose another name!`);
        }

        this.notifyListeners();
    }

    private updateBudge(budgeName: string, updates: {name: string} | { rows: ArdBudgeDatum[]}): void {
        this._state[budgeName] = {
            ...this._state[budgeName],
            ...updates
        };

        this.notifyListeners();
    }

    addRow(budgeName: string, row: ArdBudgeDatum): void {
        this.updateBudge(
            budgeName,
            { rows: [...this._state[budgeName].rows, row] }
        );
    }

    deleteRow(budgeName: string, rowIndex: number): void {
        this.updateBudge(
            budgeName,
            { rows: this._state[budgeName].rows.toSpliced(rowIndex, 1) }
        );
    }

    editRow(budgeName: string, rowIndex: number, row: ArdBudgeDatum): void {
        this.updateBudge(
            budgeName,
            { rows: Object.assign([], this._state[budgeName].rows, {[rowIndex]: row}) }
        );
    }

    subscribe(listener: ArdListener): void {
        this._listeners.push(listener);
    }

    unsubscribe(listener: ArdListener): void {
        this._listeners = this._listeners.filter(l => l !== listener);
    }

    private notifyListeners(): void {
        localStorage.setItem('storeState', JSON.stringify(this._state));

        this._listeners.forEach(listener => listener(this._state));
    }
}

export const store = new Store({
    MyFirstBudge: {
        name: 'MyFirstBudge',
        rows: []
    }
});
