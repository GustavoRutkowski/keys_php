import Passwords from "../models/Passwords";

interface ISoftware {
    id: number,
    name: string,
    icon: string
}

const passwordsList = document.querySelector('ul.passwords__passwords-list') as HTMLUListElement;

async function renderPasswords() {
    const passwords = await Passwords.getUserPasswords();

    passwordsList.innerHTML = '';

    passwords.forEach(async (password: any) => {
        const data = await fetch(`http://localhost/backend/softwares/id/${password.software_id}`);
        const passwordSoftware = await data.json() as ISoftware;

        const passwordLi: HTMLLIElement = document.createElement('li');
        passwordLi.classList.add('passwords-list__password');

        passwordLi.innerHTML = `
            <section class="password__label">
                <section class="label__title">
                    <div class="title__icon">
                        <img src="${passwordSoftware.icon}" alt="${passwordSoftware.name}">
                    </div>

                    <span class="title__title">${passwordSoftware.name}</span>

                    <button class="title__rename-title" title="Renomear Software">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="title__delete-password" title="Deletar Senha">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </section>
            </section>

            <div class="password__pass-container">
                <input type="password" value="${password.value}" class="pass-container__pass-input" readonly>

                <div class="pass-container__action-btns">
                    <button class="action-btns__toogle-pass-view-btn" title="Visualizar Senha">
                        <i class="fa-solid fa-eye"></i>
                        <!-- <i class="fa-solid fa-eye-slash"></i> -->
                    </button>

                    <button class="action-btns__rename-title" title="Alterar Senha">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </div>
            </div>
        `;

        passwordsList.appendChild(passwordLi);
    });
}

function passwordsAction() {
    renderPasswords();
}

export default passwordsAction;
