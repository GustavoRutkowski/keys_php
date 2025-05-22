import HTMLParser from '../utils/html-parser';

const stylesRaw = `
    :root { font-size: 62.5%; }

    * {
        margin: 0;
        padding: 0;
        outline: none;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
    }

    ul { list-style: none; }

    :host {
        padding: 2rem 0 !important;
        width: 100%;
        max-width: calc(100dvw / 6);
        font-size: 1.8rem;
        background-color: #343746;
        overflow: hidden;
    }

    ul.nav__links-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    li.links-list__item {
        padding: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;        
    }

    li.links-list__item:hover,
    li.links-list__item.links-list__item--active {
        background-color: rgba(0,0,0,.2);
    }

    li.links-list__item span {
        flex: 1 1 auto;
        min-width: 0;
        padding: 1rem 2rem;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }
`;

interface ILoaderMenuItem {
    id: string;
    label: string;
    path: string;
    action?: () => Promise<void> | void;
}

interface ILoaderMenuSetupOptions {
    target: string;
    default?: string;
    items: ILoaderMenuItem[];
}

class LoaderMenu extends HTMLElement {
    private static STORAGE_KEY = 'last-panel-selected';

    private setuped: boolean;
    private loadedRaws: Record<string, string | null>;
    private itemsPaths: Record<string, string>;
    private itemsActions: Record<string, (() => Promise<void> | void) | undefined>;

    public displayTarget: HTMLElement | null;
    public defaultItem: string | null;
    public items: ILoaderMenuItem[];
    public selectedItem: string | null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.setuped = false;
        this.loadedRaws = {};
        this.itemsPaths = {};
        this.itemsActions = {};
        this.displayTarget = null;
        this.defaultItem = null;
        this.items = [];
        this.selectedItem = null;
    }

    async connectedCallback(): Promise<void> {
        if (!this.setuped) {
            console.error('loader-menu is not setuped');
            throw new Error('loader-menu is not setuped');
        }

        this.setRole();

        if (!this.shadowRoot) return;
        this.shadowRoot.appendChild(this.styles());
        this.shadowRoot.appendChild(this.loaderMenu());

        const eventsTask = async () => this.addItemsEvents();
        const renderFirstItemTask = async () => {
            this.updateSelected();
            await this.loadHTML();
            await this.executeAction();
        };

        await Promise.all([
            eventsTask(),
            renderFirstItemTask()
        ]);
    }

    public setup({ target, default: defaultItem, items }: ILoaderMenuSetupOptions): void {
        this.setuped = true;

        this.displayTarget = document.querySelector<HTMLElement>(target);
        if (!this.displayTarget) {
            throw new Error(`Target element "${target}" not found`);
        }

        this.items = items;
        this.verifyRepeatedItems();

        this.defaultItem = defaultItem || this.items[0].id;
        this.verifyDefaultItem();

        this.selectedItem = sessionStorage.getItem(LoaderMenu.STORAGE_KEY) || this.defaultItem;

        this.loadedRaws = this.items.reduce<Record<string, string | null>>((raws, { id }) => {
            raws[id] = null;
            return raws;
        }, {});

        this.itemsPaths = this.items.reduce<Record<string, string>>((paths, { id, path }) => {
            paths[id] = path;
            return paths;
        }, {});

        this.itemsActions = this.items.reduce<Record<string, (() => Promise<void> | void) | undefined>>((actions, { id, action }) => {
            actions[id] = action;
            return actions;
        }, {});
    }

    private setRole(): void {
        this.role = 'navigation';
        this.setAttribute('role', 'navigation');
    }

    private addItemsEvents(): void {
        const items = this.shadowRoot?.querySelectorAll<HTMLElement>('.links-list__item');
        if (!items) return;

        items.forEach(itemEl => {
            const item = this.items.find(item => item.id === itemEl.id);
            if (!item) return;

            itemEl.addEventListener('click', async () => {
                this.selectedItem = item.id;
                this.updateSelected();
                await this.loadHTML();
                await this.executeAction();
            });
        });
    }

    private updateSelected(): void {
        if (this.selectedItem)
            sessionStorage.setItem(LoaderMenu.STORAGE_KEY, this.selectedItem);
        this.updateItemBackground();
    }

    private async loadHTML(item_id?: string): Promise<void> {
        const itemKey = item_id || this.selectedItem;
        if (!itemKey || !this.displayTarget) return;

        if (this.loadedRaws[itemKey]) {
            this.displayTarget.innerHTML = this.loadedRaws[itemKey]!;
            return;
        }

        const path = this.itemsPaths?.[itemKey];
        if (!path) return;

        try {
            const res = await fetch(path);
            const loadedHTMLRaw = await res.text();
            this.loadedRaws[itemKey] = loadedHTMLRaw;
            this.displayTarget.innerHTML = loadedHTMLRaw;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    private async executeAction(item_id?: string): Promise<void> {
        const itemKey: string | null = item_id || this.selectedItem;

        if (!itemKey) throw new Error('panel id not found');

        const action = this.itemsActions[itemKey];
        if (action) await action();
    }

    private verifyRepeatedItems(): void {
        const ids = new Set<string>();
        for (const { id } of this.items) {
            if (ids.has(id)) {
                console.error(`items cannot contain duplicate ids. Duplicated: ${id}`);
                throw new ReferenceError(`items cannot contain duplicate ids. Duplicated: ${id}`);
            }
            ids.add(id);
        }
    }

    private verifyDefaultItem(): void {
        const exists = this.items.some(({ id }) => id === this.defaultItem);
        if (!exists) {
            console.error(`${this.defaultItem} is not in items`);
            throw new ReferenceError(`${this.defaultItem} is not in items`);
        }
    }

    private updateItemBackground(item?: HTMLElement): void {
        const items = this.shadowRoot?.querySelectorAll<HTMLElement>('.links-list__item');
        const selectedEl = item || this.shadowRoot?.querySelector<HTMLElement>(`.links-list__item#${this.selectedItem}`);

        items?.forEach(el => el.classList.remove('links-list__item--active'));
        selectedEl?.classList.add('links-list__item--active');
    }

    private getItemRaw({ id, label }: ILoaderMenuItem): string {
        return `
            <li id="${id}" class="links-list__item">
                <span>${label}</span>
            </li>
        `;
    }

    private loaderMenu(): ChildNode {
        const itemsRaw = this.items.map(this.getItemRaw).join('');
        return HTMLParser.parse(`<ul class="nav__links-list">${itemsRaw}</ul>`);
    }

    private styles(): ChildNode {
        return HTMLParser.parse(`<style>${stylesRaw}</style>`);
    }
}

// customElements.define('loader-menu', LoaderMenu);
export default LoaderMenu;
