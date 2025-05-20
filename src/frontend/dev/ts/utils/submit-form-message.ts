import ITypedMessage from "../interfaces/i-typed-message";

class SubmitFormMessage {
    private p: HTMLParagraphElement;

    constructor(form: HTMLFormElement) {
        console.log(form.querySelector('p.form-message'));
        this.p = form.querySelector('p.form-message') as HTMLParagraphElement;
    }

    showMessage({ message, type }: ITypedMessage, durationSeconds = 5) {
        this.p.textContent = message;
        this.p.classList.add(type);
        
        setTimeout(() => {
            this.p.textContent = '';
            this.p.classList.remove(type);
        }, durationSeconds * 1000);
    }
}

export default SubmitFormMessage;
