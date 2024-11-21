import BaseService from './base';
import {UserBudgetAssociation} from "@app-types/services";

class UserBudgetService extends BaseService {
    constructor() {
        super('/user_budgets');
    }

    public addAssociation = async (association: UserBudgetAssociation): Promise<string> =>
        this.post('/', association);

    public removeAssociation = async (association: UserBudgetAssociation): Promise<string> =>
        this.delete(`?userid=${association.userid}&budgetid=${association.budgetid}`);
}

export default UserBudgetService;
