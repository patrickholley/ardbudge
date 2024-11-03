type ArdBudgeDatumProps = 'date' | 'description' | 'cost';

export type ArdBudgeDatum = Record<ArdBudgeDatumProps, string>;

export type ArdBudgeData = {
    name: string;
    rows: ArdBudgeDatum[];
}

export type ArdState = Record<string, ArdBudgeData>;
export type ArdListener = (state?: ArdState) => void;
