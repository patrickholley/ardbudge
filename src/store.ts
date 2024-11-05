import {ArdBudgeDatum, ArdBudges, ArdListener, ArdState} from '@app-types/store';

class Store {
    private readonly _state: ArdState;
    private _listeners: ArdListener[] = [];

    constructor(initialState: ArdState) {
        const localBudges = localStorage.getItem('budges');
        this._state = { ...initialState, ...(localBudges && { Budges: JSON.parse(localBudges) }) };
    }

    getBudges(): ArdBudges {
        return this._state.Budges;
    }

    getLoadingCount(): number {
        return this._state.LoadingCount;
    }

    addBudge(budgeName: string): void {
        if (!this._state.Budges[budgeName]) {
            this._state.Budges[budgeName] = {
                name: budgeName,
                rows: []
            };
        } else {
            alert(`Budge already exists with name: ${budgeName} - please choose another name!`);
        }

        this.notifyListeners();
    }

    private updateBudge(budgeName: string, updates: { name?: string; rows?: ArdBudgeDatum[] }): void {
        this._state.Budges[budgeName] = {
            ...this._state.Budges[budgeName],
            ...updates
        };

        this.notifyListeners();
    }

    addRow(budgeName: string, row: ArdBudgeDatum): void {
        this.updateBudge(budgeName, { rows: [...this._state.Budges[budgeName].rows, row] });
    }

    deleteRow(budgeName: string, rowIndex: number): void {
        this.updateBudge(budgeName, { rows: this._state.Budges[budgeName].rows.slice(0, rowIndex).concat(this._state.Budges[budgeName].rows.slice(rowIndex + 1)) });
    }

    editRow(budgeName: string, rowIndex: number, row: ArdBudgeDatum): void {
        const updatedRows = this._state.Budges[budgeName].rows.slice();
        updatedRows[rowIndex] = row;
        this.updateBudge(budgeName, { rows: updatedRows });
    }

    incrementLoadingCount(): void {
        this._state.LoadingCount += 1;
        console.log(this._state.LoadingCount);
        this.notifyListeners();
    }

    decrementLoadingCount(): void {
        this._state.LoadingCount -= 1;
        console.log(this._state.LoadingCount);
        this.notifyListeners();
    }

    subscribe(listener: ArdListener): void {
        this._listeners.push(listener);
    }

    unsubscribe(listener: ArdListener): void {
        this._listeners = this._listeners.filter(l => l !== listener);
    }

    private notifyListeners(): void {
        localStorage.setItem('budges', JSON.stringify(this.getBudges()));
        this._listeners.forEach(listener => listener(this._state));
    }
}

export const store = new Store({
    Budges: {
        MyFirstBudge: {
            name: 'MyFirstBudge',
            rows: []
        }
    },
    LoadingCount: 0
});
