import { products } from './menu';

export const cart = () => {
  const cardsContainer = document.querySelector('.cards-menu');
  const inputAddress = document.querySelector('.input-address');
  const buttonCart = document.querySelector('.button-cart');
  const modalCart = document.querySelector('.modal-cart');
  const modalInfo = document.querySelector('.modal-info');
  const infoForm = document.querySelector('#infoForm');

  const modalBody = modalCart.querySelector('.modal-body');
  const modalSum = modalCart.querySelector('.modal-pricetag');
  const orderBtn = modalCart.querySelector('.button-order');
  const clearCartBtn = modalCart.querySelector('.button-clear-cart');
  const clearInfoBtn = modalInfo.querySelector('.button-clear-info');
  const infoName = infoForm.querySelector('#info-login');
  const infoPhone = infoForm.querySelector('#info-phone');
  const infoAddress = infoForm.querySelector('#info-address');
  const infoTime = infoForm.querySelector('#info-time');

  const maxQuantity = 10;
  let cartArr = [];
  let customer = {};

  const openModal = (modal) => modal.classList.add('open');

  const closeModal = (e, modal) => {
    if (e.target === modal || e.target.classList.contains('close')) {
      modal.classList.remove('open');
    }
  };

  const addToCart = (id) => {
    const product = products.find((item) => item.id === id);
    const productInCart = cartArr.find((item) => item.id === product.id);

    productInCart ? productInCart.count++ : cartArr.push(product);
  };

  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cartArr));
  };

  const saveInfo = () => {
    localStorage.setItem('customer', JSON.stringify(customer));
  };

  const clearCart = () => {
    cartArr = [];
    modalBody.innerHTML = '';
    modalSum.textContent = `0 ₽`;
    orderBtn.classList.remove('open');
    modalCart.classList.remove('open');
    localStorage.removeItem('cart');
  };

  const calculateSum = () => {
    let sum = cartArr.reduce((sum, item) => item.price * item.count + sum, 0);
    modalSum.textContent = `${sum} ₽`;
  };

  const renderModalCart = () => {
    modalBody.innerHTML = '';

    cartArr.forEach(({ id, name, price, count }) => {
      const foodRow = document.createElement('div');
      foodRow.classList.add('food-row');

      foodRow.innerHTML = `
        <span class="food-name">${name}</span>
        <strong class="food-price">${price} ₽</strong>
        <div class="food-counter">
          <button class="counter-button btn-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button btn-plus" data-id=${id}>+</button>
        </div>
      `;

      modalBody.append(foodRow);
    });

    orderBtn.classList.add('open');
    calculateSum();
  };

  const renderModalInfo = () => {
    infoName.value = customer.name || '';
    infoPhone.value = customer.phone || '';
    infoAddress.value = customer.address || '';
    infoTime.value = customer.time || '';
  };

  const getUserInfo = () => {
    customer = {
      name: infoName.value,
      phone: infoPhone.value,
      address: infoAddress.value,
      time: infoTime.value,
    };

    saveInfo();
  };

  const showMessage = (message) => {
    modalInfo.classList.remove('open');

    const modalMessage = document.createElement('div');
    modalMessage.classList.add('modal', 'modal-message', 'open');

    modalMessage.innerHTML = `
      <div class="modal-dialog">
        <h2 class="modal-title">${message}</h2>
      </div>
    </div>`;

    document.body.append(modalMessage);
    document.body.classList.add('lock');

    setTimeout(() => {
      clearCart();
      modalMessage.remove();
      document.body.classList.remove('lock');
    }, 2000);
  };

  // --------------------------------

  if (localStorage.getItem('cart')) {
    cartArr = JSON.parse(localStorage.getItem('cart'));
    renderModalCart();
  }

  if (localStorage.getItem('customer')) {
    customer = JSON.parse(localStorage.getItem('customer'));
    renderModalInfo();
  }

  if (cardsContainer) {
    cardsContainer.addEventListener('click', (e) => {
      if (e.target.closest('.button-add-cart')) {
        const btn = e.target.closest('.button-add-cart');

        addToCart(btn.dataset.id);
        saveCart();
        renderModalCart();
        openModal(modalCart);
      }
    });
  }

  inputAddress.addEventListener('change', () => {
    customer.address = inputAddress.value;
    saveInfo();
    renderModalInfo();
  });

  buttonCart.addEventListener('click', () => {
    openModal(modalCart);
  });

  modalCart.addEventListener('click', (e) => {
    closeModal(e, modalCart);
  });

  modalInfo.addEventListener('click', (e) => {
    closeModal(e, modalInfo);
  });

  modalBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('counter-button')) {
      const btn = e.target;
      const product = cartArr.find((item) => item.id === btn.dataset.id);

      if (btn.classList.contains('btn-minus') && product.count > 0) {
        btn.nextElementSibling.textContent--;
        product.count--;
      } else if (btn.classList.contains('btn-plus') && product.count < maxQuantity) {
        btn.previousElementSibling.textContent++;
        product.count++;
      }

      calculateSum();
      saveCart();
    }
  });

  orderBtn.addEventListener('click', (e) => {
    modalCart.classList.remove('open');
    openModal(modalInfo);
  });

  clearCartBtn.addEventListener('click', clearCart);

  clearInfoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    infoForm.reset();
  });

  infoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    getUserInfo();

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({ customer: customer, order: cartArr }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => {
        if (res.ok) showMessage('Спасибо за заказ! <br>Мы скоро с вами свяжемся.');
      })
      .catch((err) => {
        showMessage('Извините, невозможно оформить заказ');
        console.log(err.message);
      });
  });
};
