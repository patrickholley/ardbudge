import { v4 as uuidv4 } from 'uuid';
import {ArdBudgeData, ArdBudgeDatum, ArdListener, ArdState} from '@app-types/store';

class Store {
    private readonly _state: ArdState;
    private _listeners: ArdListener[] = [];

    constructor(initialState: ArdState) {
        const localBudges = localStorage.getItem('budges');
        this._state = { ...initialState, ...(localBudges && { Budges: JSON.parse(localBudges) }) };
        this.notifyListeners();
    }

    getBudges(): ArdBudgeData[] {
        return this._state.Budges;
    }

    getLoadingCount(): number {
        return this._state.LoadingCount;
    }

    addBudge(budgeName: string): boolean {
        if (!this._state.Budges.find(b => b.name === budgeName)) {
            this._state.Budges.push({
                id: uuidv4(),
                name: budgeName,
                rows: []
            });

            this.notifyListeners();
            return true;
        } else {
            alert(`Budge already exists with name: ${budgeName} - please choose another name!`);
            return false;
        }
    }

    /*private updateBudge(budgeId: string, updates: Partial<ArdBudges[number]>): void {
        const budge = this._state.Budges.find(b => b.id === budgeId);
        if (budge) {
            Object.assign(budge, updates);
            this.notifyListeners();
        }
    }*/

    addRow(budgeId: string, row: ArdBudgeDatum): void {
        const budge = this._state.Budges.find(b => b.id === budgeId);
        if (budge) {
            budge.rows.push(row);
            this.notifyListeners();
        }
    }

    deleteRow(budgeId: string, rowIndex: number): void {
        const budge = this._state.Budges.find(b => b.id === budgeId);
        if (budge) {
            budge.rows.splice(rowIndex, 1);
            this.notifyListeners();
        }
    }

    editRow(budgeId: string, rowIndex: number, row: ArdBudgeDatum): void {
        const budge = this._state.Budges.find(b => b.id === budgeId);
        if (budge) {
            budge.rows[rowIndex] = row;
            this.notifyListeners();
        }
    }

    incrementLoadingCount(): void {
        this._state.LoadingCount += 1;
        this.notifyListeners();
    }

    decrementLoadingCount(): void {
        this._state.LoadingCount -= 1;
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
    Budges: [],
    LoadingCount: 0
});
