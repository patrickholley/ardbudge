type ArdBudgeDatumProps = 'date' | 'description' | 'cost';

export type ArdBudgeDatum = Record<ArdBudgeDatumProps, string>;

export type ArdBudgeData = {
    name: string;
    rows: ArdBudgeDatum[];
}

export type ArdBudges = Record<string, ArdBudgeData>;

export type ArdState = {
    Budges: ArdBudges;
    LoadingCount: number;
};

export type ArdListener = (state?: ArdState) => void;
