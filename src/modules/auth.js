export const auth = () => {
  const buttonAuth = document.querySelector('.button-auth');
  const buttonOut = document.querySelector('.button-out');
  const buttonCart = document.querySelector('.button-cart');
  const modalAuth = document.querySelector('.modal-auth');
  const userName = document.querySelector('.user-name');
  const logInForm = document.getElementById('logInForm');

  const openModalAuth = () => modalAuth.classList.add('open');

  const closeModalAuth = (e) => {
    if (e.target === modalAuth || e.target.classList.contains('close-auth') || e.type === 'submit') {
      modalAuth.classList.remove('open');
    }
  };

  const userLogIn = (login) => {
    buttonAuth.style.display = 'none';
    buttonOut.style.display = 'flex';
    buttonCart.style.display = 'flex';
    userName.style.display = 'block';
    userName.textContent = login;
  };

  const userLogOut = () => {
    buttonAuth.style.display = 'flex';
    buttonOut.style.display = '';
    buttonCart.style.display = '';
    userName.style.display = '';
    userName.textContent = '';

    localStorage.clear();
    if (window.location.href.slice(-10) !== 'index.html') window.location = 'index.html';
  };

  if (localStorage.getItem('user')) {
    userLogIn(JSON.parse(localStorage.getItem('user')).login);
  }

  buttonAuth.addEventListener('click', openModalAuth);
  modalAuth.addEventListener('click', closeModalAuth);
  buttonOut.addEventListener('click', userLogOut);

  logInForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const login = logInForm.querySelector('#login').value;
    const password = logInForm.querySelector('#password').value;

    localStorage.setItem('user', JSON.stringify({ login, password }));

    closeModalAuth(e);
    userLogIn(login);
  });
};
