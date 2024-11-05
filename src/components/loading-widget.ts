import {store} from "@store";
import debounce from "@utils/debounce";

const componentTag = 'loading-widget';

class LoadingWidget extends HTMLElement {
    constructor() {
        super();
        this.componentTag = componentTag;
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                .loader {
                    margin-top: 40px;
                    position: relative;
                    width: 80px;
                    height: 120px;
                    animation: heartBeat 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
                }
                
                .loader:before,
                .loader:after {
                    content: "";
                    background: wheat;
                    width: 80px;
                    height: 120px;
                    border-radius: 100px 100px 0 0;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    transform: rotate(45deg);
                    transform-origin: 50% 68%;
                    box-shadow: 20px 16px 20px lavenderblush inset;
                }
                .loader:after {
                    transform: rotate(-45deg);
                }
                @keyframes heartBeat {
                    0% { transform: scale(0.95) }
                    5% { transform: scale(1.1) }
                    39% { transform: scale(0.85) }
                    45% { transform: scale(1) }
                    60% { transform: scale(0.95) }
                    100% { transform: scale(0.9) }
                }
            </style>
            <div class="loader"></div>
        `;
    }
}

let removeLoaderDebounce: { (): void; cancel: () => void } | null = null;

export const updateLoaderVisibility = () => {
    const loadingCount = store.getLoadingCount();
    const loader = document.querySelector(componentTag);
    const appUI = document.getElementById('app');

    if (appUI) {
        if (loadingCount > 0) {
            if (removeLoaderDebounce) {
                removeLoaderDebounce.cancel();
                removeLoaderDebounce = null;
            }

            if (!loader) {
                const newSpinner = document.createElement(componentTag);
                document.body.appendChild(newSpinner);
                appUI.style.visibility = 'hidden';
            }
        } else {
            removeLoaderDebounce = debounce(() => {
                const spinner = document.querySelector(componentTag);
                if (spinner) document.body.removeChild(spinner);
                appUI.style.visibility = 'visible';
                removeLoaderDebounce = null;
            }, 250);

            removeLoaderDebounce();
        }
    }
};

store.subscribe(updateLoaderVisibility);

customElements.define(componentTag, LoadingWidget);