const unloggedLinks = [
  { link: 'index.html', label: 'Início' },
  { link: 'faq.html', label: 'Suporte' },
  { link: 'login.html', label: 'Login' },
  { link: 'register.html', label: 'Cadastre-se' }
];

const loggedLinks = [
  { link: '', label: 'Início' },
  { link: 'dashboard.html', label: 'Meu Cofrinho' },
  { link: 'faq.html', label: 'Suporte' },
  { link: 'login.html', label: 'Login' },
  { link: 'register.html', label: 'Cadastre-se' }
];

interface ILink {
    link: string;
    label: string;
}

function setupHeader(token: string, linksList: HTMLElement): void {
    linksList.innerHTML = '';

    const createLinkCallback = (link: ILink) => {
        const li = document.createElement('li');
        li.classList.add('links-list__item');

        const url = link.link.split('.').length >= 2 ? link.link.split('.')[0] : '';

        li.innerHTML = `<a href="/${url}">${link.label}</a>`;
        linksList.appendChild(li);
    }
    
    if (!token) {
        unloggedLinks.forEach(createLinkCallback);
        return;
    }

    loggedLinks.forEach(createLinkCallback);
}

export default setupHeader;
