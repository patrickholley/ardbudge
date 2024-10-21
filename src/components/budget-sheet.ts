import BudgetSheetTemplate from "@templates/budget-sheet.html?raw";
import getStyleElement from '@utils/getStyleElement';
import BudgetSheetStyles from "@styles/budget-sheet.css?inline"
import {Budget} from "@app-types/budget";
import "./table-head";

class BudgetSheet extends HTMLElement {
    private budget: Budget = { name: "My Budget", rows: [] };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // Method to add a new row
    public addRow(date: string, description: string, cost: number): void {
        this.budget.rows.push({ date, description, cost });
        this.renderRows();
    }

    // Method to delete a row by index
    public deleteRow(index: number): void {
        if (index >= 0 && index < this.budget.rows.length) {
            this.budget.rows.splice(index, 1);
            this.renderRows();
        } else {
            console.error("Invalid index");
        }
    }

    private renderRows(): void {
    }

    async connectedCallback(): Promise<void> {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = BudgetSheetTemplate;
            this.shadowRoot.appendChild(getStyleElement(BudgetSheetStyles));
            //this.shadowRoot.getElementById('budget-name')!.textContent = this.budget.name;
        }
    }

    disconnectedCallback(): void {
    }
}

customElements.define('ard-budge', BudgetSheet);

export default BudgetSheet;
