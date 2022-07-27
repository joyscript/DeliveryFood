const buttonAuth = document.querySelector('.button-auth');
const buttonOut = document.querySelector('.button-out');
const userName = document.querySelector('.user-name');
const modalAuth = document.querySelector('.modal-auth');
const logInForm = document.getElementById('logInForm');
const login = logInForm.querySelector('#login');
const password = logInForm.querySelector('#password');

const openModalAuth = () => {
  modalAuth.style.display = 'flex';
  document.addEventListener('click', closeModalAuth);
};

const closeModalAuth = (e) => {
  if (e.target === modalAuth || e.target.classList.contains('close-auth') || e.type === 'submit') {
    modalAuth.style.display = '';
    document.removeEventListener('click', closeModalAuth);
  }
};

const userLogIn = (name) => {
  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'flex';
  userName.style.display = 'block';
  userName.textContent = name;
};

const userLogOut = () => {
  buttonAuth.style.display = 'flex';
  buttonOut.style.display = 'none';
  userName.style.display = 'none';
  userName.textContent = '';
  localStorage.removeItem('user');
};

if (localStorage.getItem('user')) {
  userLogIn(JSON.parse(localStorage.getItem('user')).login);
}

buttonAuth.addEventListener('click', openModalAuth);
buttonOut.addEventListener('click', userLogOut);

logInForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (login.value && password.value) {
    const user = { login: login.value, password: password.value };
    localStorage.setItem('user', JSON.stringify(user));
    closeModalAuth(e);
    userLogIn(login.value);
  }
});
