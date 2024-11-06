type ArdBudgeDatumProps = 'date' | 'description' | 'cost';

export type ArdBudgeDatum = Record<ArdBudgeDatumProps, string>;

export type ArdBudgeData = {
    id: string;
    name: string;
    rows: ArdBudgeDatum[];
}

export type ArdState = {
    Budges: ArdBudgeData[];
    LoadingCount: number;
};

export type ArdListener = (state?: ArdState) => void;
