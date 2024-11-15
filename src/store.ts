import {BudgetData, BudgetDatum, StoreListener, StoreState} from '@app-types/store';
import generateBudgetId from "@utils/generateBudgetId";

class Store {
    private readonly _state: StoreState;
    private _listeners: StoreListener[] = [];

    constructor(initialState: StoreState) {
        const localBudgets = localStorage.getItem('budgets');
        this._state = { ...initialState, ...(localBudgets && { Budgets: JSON.parse(localBudgets) }) };
        this.notifyListeners();
    }

    getBudgets(): BudgetData[] {
        return this._state.Budgets;
    }

    getBudget(budgetId: string): BudgetData | undefined {
        return this._state.Budgets.find(b => b.id === budgetId);
    }

    getLoadingCount(): number {
        return this._state.LoadingCount;
    }

    addBudget(budgetName: string): boolean {
        if (!this._state.Budgets.find(b => b.name === budgetName)) {
            this._state.Budgets.push({
                id: generateBudgetId(),
                name: budgetName,
                rows: []
            });

            this.notifyListeners();
            return true;
        } else {
            alert(`Budget already exists with name: ${budgetName} - please choose another name!`);
            return false;
        }
    }

    addRow(budgetId: string, row: BudgetDatum): void {
        const budget = this._state.Budgets.find(b => b.id === budgetId);
        if (budget) {
            budget.rows.push(row);
            this.notifyListeners();
        }
    }

    deleteRow(budgetId: string, rowIndex: number): void {
        const budget = this._state.Budgets.find(b => b.id === budgetId);
        if (budget) {
            budget.rows.splice(rowIndex, 1);
            this.notifyListeners();
        }
    }

    editRow(budgetId: string, rowIndex: number, row: BudgetDatum): void {
        const budget = this._state.Budgets.find(b => b.id === budgetId);
        if (budget) {
            budget.rows[rowIndex] = row;
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

    subscribe(listener: StoreListener): void {
        this._listeners.push(listener);
    }

    unsubscribe(listener: StoreListener): void {
        this._listeners = this._listeners.filter(l => l !== listener);
    }

    private notifyListeners(): void {
        localStorage.setItem('budgets', JSON.stringify(this.getBudgets()));
        this._listeners.forEach(listener => listener(this._state));
    }
}

export const store = new Store({
    Budgets: [],
    LoadingCount: 0
});
