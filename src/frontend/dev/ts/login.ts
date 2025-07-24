import './components/toggle-view-btn';
import LocalData from './utils/LocalData';


// login.js
const loginForm = document.querySelector('form#login-form') as HTMLFormElement;
const messageParagraph = loginForm.querySelector('p.form-message') as HTMLParagraphElement;

loginForm.addEventListener('submit', async e => {
    e.preventDefault();

    const form = new FormData(loginForm);

    const data = await fetch('http://localhost/backend/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: form.get('email'),
            main_pass: form.get('main_pass')
        })
    });

    const userCreated = await data.json();

    if (userCreated.success) {
        LocalData.set('token', userCreated.data.token as String);

        location.href = '/dashboard';
        return;
    }
    
    for (const key of form.keys()) form.delete(key);
    messageParagraph.textContent = userCreated.message;
});
