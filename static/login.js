const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
// comentários por Leandro
// funcionalidade para alternar entre as telas de login e registro
registerBtn.addEventListener('click', () => { // adiciona evento de click no botão de registro
    container.classList.add('active'); // adiciona classe active no container
})

loginBtn.addEventListener('click', () => { // adiciona evento de click no botão de login
    container.classList.remove('active'); // remove classe active do container
})