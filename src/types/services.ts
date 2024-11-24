interface Identifiable<T> {
    id: string;
    data: T;
}

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

export type User = Identifiable<NewUser>;
export type Expense = Identifiable<NewExpense>;
export type Budget = Identifiable<NewBudget>;

export interface UserBudgetAssociation {
    userid: number;
    budgetid: number;
}
