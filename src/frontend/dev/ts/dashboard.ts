import LoaderMenu from "./components/LoaderMenu";
import LocalData from "./utils/LocalData";
import setupHeader from "./utils/setupHeader";

setupHeader(
    LocalData.get('token') as string,
    document.querySelector('ul.header-navigator__links-list') as HTMLElement
);

customElements.define('loader-menu', LoaderMenu);

const loaderMenu = document.createElement('loader-menu') as LoaderMenu;

loaderMenu.setup({
    target: 'section#panel-selected',
    default: 'passwords',
    
    items: [
        {
            id: 'passwords', label: 'Senhas',
            path: '../../public/panels/app/_passwords.html', action: () => console.log('a')
        },
        {
            id: 'cards', label: 'Cartões',
            path: '../../public/panels/app/_cards.html', action: () => console.log('b')
        },
        {
            id: 'documents', label: 'Documentos Digitalizados',
            path: '../../public/panels/app/_documents.html', action: () => console.log('c')
        }
    ]
});

const main = document.querySelector('main') as HTMLElement;
const panelSelected = document.querySelector('section#panel-selected');

main.insertBefore(loaderMenu, panelSelected);
