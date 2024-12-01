import BaseService from './base';
import {Expense, NewExpense} from "@app-types/services.ts";

class ExpenseService extends BaseService {
    constructor() {
        super(`/expenses`);
    }

    public getExpensesTotal = async (budgetid: string): Promise<Expense[]> =>
        this.get(`/total`, { budgetid });

    public getExpenses = async (budgetid: string, [start_date, end_date]: [string, string | null] ): Promise<Expense[]> =>
        this.get(`/`, { budgetid, start_date, ...end_date && { end_date} });

    public getExpense = async (expenseId: string): Promise<Expense> =>
        this.get(`/${expenseId}`);

    public createExpense = async (budgetid: string, expenseData: NewExpense): Promise<Expense> =>
        this.post(`/`, expenseData, { budgetid: budgetid });

    public updateExpense = async (expenseId: string, expenseData: Expense): Promise<Expense> =>
        this.put(`/${expenseId}`, expenseData);

    public deleteExpense = async (expenseId: string): Promise<void> =>
        this.delete(`/${expenseId}`);
}

export default ExpenseService;
