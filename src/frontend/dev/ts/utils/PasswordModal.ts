class PasswordModal {
    public modalElement: HTMLDialogElement;
    private closeBtn: HTMLButtonElement;
    private togglePassBtn: HTMLButtonElement;
    private passInput: HTMLInputElement;
    private form: HTMLFormElement;

    constructor(modalElement: HTMLDialogElement) {
        this.modalElement = modalElement;

        // Pegando elementos internos
        this.closeBtn = this.modalElement.querySelector('.password-modal__close-modal-btn') as HTMLButtonElement;
        this.togglePassBtn = this.modalElement.querySelector('.form-field__toggle-pass-view') as HTMLButtonElement;
        this.passInput = this.modalElement.querySelector('.pass-container__pass-input') as HTMLInputElement;
        this.form = this.modalElement.querySelector('#new-pass-form') as HTMLFormElement;

        this.setup();
    }

    public open() {
        this.modalElement.showModal();
    }

    public close() {
        this.clear();
        this.modalElement.close();
    }

    public setup() {
        // Botão fechar
        this.closeBtn.addEventListener('click', () => this.close());

        // Toggle visualizar senha
        this.togglePassBtn.addEventListener('click', (e) => {
            e.preventDefault(); // evitar submit do form
            if (this.passInput.type === 'password') {
                this.passInput.type = 'text';
                this.togglePassBtn.querySelector('i')?.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                this.passInput.type = 'password';
                this.togglePassBtn.querySelector('i')?.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });

        // Submissão do form (exemplo: só prevenir)
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Aqui você pode coletar os dados e fazer algo
            console.log('Form submetido!');
            // Fecha o modal após submissão (opcional)
            this.close();
        });
    }

    public clear() {
        // Limpar inputs do form
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'file') {
                (input as HTMLInputElement).value = '';
            } else {
                input.value = '';
            }
        });

        // Resetar tipo de input de senha para 'password' (caso tenha ficado visível)
        this.passInput.type = 'password';

        // Resetar ícone do olho para "mostrar"
        const icon = this.togglePassBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

export default PasswordModal;
