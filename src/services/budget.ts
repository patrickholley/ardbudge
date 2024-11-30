import BaseService from './base';
import {Budget, NewBudget} from "@app-types/services.ts";

class BudgetService extends BaseService {
    constructor() {
        super(`/budgets`);
    }

    public getBudgets = async (): Promise<Budget[]> =>
        this.get(`/`);

    public getBudget = async (budgetId: string): Promise<Budget> =>
        this.get(`/${budgetId}`);

    public createBudget = async (_userId: string, budgetData: NewBudget): Promise<Budget> =>
        this.post(`/`, budgetData);

    public updateBudget = async (budgetId: string, budgetData: Budget): Promise<Budget> =>
        this.put(`/${budgetId}`, budgetData);

    public deleteBudget = async (budgetId: string): Promise<void> =>
        this.delete(`/${budgetId}`);
}

export default BudgetService;