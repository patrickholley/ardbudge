import {ArdBudgeDatum, ArdListener, ArdState} from "@app-types/store";

class Store {
    private state: ArdState;
    private listeners: ArdListener[] = [];

    constructor(initialState: ArdState) {
        this.state = initialState;
    }

    getBudges(): ArdState {
        return this.state;
    }

    addBudge(budgeName: string): void {
        if (!this.state[budgeName]) {
            this.state[budgeName] = {
                name: budgeName,
                rows: []
            };
        } else {
            alert(`Budge already exists with name: ${budgeName} - please choose another name!`);
        }

        this.notifyListeners();
    }

    private updateBudge(budgeName: string, updates: {name: string} | { rows: ArdBudgeDatum[]}): void {
        this.state[budgeName] = {
            ...this.state[budgeName],
            ...updates
        };

        this.notifyListeners();
    }

    addRow(budgeName: string, row: ArdBudgeDatum): void {
        this.updateBudge(
            budgeName,
            { rows: [...this.state[budgeName].rows, row] }
        );
    }

    deleteRow(budgeName: string, rowIndex: number): void {
        this.updateBudge(
            budgeName,
            { rows: this.state[budgeName].rows.toSpliced(rowIndex, 1) }
        );
    }

    editRow(budgeName: string, rowIndex: number, row: ArdBudgeDatum): void {
        this.updateBudge(
            budgeName,
            { rows: Object.assign([], this.state[budgeName].rows, {[rowIndex]: row}) }
        );
    }

    subscribe(listener: ArdListener): void {
        this.listeners.push(listener);
    }

    unsubscribe(listener: ArdListener): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.state));
    }
}

export const store = new Store({
    MyFirstBudge: {
        name: 'MyFirstBudge',
        rows: []
    }
});
