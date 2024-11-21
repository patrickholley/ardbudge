import BaseService from './base';
import {Budget} from "@app-types/services.ts";

class BudgetService extends BaseService {
    constructor() {
        super(`/budgets`);
    }

    public getBudgets = async (userId: string): Promise<Budget[]> =>
        this.get(`/`, { userid: userId });

    public getBudget = async (budgetId: string): Promise<Budget> =>
        this.get(`/${budgetId}`);

    public createBudget = async (userId: string, budgetData: Budget): Promise<Budget> =>
        this.post(`/`, budgetData, { userid: userId });

    public updateBudget = async (budgetId: string, budgetData: Budget): Promise<Budget> =>
        this.put(`/${budgetId}`, budgetData);

    public deleteBudget = async (budgetId: string): Promise<void> =>
        this.delete(`/${budgetId}`);
}

export default BudgetService;