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

    // Fields:
    const email = formData.get('email') as string || '';
    const main_pass = formData.get('main_pass') as string || '';
    const repeat_main_pass = formData.get('repeat_main_pass') as string || '';
    
    const credentials: IUserCredentials = { email, main_pass, repeat_main_pass };
    const createdUser: THTTPPostResponse = await Users.createUser(credentials);
    const userCreated: boolean = 'insertId' in createdUser;

    const message: ITypedMessage = {
        type: userCreated ? 'sucess' : 'error',
        message: '',
    };

    // Translator.translate copy
    const translate = Translator.translate;

    // Set message translated from pt-BR
    message.message = userCreated
        ? 'Usuário criado com sucesso!'
        : await translate((createdUser as IPostException).message);

    submitMessage.showMessage(message);
    if (userCreated) location.href = '/login';
});
