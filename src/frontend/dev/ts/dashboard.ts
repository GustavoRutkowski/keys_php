import LoaderMenu from "./components/LoaderMenu";

customElements.define('loader-menu', LoaderMenu);

const loaderMenu = document.createElement('loader-menu') as LoaderMenu;

console.log(loaderMenu);

loaderMenu.setup({
    target: 'section#panel-selected',
    default: 'passwords',
    
    items: [
        {
            id: 'passwords', label: 'Senhas',
            path: '../../public/panels/_passwords.html', action: () => console.log('a')
        },
        {
            id: 'cards', label: 'Cartões',
            path: '../../public/panels/_cards.html', action: () => console.log('b')
        },
        {
            id: 'documents', label: 'Documentos Digitalizados',
            path: '../../public/panels/_documents.html', action: () => console.log('c')
        }
    ]
});

const main = document.querySelector('main') as HTMLElement;
const panelSelected = document.querySelector('section#panel-selected');

main.insertBefore(loaderMenu, panelSelected);

console.log('Hello Dashboard')