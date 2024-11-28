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

export interface UserCredentials {
    name: string;
    password: string;
}

export type User = Identifiable & {
    name: string;
    token: string;
};
export type Expense = IdentifiableWithProps<NewExpense>;
export type Budget = IdentifiableWithProps<NewBudget>;

export interface UserBudgetAssociation {
    userid: number;
    budgetid: number;
}
