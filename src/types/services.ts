export interface Budget {
    id: string;
    name: string;
    settings: Record<string, unknown>;
}

export interface Expense {
    id: string;
    budgetid: string;
    date: Date;
    description: string;
    amount: number;
}

export interface User {
    id: string;
    name: string;
}

export interface UserBudgetAssociation {
    userid: number;
    budgetid: number;
}
