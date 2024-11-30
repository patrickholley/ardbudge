import {CreateFunction, EntityWithId, StoreListener, StoreState} from '@app-types/store';
import {BudgetService, ExpenseService, UserService} from './services';
import {Budget, Expense, NewBudget, NewExpense, User, UserCredentials} from "@app-types/services.ts";
import router from "@components/router";
import LoginService from "./services/login";

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
    private loginService: LoginService;

    private _listeners: StoreListener[] = [];

    constructor() {
        this.userService = new UserService();
        this.expenseService = new ExpenseService();
        this.budgetService = new BudgetService();
        this.loginService = new LoginService();

    this.initializeUserFromCookie();
        this.notifyListeners();
    }

    private initializeUserFromCookie(): void {
        const userData = this.getCookie('currentUser');
        if (userData) {
            this._state.currentUser = JSON.parse(userData);
        }
    }

    private getCookie(name: string): string | null {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()!.split(';').shift() || null;
        return null;
    }

    private setCookie(name: string, value: string): void {
        document.cookie = `${name}=${value}; path=/; SameSite=None; Secure`;
    }

    private deleteCookie(name: string): void {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    getState = (): StoreState => this._state;

    // General methods
    getLoadingCount = (): number => this._state.loadingCount;

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
    getCurrentUser = (): User | null => this._state.currentUser;

    createUser = async (user: UserCredentials): Promise<void> => {
        try {
            await this.createUniqueEntity('currentUser', '', user, this.userService.createUser);
            this.setCookie('currentUser', JSON.stringify(this._state.currentUser));
            router.navigate('/');
        } catch (error) {
            alert('The username you entered is already in use. Please try again.');
        }
    }

    updateUser = async (userId: string, user: User): Promise<void> => {
        await this.updateUniqueEntity('currentUser', userId, user, this.userService.updateUser);
        sessionStorage.setItem('currentUser', JSON.stringify(this._state.currentUser));
    }

    deleteUser = async (userId: string): Promise<void> => {
        await this.deleteUniqueEntity('currentUser', userId, this.userService.deleteUser);
        this.logOut();
    }

    login = async (name: string, password: string): Promise<void> => {
        try {
            const response = await this.loginService.login(name, password);
            this.setCookie('currentUser', JSON.stringify(response));
            this._state.currentUser = response;
            router.navigate('/');
            this.notifyListeners();
        } catch (error) {
            alert('The username or password you entered is incorrect. Please try again.');
        }
    }

    logOut = () => {
        this._state.currentUser = null;
        this.deleteCookie('currentUser');
        router.navigate('/');
    }

    // Expense methods
    getCurrentExpense = (): Expense | null => {
        return this._state.currentExpense;
    }

    getExpenses = async (): Promise<void> => {
        await this.getEntity('expenses', this.expenseService.getExpenses, this.getCurrentBudget()?.id || '');
    }

    getExpense = async (expenseId: string): Promise<void> => {
        await this.getUniqueEntity('currentExpense', this.expenseService.getExpense, expenseId);
    }

    createExpense = async (expense: NewExpense): Promise<void> => {
        await this.createEntity('expenses', this.getCurrentBudget()?.id || '', expense, this.expenseService.createExpense);
    }

    updateExpense = async (expenseId: string, expense: Expense): Promise<void> => {
        await this.updateEntity('expenses', expenseId, expense, this.expenseService.updateExpense);
    }

    deleteExpense = async (expenseId: string): Promise<void> => {
        await this.deleteEntity('expenses', expenseId, this.expenseService.deleteExpense);
    }

    // Budget methods
    getCurrentBudget = (): Budget | null => this._state.currentBudget;

    getBudgets = async (): Promise<void> => {
        await this.getEntity('budgets', this.budgetService.getBudgets, this.getCurrentUser()?.id || '');
    }

    getBudget = async (budgetId: string): Promise<void> => {
        await this.getUniqueEntity('currentBudget', this.budgetService.getBudget, budgetId);
    }

    createBudget = async (budget: NewBudget): Promise<void> => {
        await this.createEntity('budgets', '', budget, this.budgetService.createBudget);
    }

    updateBudget = async (budgetId: string, budget: Budget): Promise<void> => {
        await this.updateEntity('budgets', budgetId, budget, this.budgetService.updateBudget);
    }

    deleteBudget = async (budgetId: string): Promise<void> => {
        await this.deleteEntity('budgets', budgetId, this.budgetService.deleteBudget);
    }
}

export const store = new Store();
