export type BudgetRow = {
    date: string;
    description: string;
    cost: number;
}

export type Budget = {
    name: string;
    rows: BudgetRow[];
}
