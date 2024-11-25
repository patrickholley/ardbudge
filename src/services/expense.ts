import BaseService from './base';
import {Expense, NewExpense} from "@app-types/services.ts";

class ExpenseService extends BaseService {
    constructor() {
        super(`/expenses`);
    }

    public getExpensesTotal = async (budgetId: string): Promise<Expense[]> =>
        this.get(`/total`, { budgetid: budgetId });

    public getExpenses = async (budgetId: string): Promise<Expense[]> =>
        this.get(`/`, { budgetid: budgetId });

    public getExpense = async (expenseId: string): Promise<Expense> =>
        this.get(`/${expenseId}`);

    public createExpense = async (budgetId: string, expenseData: NewExpense): Promise<Expense> =>
        this.post(`/`, expenseData, { budgetid: budgetId });

    public updateExpense = async (expenseId: string, expenseData: Expense): Promise<Expense> =>
        this.put(`/${expenseId}`, expenseData);

    public deleteExpense = async (expenseId: string): Promise<void> =>
        this.delete(`/${expenseId}`);
}

export default ExpenseService;
