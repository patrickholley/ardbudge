import { store } from "@store";
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
                    position: relative;
                    margin-top: 120px;
                    width: 80px;
                    height: 120px;
                    animation: heartBeat 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
                }
                
                .loader:before,
                .loader:after {
                    content: "";
                    background: var(--wheat);
                    width: 80px;
                    height: 120px;
                    border-radius: 100px 100px 0 0;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    transform: rotate(45deg);
                    transform-origin: 50% 68%;
                    box-shadow: 20px 16px 20px var(--dark-wheat) inset;
                }
                .loader:after {
                    transform: rotate(-45deg);
                }
                
                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--dark-sage-green);
                    display: flex;
                    justify-content: center;
                    z-index: 9999;
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
            <div class="overlay">
                <div class="loader"></div>
            </div>
        `;
    }
}

let removeLoaderDebounce: { (): void; cancel: () => void } | null = null;

export const updateLoaderVisibility = () => {
    const loadingCount = store.getLoadingCount();
    let loader = document.querySelector(componentTag) as HTMLElement | null;
    const appUI = document.getElementById('app') as HTMLElement | null;

    if (appUI) {
        if (loadingCount > 0) {
            if (removeLoaderDebounce) {
                removeLoaderDebounce.cancel();
                removeLoaderDebounce = null;
            }

            if (!loader) {
                loader = document.createElement(componentTag);
                document.body.appendChild(loader);
            }

            loader.style.display = 'block';
        } else {
            removeLoaderDebounce = debounce(() => {
                requestAnimationFrame(() => {
                    if (loader) {
                        loader.style.display = 'none';
                    }
                    removeLoaderDebounce = null;
                });
            }, 500);

            removeLoaderDebounce();
        }
    }
};

store.subscribe(updateLoaderVisibility);

customElements.define(componentTag, LoadingWidget);