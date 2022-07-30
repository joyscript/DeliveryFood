import { products } from './menu';

export const cart = () => {
  const cardsContainer = document.querySelector('.cards-menu');
  const buttonCart = document.querySelector('.button-cart');
  const modalCart = document.querySelector('.modal-cart');
  const modalBody = modalCart.querySelector('.modal-body');
  const modalHeader = modalCart.querySelector('.modal-header');
  const modalFooter = modalCart.querySelector('.modal-footer');
  const modalSum = modalCart.querySelector('.modal-pricetag');
  const clearBtn = modalCart.querySelector('.clear-cart');
  const sendBtn = modalCart.querySelector('.button-send');
  const maxQuantity = 10;
  let cartArr = [];

  const openModalCart = () => modalCart.classList.add('open');

  const closeModalCart = (e) => {
    if (e.target === modalCart || e.target.classList.contains('close')) {
      modalCart.classList.remove('open');
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

  const clearCart = () => {
    cartArr = [];
    modalBody.innerHTML = '';
    modalSum.textContent = `0 ₽`;
    sendBtn.classList.remove('open');
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

    sendBtn.classList.add('open');

    calculateSum();
  };

  const showMessage = (message) => {
    modalBody.innerHTML = `<h2 class="card-title">${message}</h2>`;
    modalHeader.classList.add('invisible');
    modalFooter.classList.add('invisible');
    document.body.classList.add('lock');

    setTimeout(() => {
      clearCart();
      modalHeader.classList.remove('invisible');
      modalFooter.classList.remove('invisible');
      document.body.classList.remove('lock');
    }, 2000);
  };

  // --------------------------------

  if (localStorage.getItem('cart')) {
    cartArr = JSON.parse(localStorage.getItem('cart'));
    renderModalCart();
  }

  if (cardsContainer) {
    cardsContainer.addEventListener('click', (e) => {
      if (e.target.closest('.button-add-cart')) {
        const btn = e.target.closest('.button-add-cart');

        addToCart(btn.dataset.id);
        saveCart();
        renderModalCart();
        openModalCart();
      }
    });
  }

  buttonCart.addEventListener('click', openModalCart);
  modalCart.addEventListener('click', closeModalCart);
  clearBtn.addEventListener('click', clearCart);

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

  sendBtn.addEventListener('click', () => {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: localStorage.getItem('cart'),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => {
        if (res.ok) showMessage('Спасибо за заказ! Мы скоро с вами свяжемся.');
      })
      .catch((err) => {
        showMessage('Извините, невозможно оформить заказ');
        console.log(err.message);
      });
  });
};
