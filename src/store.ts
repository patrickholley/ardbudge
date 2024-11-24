import {CreateFunction, EntityWithId, StoreListener, StoreState} from '@app-types/store';
import { BudgetService, ExpenseService, UserService } from './services';
import {Budget, Expense, NewUser} from "@app-types/services.ts";

class Store {
    private readonly _state: StoreState = {
        budgets: [],
        expenses: [],
        currentBudget: null,
        currentExpense: null,
        currentUser: null,
        loadingCount: 0,
    };

    private userService: UserService;
    private expenseService: ExpenseService;
    private budgetService: BudgetService;

    private _listeners: StoreListener[] = [];

    constructor() {
        this.userService = new UserService();
        this.expenseService = new ExpenseService();
        this.budgetService = new BudgetService();
        this.notifyListeners();
    }

    getState = (): StoreState => {
        return this._state;
    }

    // General methods
    getLoadingCount = (): number => {
        return this._state.loadingCount;
    }

    incrementLoadingCount = (): void => {
        this._state.loadingCount += 1;
        this.notifyListeners();
    }

    decrementLoadingCount = (): void => {
        this._state.loadingCount -= 1;
        this.notifyListeners();
    }

    subscribe = (listener: StoreListener): void => {
        this._listeners.push(listener);
    }

    unsubscribe = (listener: StoreListener): void => {
        this._listeners = this._listeners.filter(l => l !== listener);
    }

    private notifyListeners = (): void => {
        this._listeners.forEach(listener => listener(this._state));
    }

    private handleRequest = async (callback: () => Promise<void>): Promise<void> => {
        this.incrementLoadingCount();
        await callback();
        this.decrementLoadingCount();
        this.notifyListeners();
    }

    private getEntity = async <T>(
        key: keyof StoreState,
        fetchFunc: (id: string) => Promise<T>,
        entityId: string
    ): Promise<void> => {
        await this.handleRequest(async () => {
            console.log(key, fetchFunc, entityId);
            await fetchFunc(entityId);
            //(this._state[key] as T) = await fetchFunc(entityId);
        });
    }

    private createEntity = async <T>(
        key: keyof StoreState,
        parentId: string,
        entity: T,
        createFunc: CreateFunction<T>
    ): Promise<void> => {
        await this.handleRequest(async () => {
            const newEntity = await createFunc(parentId, entity);
            (this._state[key] as T[]).push(newEntity);
        });
    }

    private updateEntity = async <T>(
        key: keyof StoreState,
        entityId: string,
        entity: T,
        updateFunc: (id: string, entity: T) => Promise<T>
    ): Promise<void> => {
        await this.handleRequest(async () => {
            const updatedEntity = await updateFunc(entityId, entity);
            (this._state[key] as T[]) = (this._state[key] as T[]).map(e =>
                (e as EntityWithId).id === entityId ? updatedEntity : e
            );
        });
    }

    private deleteEntity = async <T>(
        key: keyof StoreState,
        entityId: string,
        deleteFunc: (id: string) => Promise<void>
    ): Promise<void> => {
        await this.handleRequest(async () => {
            await deleteFunc(entityId);
            (this._state[key] as T[]) = (this._state[key] as T[]).filter(e =>
                (e as EntityWithId).id !== entityId
            );
        });
    }

    // User methods
    getCurrentUserId = (): string => this._state.currentUser?.id || '';

    getUser = async (username: string): Promise<void> => {
        await this.getEntity('currentUser', this.userService.getUser, username);
    }

    createUser = async (user: NewUser): Promise<void> => {
        await this.createEntity('currentUser', '', user, this.userService.createUser as unknown as CreateFunction<NewUser>);
    }

    updateUser = async (userId: string, user: NewUser): Promise<void> => {
        await this.updateEntity('currentUser', userId, user, this.userService.updateUser);
    }

    deleteUser = async (userId: string): Promise<void> => {
        await this.deleteEntity('currentUser', userId, this.userService.deleteUser);
        this._state.currentUser = null;
    }

    // Expense methods
    getCurrentExpenseId = (): string => {
        return this._state.currentExpense?.id || '';
    }

    getExpenses = async (): Promise<void> => {
        await this.handleRequest(async () => {
            this._state.expenses = await this.expenseService.getExpenses(this.getCurrentBudgetId());
        });
    }

    getExpense = async (expenseId: string): Promise<void> => {
        await this.getEntity('currentExpense', this.expenseService.getExpense, expenseId);
    }

    createExpense = async (expense: Expense): Promise<void> => {
        await this.createEntity('expenses', this.getCurrentBudgetId(), expense, this.expenseService.createExpense);
    }

    updateExpense = async (expenseId: string, expense: Expense): Promise<void> => {
        await this.updateEntity('expenses', expenseId, expense, this.expenseService.updateExpense);
    }

    deleteExpense = async (expenseId: string): Promise<void> => {
        await this.deleteEntity('expenses', expenseId, this.expenseService.deleteExpense);
    }

    // Budget methods
    getCurrentBudgetId = (): string => {
        return this._state.currentBudget?.id || '';
    }

    getBudgets = async (): Promise<void> => {
        await this.handleRequest(async () => {
            this._state.budgets = await this.budgetService.getBudgets(this.getCurrentUserId());
        });
    }

    getBudget = async (budgetId: string): Promise<void> => {
        await this.getEntity('currentBudget', this.budgetService.getBudget, budgetId);
    }

    createBudget = async (budget: Budget): Promise<void> => {
        await this.createEntity('budgets', this.getCurrentUserId(), budget, this.budgetService.createBudget);
    }

    updateBudget = async (budgetId: string, budget: Expense): Promise<void> => {
        await this.updateEntity('budgets', budgetId, budget, this.expenseService.updateExpense);
    }

    deleteBudget = async (budgetId: string): Promise<void> => {
        await this.deleteEntity('budgets', budgetId, this.expenseService.deleteExpense);
    }
}

export const store = new Store();
