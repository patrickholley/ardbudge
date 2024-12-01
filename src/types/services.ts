interface Identifiable {
    id: string;
}

export type IdentifiableWithProps<T> = Identifiable & T;

export enum DaysOfWeek {
    Monday = 'mo',
    Tuesday = 'tu',
    Wednesday = 'we',
    Thursday = 'th',
    Friday = 'fr',
    Saturday = 'sa',
    Sunday = 'su'
}

export enum PeriodFrequency {
    Weekly = 'weekly',
    "Every two weeks" = 'twoweeks',
    "Twice per month" = 'twicemonth',
    Monthly = 'monthly'
}

export type BudgetSettings = {
    budgetStart: Date;
    periodAmount: number;
    periodFrequency: number;
    periodReverse: boolean;
    periodStart: number;
    periodStartB: number;
};

export interface NewBudget {
    name: string;
    settings: BudgetSettings;
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
