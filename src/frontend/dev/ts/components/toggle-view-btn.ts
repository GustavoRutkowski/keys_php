import HTMLParser from "../utils/html-parser";

// <toggle-view-button for="id-of-element">
class ToggleViewButton extends HTMLElement {
    private static visibleFAIcon = 'fa-eye-slash';
    private static invisibleFAIcon = 'fa-eye';

    public static observedAttributes: string[] = ['for'];

    private isVisible: boolean;
    private target: HTMLInputElement | null;
    private toggleCallbackFn: () => any;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.isVisible = false;
        this.target = this.syncTarget;
        this.toggleCallbackFn = this.toggleVisibility;
    }

    // Inherited Methods:

    public connectedCallback(): void {
        this.initAttributes();

        this.shadowRoot?.appendChild(this.css);
        this.shadowRoot?.appendChild(this.html);

        this.addEventListener('click', this.toggleCallbackFn);
    }

    public disconnectedCallback() : void{
        this.removeEventListener('click', this.toggleCallbackFn);
    }

    public attributeChangedCallback(name: string): void {
        if (name !== 'for') return;
        this.target = this.syncTarget;
    }

    // Building:

    private initAttributes(): void {
        this.role = 'button';
        this.setAttribute('role', 'button');

        this.title = 'Visualizar Senha';
        this.setAttribute('title', 'Visualizar Senha');
    }

    private get html(): HTMLElement {
        const faIcon = this.isVisible
            ? ToggleViewButton.visibleFAIcon
            : ToggleViewButton.invisibleFAIcon;

        return HTMLParser.parse(`<i class="fa-solid ${faIcon}"></i>`) as HTMLElement;
    }

    private get css(): HTMLStyleElement {
        const cssRaw = `
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css');

            :host {
                min-width: fit-content;
                min-height: fit-content;
                color: rgba(255, 255, 255, .4);
                cursor: pointer;
                transition-duration: .3s;
            }
            :host i {
                display: inline-block;
                min-width: 20px;
                min-height: 20px;
                color: rgba(255, 255, 255, .4);
            }
            :host:hover { color: white }
        `;

        return HTMLParser.parse(`<style>${cssRaw}</style>`) as HTMLStyleElement;
    }

    // Methods:
    
    public get visibility(): boolean {
        return this.isVisible;
    }

    private get syncTarget(): HTMLInputElement | null {
        const targetSelector: string = this.getAttribute('for') || '';
        const target: HTMLInputElement | null = document.getElementById(targetSelector) as HTMLInputElement;

        return (target instanceof HTMLInputElement) ? target : null;
    }

    private toggleVisibility(): void {
        this.isVisible = !this.isVisible;
        this.renderVisibilityInfos();
    }

    private renderVisibilityInfos(): void {
        const targetElement: HTMLInputElement = this.target as HTMLInputElement;
        targetElement.type = this.isVisible ? 'text' : 'password';

        const buttonFaIcon = this.isVisible
            ? ToggleViewButton.visibleFAIcon
            : ToggleViewButton.invisibleFAIcon;

        const buttonIconElement: HTMLElement | null = this.shadowRoot?.querySelector('i') || null;
        buttonIconElement?.setAttribute('class', `fa-solid ${buttonFaIcon}`);
    }
}

customElements.define('toggle-view-button', ToggleViewButton);
export default ToggleViewButton;
