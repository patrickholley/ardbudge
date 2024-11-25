import { CreateFunction, EntityWithId, StoreListener, StoreState } from '@app-types/store';
import { BudgetService, ExpenseService, UserService } from './services';
import { Budget, Expense, NewUser } from "@app-types/services.ts";
import router from "@components/router";

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

        this.initializeUserFromSessionStorage();
        this.notifyListeners();
    }

    private initializeUserFromSessionStorage(): void {
        const userData = sessionStorage.getItem('currentUser');
        if (userData) {
            this._state.currentUser = JSON.parse(userData);
        }
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
        try {
            this.incrementLoadingCount();
            await callback();
            this.notifyListeners();
        } finally {
            this.decrementLoadingCount();
        }
    }

    private getEntity = async <T>(
        key: keyof StoreState,
        fetchFunc: (id: string) => Promise<T>,
        entityId: string
    ): Promise<void> => {
        await this.handleRequest(async () => {
            const entity = await fetchFunc(entityId);
            (this._state[key] as T[]) = entity as unknown as T[];
        });
    }

    private getUniqueEntity = async <T>(
        key: keyof StoreState,
        fetchFunc: (id: string) => Promise<T>,
        entityId: string
    ): Promise<void> => {
        await this.handleRequest(async () => {
            const newEntity = await fetchFunc(entityId);
            (this._state[key] as T) = newEntity as T;
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

    private createUniqueEntity = async <T>(
        key: keyof StoreState,
        parentId: string,
        entity: T,
        createFunc: CreateFunction<T>
    ): Promise<void> => {
        await this.handleRequest(async () => {
            const newEntity = await createFunc(parentId, entity);
            (this._state[key] as T) = newEntity as T;
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

    private updateUniqueEntity = async <T>(
        key: keyof StoreState,
        entityId: string,
        updatedData: T,
        updateFunc: (id: string, updatedData: T) => Promise<T>
    ): Promise<void> => {
        await this.handleRequest(async () => {
            const updatedEntity = await updateFunc(entityId, updatedData);
            (this._state[key] as T) = updatedEntity as T;
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

    private deleteUniqueEntity = async (
        key: keyof StoreState,
        entityId: string,
        deleteFunc: (id: string) => Promise<void>
    ): Promise<void> => {
        await this.handleRequest(async () => {
            await deleteFunc(entityId);
            delete this._state[key];
        });
    }

    // User methods
    getCurrentUserId = (): string => this._state.currentUser?.id || '';

    getUser = async (username: string): Promise<void> => {
        try {
            await this.getUniqueEntity('currentUser', this.userService.getUser, username);
            sessionStorage.setItem('currentUser', JSON.stringify(this._state.currentUser));
            router.navigate('/');
        } catch {
            alert('Username not found. Please try again or create a user instead.');
        }
    }

    createUser = async (user: NewUser): Promise<void> => {
        try {
            await this.createUniqueEntity('currentUser', '', user, this.userService.createUser as unknown as CreateFunction<NewUser>);
            sessionStorage.setItem('currentUser', JSON.stringify(this._state.currentUser));
            router.navigate('/');
        } catch (error) {
            alert('Username already taken. Please choose another username.');
        }
    }

    updateUser = async (userId: string, user: NewUser): Promise<void> => {
        await this.updateUniqueEntity('currentUser', userId, user, this.userService.updateUser);
        sessionStorage.setItem('currentUser', JSON.stringify(this._state.currentUser));
    }

    deleteUser = async (userId: string): Promise<void> => {
        await this.deleteUniqueEntity('currentUser', userId, this.userService.deleteUser);
        this._state.currentUser = null;
        sessionStorage.removeItem('currentUser');
    }

    // Expense methods
    getCurrentExpenseId = (): string => {
        return this._state.currentExpense?.id || '';
    }

    getExpenses = async (): Promise<void> => {
        await this.getEntity('expenses', this.expenseService.getExpenses, this.getCurrentBudgetId());
    }

    getExpense = async (expenseId: string): Promise<void> => {
        await this.getUniqueEntity('currentExpense', this.expenseService.getExpense, expenseId);
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
        await this.getEntity('budgets', this.budgetService.getBudgets, this.getCurrentUserId());
    }

    getBudget = async (budgetId: string): Promise<void> => {
        await this.getUniqueEntity('currentBudget', this.budgetService.getBudget, budgetId);
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
