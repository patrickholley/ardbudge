enum ExpenseProps {
    Date = 'date',
    Description = 'description',
    Cost = 'cost',
}

export type Expense = Record<ExpenseProps, string> & {
    id: string;
    budgetId: string;
};

export type BudgetProps = {
    id: string;
    name: string;
    rows: Expense[];
}

export type StoreState = {
    Budgets: BudgetProps[];
    LoadingCount: number;
};

export type StoreListener = (state?: StoreState) => void;
