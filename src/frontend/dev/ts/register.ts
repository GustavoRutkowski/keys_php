import './components/toggle-view-btn';

// Utils

// register.js
const registerForm = document.querySelector('form#register-form') as HTMLFormElement;
const messageParagraph = registerForm.querySelector('p.form-message') as HTMLParagraphElement;

registerForm.addEventListener('submit', async e => {
    e.preventDefault();

    const form = new FormData(registerForm);

    const data = await fetch('http://localhost/backend/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: form.get('name'),
            email: form.get('email'),
            main_pass: form.get('main_pass')
        })
    });

    const userCreated = await data.json();

    if (userCreated.success) {
        location.href = '/login';
        return;
    }
    
    for (const key of form.keys()) form.delete(key);
    messageParagraph.textContent = userCreated.message;
});
