import {Budget, Expense, User} from "./services.ts";

export type StoreState = {
    budgets: Budget[],
    expenses: Expense[],
    currentBudget: Budget | null,
    currentExpense: Expense | null,
    currentUser: User | null,
    loadingCount: number
};

export type StoreListener = (state?: StoreState) => void;

export interface EntityWithId {
    id: string;
}

export type CreateFunction<T> = (parentId: string, entity: T) => Promise<T>;

export type FetchFunction<T> = (id: string, additionalParams?: unknown) => Promise<T>;
