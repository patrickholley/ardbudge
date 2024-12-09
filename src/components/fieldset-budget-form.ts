import {DaysOfWeek, PeriodFrequency} from "@app-types/services";
import FieldsetModule from "@components/fieldset-module";

class BudgetForm extends FieldsetModule {
    constructor(shadowRoot: ShadowRoot) {
        super(shadowRoot);
    }

    periodFrequencySelect: HTMLSelectElement | null = null;
    weekdaySelect: HTMLSelectElement | null = null;
    fieldsetLabels: HTMLLabelElement[] = [];

    addFrequencyOptions = () => {
        this.periodFrequencySelect = this.shadowRoot.getElementById('period-frequency') as HTMLSelectElement;
        this.periodFrequencySelect.addEventListener('change', this.updateFrequencyOptions);

        Object.entries(PeriodFrequency).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = value as string;
            option.innerText = key;
            this.periodFrequencySelect!.appendChild(option);
        });
    }

    addStartWeekdayOptions = () => {
        this.weekdaySelect = this.shadowRoot.getElementById('period-reset-weekday') as HTMLSelectElement;

        Object.entries(DaysOfWeek).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = value as string;
            option.innerText = key;
            this.weekdaySelect!.appendChild(option);
        });
    }

    onChange = (e: Event) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;

        switch (name) {
            case 'name':
                break;
            case 'budgetStart':
                break;
            case 'periodAmount':
                break;
            case 'periodFrequency':
                break;
            case 'periodResetWeekday':
                break;
            case 'periodResetMonthday':
                break;
            case 'periodReverse':
                break;
            default:
                console.error('Unknown field');
        }
    }

    prepareDateInput = () => {
        const dateInput = this.shadowRoot.getElementById('budget-start') as HTMLInputElement;

        ["keydown", "keypress", "paste", "input"].forEach(event => {
            dateInput.addEventListener(event, function(event) {
                event.preventDefault();
            })
        })

        dateInput.addEventListener("click", function() {
            dateInput.showPicker();
        });

        const today = new Date();
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        const localToday = today.toISOString().split('T')[0];
        dateInput.setAttribute('max', localToday);
        dateInput.setAttribute('value', localToday);
    }

    prepareForm = () => {
        this.setFieldsetElements();
        this.prepareDateInput();
        this.addFrequencyOptions();
        this.addStartWeekdayOptions();
        this.updateFrequencyOptions();
    }

    setFieldsetElements = () => {
        this.periodFrequencySelect = this.shadowRoot.getElementById('period-frequency') as HTMLSelectElement;
        this.fieldsetLabels = Array.from(this.shadowRoot.querySelectorAll('#period-settings-conditional label'));
    }

    updateFrequencyOptions = () => {
        const periodFrequency = (this.shadowRoot.getElementById('period-frequency') as HTMLSelectElement).value;
        const periodFrequencyTooltip = (this.shadowRoot.getElementById('period-frequency-tooltip') as HTMLSpanElement);

        periodFrequencyTooltip.style.display = 'none';

        let elementsToShow;

        if ([PeriodFrequency.Monthly, PeriodFrequency["Twice per month"]].includes(periodFrequency as PeriodFrequency)) {
            elementsToShow = ["period-reset-monthday-label", "period-reverse-label"];
            if (periodFrequency === PeriodFrequency["Twice per month"]) periodFrequencyTooltip.style.display = 'inline-block';
        } else {
            elementsToShow = ["period-reset-weekday-label"];
        }

        this.fieldsetLabels.forEach(label => {
            label.style.display = elementsToShow.includes(label.id) ? 'block' : 'none';
        });
    }
}

export default BudgetForm;
