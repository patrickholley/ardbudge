interface Identifiable {
    id: string;
}

export type IdentifiableWithProps<T> = Identifiable & T;

export interface NewBudget {
    name: string;
    settings: Record<string, unknown>;
}

export interface NewExpense {
    budgetid: string;
    date: Date;
    description: string;
    amount: number;
}

export interface NewUser {
    name: string;
}

export type User = IdentifiableWithProps<NewUser>;
export type Expense = IdentifiableWithProps<NewExpense>;
export type Budget = IdentifiableWithProps<NewBudget>;

export interface UserBudgetAssociation {
    userid: number;
    budgetid: number;
}
