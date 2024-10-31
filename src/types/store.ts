export type ArdBudgeDatum = {
    date: string;
    description: string;
    cost: number;
}

export type ArdBudgeData = {
    name: string;
    rows: ArdBudgeDatum[];
}

export type ArdState = Record<string, ArdBudgeData>;
export type ArdListener = (state: ArdState) => void;
