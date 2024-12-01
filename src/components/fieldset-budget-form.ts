import {DaysOfWeek, PeriodFrequency} from "@app-types/services";
import FieldsetModule from "@components/fieldset-module";

class BudgetForm extends FieldsetModule {
    shadowRoot: ShadowRoot;

    constructor(shadowRoot: ShadowRoot) {
        super(shadowRoot);

        this.shadowRoot = shadowRoot;
    }

    periodFrequencySelect: HTMLSelectElement | null = null;
    weekdaySelect: HTMLSelectElement | null = null;
    fieldsetLabels: HTMLLabelElement[] = [];

    updateFrequencyOptions = () => {
        const periodFrequency = (this.shadowRoot.getElementById('period-frequency') as HTMLSelectElement).value;
        const periodFrequencyTooltip = (this.shadowRoot.getElementById('period-frequency-tooltip') as HTMLSpanElement);

        periodFrequencyTooltip.style.display = 'none';

        let elementsToShow;

        if ([PeriodFrequency.Monthly, PeriodFrequency["Twice per month"]].includes(periodFrequency as PeriodFrequency)) {
            elementsToShow = ["period-start-monthday-label", "period-reverse-label"];
            if (periodFrequency === PeriodFrequency["Twice per month"]) periodFrequencyTooltip.style.display = 'inline-block';
        } else {
            elementsToShow = ["period-start-weekday-label"];
        }

        this.fieldsetLabels.forEach(label => {
            label.style.display = elementsToShow.includes(label.id) ? 'block' : 'none';
        });
    }

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
        this.weekdaySelect = this.shadowRoot.getElementById('period-start-weekday') as HTMLSelectElement;

        Object.entries(DaysOfWeek).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = value as string;
            option.innerText = key;
            this.weekdaySelect!.appendChild(option);
        });
    }

    setFieldsetElements = () => {
        this.periodFrequencySelect = this.shadowRoot.getElementById('period-frequency') as HTMLSelectElement;
        this.fieldsetLabels = Array.from(this.shadowRoot.querySelectorAll('#period-settings-conditional label'));
    }

    prepareForm = () => {
        this.setFieldsetElements();
        this.addFrequencyOptions();
        this.addStartWeekdayOptions();
        this.updateFrequencyOptions();
    }
}

export default BudgetForm;
