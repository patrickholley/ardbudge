type BudgetDatumProps = 'date' | 'description' | 'cost';

export type BudgetDatum = Record<BudgetDatumProps, string>;

export type BudgetData = {
    id: string;
    name: string;
    rows: BudgetDatum[];
}

export type StoreState = {
    Budgets: BudgetData[];
    LoadingCount: number;
};

export type StoreListener = (state?: StoreState) => void;
