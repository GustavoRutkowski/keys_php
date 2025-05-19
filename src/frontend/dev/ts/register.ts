// Interfaces and Types
import IUserCredentials from './interfaces/i-user_credentials';
import { IPostException } from './interfaces/i-post';
import ITypedMessage from './interfaces/i-typed-message';
import THTTPPostResponse from './types/t-http-post-response';

// Models and Components
import Users from './models/users';
import './components/toggle-view-btn';

// Utils
import Translator from './utils/translator';
import SubmitFormMessage from './utils/submit-form-message';

// register.js
const registerForm = document.querySelector('form#register-form') as HTMLFormElement;
const submitMessage = new SubmitFormMessage(registerForm);

registerForm.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(registerForm);

    const {
        email = '',
        main_pass = '',
        repeat_main_pass = ''        
    } = Object.fromEntries(formData.entries()) as Record<string, string>;
    
    if (!email || !main_pass || !repeat_main_pass) {
        submitMessage.showMessage({
            type: 'error',
            message: 'Todos os campos são obrigatórios.',
        });

        return;
    }

    const credentials: IUserCredentials = { email, main_pass, repeat_main_pass };
    const createdUser: THTTPPostResponse = await Users.createUser(credentials);
    const userCreated: boolean = 'insertId' in createdUser;

    const typedMessage: ITypedMessage = {
        type: userCreated ? 'success' : 'error',
        message: '',
    };
    
    const errorMessage = (createdUser as IPostException)?.message ?? 'Não foi possível criar o usuário.';
    
    try {
        // Set message translated from pt-BR
        typedMessage.message = userCreated
            ? 'Usuário criado com sucesso!'
            : await Translator.translate(errorMessage);
    } catch (e) {
        typedMessage.message = userCreated
            ? 'Usuário criado com sucesso!'
            : errorMessage;
    }

    submitMessage.showMessage(typedMessage);
    if (userCreated) location.href = '/login';
});
