(()=>{"use strict";var __webpack_modules__={328:()=>{eval("\n;// CONCATENATED MODULE: ./modules/auth.js\nconst auth = () => {\r\n  const buttonAuth = document.querySelector('.button-auth');\r\n  const buttonOut = document.querySelector('.button-out');\r\n  const buttonCart = document.querySelector('.button-cart');\r\n  const modalAuth = document.querySelector('.modal-auth');\r\n  const userName = document.querySelector('.user-name');\r\n  const logInForm = document.getElementById('logInForm');\r\n\r\n  const openModalAuth = () => modalAuth.classList.add('open');\r\n\r\n  const closeModalAuth = (e) => {\r\n    if (e.target === modalAuth || e.target.classList.contains('close-auth') || e.type === 'submit') {\r\n      modalAuth.classList.remove('open');\r\n    }\r\n  };\r\n\r\n  const userLogIn = (login) => {\r\n    buttonAuth.style.display = 'none';\r\n    buttonOut.style.display = 'flex';\r\n    buttonCart.style.display = 'flex';\r\n    userName.style.display = 'block';\r\n    userName.textContent = login;\r\n  };\r\n\r\n  const userLogOut = () => {\r\n    buttonAuth.style.display = 'flex';\r\n    buttonOut.style.display = '';\r\n    buttonCart.style.display = '';\r\n    userName.style.display = '';\r\n    userName.textContent = '';\r\n\r\n    localStorage.clear();\r\n    if (window.location.pathname === '/restaurant.html') window.location = 'index.html';\r\n  };\r\n\r\n  if (localStorage.getItem('user')) {\r\n    userLogIn(JSON.parse(localStorage.getItem('user')).login);\r\n  }\r\n\r\n  buttonAuth.addEventListener('click', openModalAuth);\r\n  modalAuth.addEventListener('click', closeModalAuth);\r\n  buttonOut.addEventListener('click', userLogOut);\r\n\r\n  logInForm.addEventListener('submit', (e) => {\r\n    e.preventDefault();\r\n\r\n    const login = logInForm.querySelector('#login').value;\r\n    const password = logInForm.querySelector('#password').value;\r\n\r\n    localStorage.setItem('user', JSON.stringify({ login, password }));\r\n\r\n    closeModalAuth(e);\r\n    userLogIn(login);\r\n  });\r\n};\r\n\n;// CONCATENATED MODULE: ./modules/menu.js\nlet products = [];\r\n\r\nconst menu = () => {\r\n  const cardsContainer = document.querySelector('.cards-menu');\r\n  const restaurant = JSON.parse(localStorage.getItem('restaurant'));\r\n\r\n  const updateHeading = (restaurant) => {\r\n    const { name, stars, price, kitchen } = restaurant;\r\n\r\n    document.querySelector('.restaurant-title').textContent = name;\r\n    document.querySelector('.card-info .rating').textContent = stars;\r\n    document.querySelector('.card-info .price').textContent = `От ${price} ₽`;\r\n    document.querySelector('.card-info .category').textContent = kitchen;\r\n  };\r\n\r\n  const renderCard = (product) => {\r\n    const { id, name, description, price, image } = product;\r\n\r\n    const card = document.createElement('div');\r\n    card.classList.add('card');\r\n\r\n    card.innerHTML = `\r\n      <img src=${image} alt=\"image\" class=\"card-image\" />\r\n      <div class=\"card-text\">\r\n        <div class=\"card-heading\">\r\n          <h3 class=\"card-title card-title-reg\">${name}</h3>\r\n        </div>\r\n        <div class=\"card-info\">\r\n          <div class=\"ingredients\">${description}</div>\r\n        </div>\r\n        <div class=\"card-buttons\">\r\n          <button class=\"button button-primary button-add-cart\" data-id=${id}>\r\n            <span class=\"button-card-text\">В корзину</span>\r\n            <span class=\"button-cart-svg\"></span>\r\n          </button>\r\n          <strong class=\"card-price-bold\">${price} ₽</strong>\r\n        </div>\r\n      </div>\r\n      `;\r\n\r\n    cardsContainer.append(card);\r\n  };\r\n\r\n  if (!localStorage.getItem('user')) window.location = 'index.html';\r\n\r\n  if (restaurant) {\r\n    updateHeading(restaurant);\r\n\r\n    fetch(`https://deliveryfood-b2697-default-rtdb.firebaseio.com/db/${restaurant.products}`)\r\n      .then((res) => {\r\n        if (res.ok) {\r\n          return res.json();\r\n        } else {\r\n          cardsContainer.innerHTML = `\r\n            <h3 class=\"card-title\">Извините, невозможно отобразить продукты.<br>\r\n            Ошибка ${res.status} - ${res.statusText}</h3>\r\n          `;\r\n          throw new Error(`error: ${res.status} ${res.statusText}`);\r\n        }\r\n      })\r\n      .then((data) => {\r\n        data.forEach((product) => {\r\n          renderCard(product);\r\n\r\n          const { id, name, price } = product;\r\n          products.push({ id, name, price, count: 1 });\r\n        });\r\n      })\r\n      .catch((err) => console.log(err.message));\r\n  } else {\r\n    window.location = 'index.html';\r\n  }\r\n};\r\n\n;// CONCATENATED MODULE: ./modules/cart.js\n\r\n\r\nconst cart = () => {\r\n  const cardsContainer = document.querySelector('.cards-menu');\r\n  const inputAddress = document.querySelector('.input-address');\r\n  const buttonCart = document.querySelector('.button-cart');\r\n  const modalCart = document.querySelector('.modal-cart');\r\n  const modalInfo = document.querySelector('.modal-info');\r\n  const infoForm = document.querySelector('#infoForm');\r\n\r\n  const modalBody = modalCart.querySelector('.modal-body');\r\n  const modalSum = modalCart.querySelector('.modal-pricetag');\r\n  const orderBtn = modalCart.querySelector('.button-order');\r\n  const clearCartBtn = modalCart.querySelector('.button-clear-cart');\r\n  const clearInfoBtn = modalInfo.querySelector('.button-clear-info');\r\n  const infoName = infoForm.querySelector('#info-login');\r\n  const infoPhone = infoForm.querySelector('#info-phone');\r\n  const infoAddress = infoForm.querySelector('#info-address');\r\n  const infoTime = infoForm.querySelector('#info-time');\r\n\r\n  const maxQuantity = 10;\r\n  let cartArr = [];\r\n  let customer = {};\r\n\r\n  const openModal = (modal) => modal.classList.add('open');\r\n\r\n  const closeModal = (e, modal) => {\r\n    if (e.target === modal || e.target.classList.contains('close')) {\r\n      modal.classList.remove('open');\r\n    }\r\n  };\r\n\r\n  const addToCart = (id) => {\r\n    const product = products.find((item) => item.id === id);\r\n    const productInCart = cartArr.find((item) => item.id === product.id);\r\n\r\n    productInCart ? productInCart.count++ : cartArr.push(product);\r\n  };\r\n\r\n  const saveCart = () => {\r\n    localStorage.setItem('cart', JSON.stringify(cartArr));\r\n  };\r\n\r\n  const saveInfo = () => {\r\n    localStorage.setItem('customer', JSON.stringify(customer));\r\n  };\r\n\r\n  const clearCart = () => {\r\n    cartArr = [];\r\n    modalBody.innerHTML = '';\r\n    modalSum.textContent = `0 ₽`;\r\n    orderBtn.classList.remove('open');\r\n    modalCart.classList.remove('open');\r\n    localStorage.removeItem('cart');\r\n  };\r\n\r\n  const calculateSum = () => {\r\n    let sum = cartArr.reduce((sum, item) => item.price * item.count + sum, 0);\r\n    modalSum.textContent = `${sum} ₽`;\r\n  };\r\n\r\n  const renderModalCart = () => {\r\n    modalBody.innerHTML = '';\r\n\r\n    cartArr.forEach(({ id, name, price, count }) => {\r\n      const foodRow = document.createElement('div');\r\n      foodRow.classList.add('food-row');\r\n\r\n      foodRow.innerHTML = `\r\n        <span class=\"food-name\">${name}</span>\r\n        <strong class=\"food-price\">${price} ₽</strong>\r\n        <div class=\"food-counter\">\r\n          <button class=\"counter-button btn-minus\" data-id=${id}>-</button>\r\n          <span class=\"counter\">${count}</span>\r\n          <button class=\"counter-button btn-plus\" data-id=${id}>+</button>\r\n        </div>\r\n      `;\r\n\r\n      modalBody.append(foodRow);\r\n    });\r\n\r\n    orderBtn.classList.add('open');\r\n    calculateSum();\r\n  };\r\n\r\n  const renderModalInfo = () => {\r\n    infoName.value = customer.name || '';\r\n    infoPhone.value = customer.phone || '';\r\n    infoAddress.value = customer.address || '';\r\n    infoTime.value = customer.time || '';\r\n  };\r\n\r\n  const getUserInfo = () => {\r\n    customer = {\r\n      name: infoName.value,\r\n      phone: infoPhone.value,\r\n      address: infoAddress.value,\r\n      time: infoTime.value,\r\n    };\r\n\r\n    saveInfo();\r\n  };\r\n\r\n  const showMessage = (message) => {\r\n    modalInfo.classList.remove('open');\r\n\r\n    const modalMessage = document.createElement('div');\r\n    modalMessage.classList.add('modal', 'modal-message', 'open');\r\n\r\n    modalMessage.innerHTML = `\r\n      <div class=\"modal-dialog\">\r\n        <h2 class=\"modal-title\">${message}</h2>\r\n      </div>\r\n    </div>`;\r\n\r\n    document.body.append(modalMessage);\r\n    document.body.classList.add('lock');\r\n\r\n    setTimeout(() => {\r\n      clearCart();\r\n      modalMessage.remove();\r\n      document.body.classList.remove('lock');\r\n    }, 2000);\r\n  };\r\n\r\n  // --------------------------------\r\n\r\n  if (localStorage.getItem('cart')) {\r\n    cartArr = JSON.parse(localStorage.getItem('cart'));\r\n    renderModalCart();\r\n  }\r\n\r\n  if (localStorage.getItem('customer')) {\r\n    customer = JSON.parse(localStorage.getItem('customer'));\r\n    renderModalInfo();\r\n  }\r\n\r\n  if (cardsContainer) {\r\n    cardsContainer.addEventListener('click', (e) => {\r\n      if (e.target.closest('.button-add-cart')) {\r\n        const btn = e.target.closest('.button-add-cart');\r\n\r\n        addToCart(btn.dataset.id);\r\n        saveCart();\r\n        renderModalCart();\r\n        openModal(modalCart);\r\n      }\r\n    });\r\n  }\r\n\r\n  inputAddress.addEventListener('change', () => {\r\n    customer.address = inputAddress.value;\r\n    saveInfo();\r\n    renderModalInfo();\r\n  });\r\n\r\n  buttonCart.addEventListener('click', () => {\r\n    openModal(modalCart);\r\n  });\r\n\r\n  modalCart.addEventListener('click', (e) => {\r\n    closeModal(e, modalCart);\r\n  });\r\n\r\n  modalInfo.addEventListener('click', (e) => {\r\n    closeModal(e, modalInfo);\r\n  });\r\n\r\n  modalBody.addEventListener('click', (e) => {\r\n    if (e.target.classList.contains('counter-button')) {\r\n      const btn = e.target;\r\n      const product = cartArr.find((item) => item.id === btn.dataset.id);\r\n\r\n      if (btn.classList.contains('btn-minus') && product.count > 0) {\r\n        btn.nextElementSibling.textContent--;\r\n        product.count--;\r\n      } else if (btn.classList.contains('btn-plus') && product.count < maxQuantity) {\r\n        btn.previousElementSibling.textContent++;\r\n        product.count++;\r\n      }\r\n\r\n      calculateSum();\r\n      saveCart();\r\n    }\r\n  });\r\n\r\n  orderBtn.addEventListener('click', (e) => {\r\n    modalCart.classList.remove('open');\r\n    openModal(modalInfo);\r\n  });\r\n\r\n  clearCartBtn.addEventListener('click', clearCart);\r\n\r\n  clearInfoBtn.addEventListener('click', (e) => {\r\n    e.preventDefault();\r\n    infoForm.reset();\r\n  });\r\n\r\n  infoForm.addEventListener('submit', (e) => {\r\n    e.preventDefault();\r\n    getUserInfo();\r\n\r\n    fetch('https://jsonplaceholder.typicode.com/posts', {\r\n      method: 'POST',\r\n      body: JSON.stringify({ customer: customer, order: cartArr }),\r\n      headers: {\r\n        'Content-type': 'application/json; charset=UTF-8',\r\n      },\r\n    })\r\n      .then((res) => {\r\n        if (res.ok) showMessage('Спасибо за заказ! <br>Мы скоро с вами свяжемся.');\r\n      })\r\n      .catch((err) => {\r\n        showMessage('Извините, невозможно оформить заказ');\r\n        console.log(err.message);\r\n      });\r\n  });\r\n};\r\n\n;// CONCATENATED MODULE: ./modules/swiper.js\nconst swiper = new Swiper('.swiper', {\r\n  loop: true,\r\n\r\n  autoplay: {\r\n    delay: 2500,\r\n    disableOnInteraction: false,\r\n  },\r\n\r\n  pagination: {\r\n    el: '.swiper-pagination',\r\n    clickable: true,\r\n  },\r\n\r\n  navigation: {\r\n    nextEl: '.swiper-button-next',\r\n    prevEl: '.swiper-button-prev',\r\n  },\r\n});\r\n\n;// CONCATENATED MODULE: ./modules/partners.js\nconst partners = () => {\r\n  const cardsContainer = document.querySelector('.cards-restaurants');\r\n\r\n  const renderCard = (restaurant) => {\r\n    const { name, time_of_delivery, stars, price, kitchen, image } = restaurant;\r\n\r\n    const card = document.createElement('a');\r\n    card.classList.add('card', 'card-restaurant');\r\n    card.href = 'restaurant.html';\r\n\r\n    card.innerHTML = `\r\n      <img src=${image} alt=\"image\" class=\"card-image\" />\r\n        <div class=\"card-text\">\r\n          <div class=\"card-heading\">\r\n            <h3 class=\"card-title\">${name}</h3>\r\n            <span class=\"card-tag tag\">${time_of_delivery} мин</span>\r\n          </div>\r\n          <div class=\"card-info\">\r\n            <div class=\"rating\">${stars}</div>\r\n            <div class=\"price\">От ${price} ₽</div>\r\n            <div class=\"category\">${kitchen}</div>\r\n          </div>\r\n        </div>\r\n      `;\r\n\r\n    cardsContainer.append(card);\r\n\r\n    card.addEventListener('click', (e) => {\r\n      e.preventDefault();\r\n\r\n      if (localStorage.getItem('user')) {\r\n        localStorage.setItem('restaurant', JSON.stringify(restaurant));\r\n        window.location = 'restaurant.html';\r\n      } else {\r\n        document.querySelector('.modal-auth').classList.add('open');\r\n      }\r\n    });\r\n  };\r\n\r\n  fetch('https://deliveryfood-b2697-default-rtdb.firebaseio.com/db/partners.json')\r\n    .then((res) => {\r\n      if (res.ok) {\r\n        return res.json();\r\n      } else {\r\n        cardsContainer.innerHTML = `\r\n          <h3 class=\"card-title\">Извините, невозможно отобразить данные.<br>\r\n          Ошибка ${res.status} - ${res.statusText}</h3>\r\n        `;\r\n        throw new Error(`error: ${res.status} ${res.statusText}`);\r\n      }\r\n    })\r\n    .then((data) => data.forEach((restaurant) => renderCard(restaurant)))\r\n    .catch((err) => console.log(err.message));\r\n};\r\n\n;// CONCATENATED MODULE: ./modules/search.js\nconst search = () => {\r\n  const markInstance = new Mark(document.querySelector('.cards-restaurants'));\r\n\r\n  const keywordInput = document.querySelector('.input-search');\r\n\r\n  const performMark = () => {\r\n    const keyword = keywordInput.value;\r\n\r\n    markInstance.unmark({\r\n      done: function () {\r\n        markInstance.mark(keyword);\r\n      },\r\n    });\r\n  };\r\n\r\n  keywordInput.addEventListener('change', () => {\r\n    performMark();\r\n\r\n    document.querySelector('mark').scrollIntoView({ behavior: 'smooth', block: 'center' });\r\n  });\r\n};\r\n\n;// CONCATENATED MODULE: ./index.js\n\r\n\r\n\r\n\r\n\r\n\r\nauth();\r\ncart();\r\npartners();\r\nsearch();\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QSxtQkFBbUIsWUFBWSxJQUFJLGVBQWU7QUFDbEQ7QUFDQSxrQ0FBa0MsWUFBWSxFQUFFLGVBQWU7QUFDL0Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOzs7QUNyRE87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxxQ0FBcUM7QUFDekYsR0FBRztBQUNIOzs7QUNwQnNDO0FBQ0E7QUFDSTtBQUNJO0FBQ0o7QUFDMUM7QUFDQSxJQUFJO0FBQ0osSUFBSTtBQUNKLFFBQVE7QUFDUixNQUFNIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9hdXRoLmpzPzRhNDIiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9tZW51LmpzPzUyNGIiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9jYXJ0LmpzPzJhZmEiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9zd2lwZXIuanM/OWU1ZiIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL3BhcnRuZXJzLmpzPzYzMGYiLCJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9zZWFyY2guanM/N2MzMiIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcz80MWY1Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhdXRoID0gKCkgPT4ge1xyXG4gIGNvbnN0IGJ1dHRvbkF1dGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnV0dG9uLWF1dGgnKTtcclxuICBjb25zdCBidXR0b25PdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnV0dG9uLW91dCcpO1xyXG4gIGNvbnN0IGJ1dHRvbkNhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnV0dG9uLWNhcnQnKTtcclxuICBjb25zdCBtb2RhbEF1dGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtYXV0aCcpO1xyXG4gIGNvbnN0IHVzZXJOYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXItbmFtZScpO1xyXG4gIGNvbnN0IGxvZ0luRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dJbkZvcm0nKTtcclxuXHJcbiAgY29uc3Qgb3Blbk1vZGFsQXV0aCA9ICgpID0+IG1vZGFsQXV0aC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcblxyXG4gIGNvbnN0IGNsb3NlTW9kYWxBdXRoID0gKGUpID0+IHtcclxuICAgIGlmIChlLnRhcmdldCA9PT0gbW9kYWxBdXRoIHx8IGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2xvc2UtYXV0aCcpIHx8IGUudHlwZSA9PT0gJ3N1Ym1pdCcpIHtcclxuICAgICAgbW9kYWxBdXRoLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCB1c2VyTG9nSW4gPSAobG9naW4pID0+IHtcclxuICAgIGJ1dHRvbkF1dGguc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIGJ1dHRvbk91dC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgYnV0dG9uQ2FydC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgdXNlck5hbWUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICB1c2VyTmFtZS50ZXh0Q29udGVudCA9IGxvZ2luO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHVzZXJMb2dPdXQgPSAoKSA9PiB7XHJcbiAgICBidXR0b25BdXRoLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICBidXR0b25PdXQuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgYnV0dG9uQ2FydC5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICB1c2VyTmFtZS5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICB1c2VyTmFtZS50ZXh0Q29udGVudCA9ICcnO1xyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gJy9yZXN0YXVyYW50Lmh0bWwnKSB3aW5kb3cubG9jYXRpb24gPSAnaW5kZXguaHRtbCc7XHJcbiAgfTtcclxuXHJcbiAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJykpIHtcclxuICAgIHVzZXJMb2dJbihKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJykpLmxvZ2luKTtcclxuICB9XHJcblxyXG4gIGJ1dHRvbkF1dGguYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvcGVuTW9kYWxBdXRoKTtcclxuICBtb2RhbEF1dGguYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU1vZGFsQXV0aCk7XHJcbiAgYnV0dG9uT3V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdXNlckxvZ091dCk7XHJcblxyXG4gIGxvZ0luRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGNvbnN0IGxvZ2luID0gbG9nSW5Gb3JtLnF1ZXJ5U2VsZWN0b3IoJyNsb2dpbicpLnZhbHVlO1xyXG4gICAgY29uc3QgcGFzc3dvcmQgPSBsb2dJbkZvcm0ucXVlcnlTZWxlY3RvcignI3Bhc3N3b3JkJykudmFsdWU7XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXInLCBKU09OLnN0cmluZ2lmeSh7IGxvZ2luLCBwYXNzd29yZCB9KSk7XHJcblxyXG4gICAgY2xvc2VNb2RhbEF1dGgoZSk7XHJcbiAgICB1c2VyTG9nSW4obG9naW4pO1xyXG4gIH0pO1xyXG59O1xyXG4iLCJleHBvcnQgbGV0IHByb2R1Y3RzID0gW107XHJcblxyXG5leHBvcnQgY29uc3QgbWVudSA9ICgpID0+IHtcclxuICBjb25zdCBjYXJkc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkcy1tZW51Jyk7XHJcbiAgY29uc3QgcmVzdGF1cmFudCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Jlc3RhdXJhbnQnKSk7XHJcblxyXG4gIGNvbnN0IHVwZGF0ZUhlYWRpbmcgPSAocmVzdGF1cmFudCkgPT4ge1xyXG4gICAgY29uc3QgeyBuYW1lLCBzdGFycywgcHJpY2UsIGtpdGNoZW4gfSA9IHJlc3RhdXJhbnQ7XHJcblxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc3RhdXJhbnQtdGl0bGUnKS50ZXh0Q29udGVudCA9IG5hbWU7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZC1pbmZvIC5yYXRpbmcnKS50ZXh0Q29udGVudCA9IHN0YXJzO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcmQtaW5mbyAucHJpY2UnKS50ZXh0Q29udGVudCA9IGDQntGCICR7cHJpY2V9IOKCvWA7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZC1pbmZvIC5jYXRlZ29yeScpLnRleHRDb250ZW50ID0ga2l0Y2hlbjtcclxuICB9O1xyXG5cclxuICBjb25zdCByZW5kZXJDYXJkID0gKHByb2R1Y3QpID0+IHtcclxuICAgIGNvbnN0IHsgaWQsIG5hbWUsIGRlc2NyaXB0aW9uLCBwcmljZSwgaW1hZ2UgfSA9IHByb2R1Y3Q7XHJcblxyXG4gICAgY29uc3QgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdjYXJkJyk7XHJcblxyXG4gICAgY2FyZC5pbm5lckhUTUwgPSBgXHJcbiAgICAgIDxpbWcgc3JjPSR7aW1hZ2V9IGFsdD1cImltYWdlXCIgY2xhc3M9XCJjYXJkLWltYWdlXCIgLz5cclxuICAgICAgPGRpdiBjbGFzcz1cImNhcmQtdGV4dFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRpbmdcIj5cclxuICAgICAgICAgIDxoMyBjbGFzcz1cImNhcmQtdGl0bGUgY2FyZC10aXRsZS1yZWdcIj4ke25hbWV9PC9oMz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1pbmZvXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5ncmVkaWVudHNcIj4ke2Rlc2NyaXB0aW9ufTwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWJ1dHRvbnNcIj5cclxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYnV0dG9uLXByaW1hcnkgYnV0dG9uLWFkZC1jYXJ0XCIgZGF0YS1pZD0ke2lkfT5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJidXR0b24tY2FyZC10ZXh0XCI+0JIg0LrQvtGA0LfQuNC90YM8L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYnV0dG9uLWNhcnQtc3ZnXCI+PC9zcGFuPlxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8c3Ryb25nIGNsYXNzPVwiY2FyZC1wcmljZS1ib2xkXCI+JHtwcmljZX0g4oK9PC9zdHJvbmc+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICBgO1xyXG5cclxuICAgIGNhcmRzQ29udGFpbmVyLmFwcGVuZChjYXJkKTtcclxuICB9O1xyXG5cclxuICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJykpIHdpbmRvdy5sb2NhdGlvbiA9ICdpbmRleC5odG1sJztcclxuXHJcbiAgaWYgKHJlc3RhdXJhbnQpIHtcclxuICAgIHVwZGF0ZUhlYWRpbmcocmVzdGF1cmFudCk7XHJcblxyXG4gICAgZmV0Y2goYGh0dHBzOi8vZGVsaXZlcnlmb29kLWIyNjk3LWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9kYi8ke3Jlc3RhdXJhbnQucHJvZHVjdHN9YClcclxuICAgICAgLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICAgIHJldHVybiByZXMuanNvbigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjYXJkc0NvbnRhaW5lci5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgICAgIDxoMyBjbGFzcz1cImNhcmQtdGl0bGVcIj7QmNC30LLQuNC90LjRgtC1LCDQvdC10LLQvtC30LzQvtC20L3QviDQvtGC0L7QsdGA0LDQt9C40YLRjCDQv9GA0L7QtNGD0LrRgtGLLjxicj5cclxuICAgICAgICAgICAg0J7RiNC40LHQutCwICR7cmVzLnN0YXR1c30gLSAke3Jlcy5zdGF0dXNUZXh0fTwvaDM+XHJcbiAgICAgICAgICBgO1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBlcnJvcjogJHtyZXMuc3RhdHVzfSAke3Jlcy5zdGF0dXNUZXh0fWApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICBkYXRhLmZvckVhY2goKHByb2R1Y3QpID0+IHtcclxuICAgICAgICAgIHJlbmRlckNhcmQocHJvZHVjdCk7XHJcblxyXG4gICAgICAgICAgY29uc3QgeyBpZCwgbmFtZSwgcHJpY2UgfSA9IHByb2R1Y3Q7XHJcbiAgICAgICAgICBwcm9kdWN0cy5wdXNoKHsgaWQsIG5hbWUsIHByaWNlLCBjb3VudDogMSB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdpbmRvdy5sb2NhdGlvbiA9ICdpbmRleC5odG1sJztcclxuICB9XHJcbn07XHJcbiIsImltcG9ydCB7IHByb2R1Y3RzIH0gZnJvbSAnLi9tZW51JztcclxuXHJcbmV4cG9ydCBjb25zdCBjYXJ0ID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNhcmRzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcmRzLW1lbnUnKTtcclxuICBjb25zdCBpbnB1dEFkZHJlc3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW5wdXQtYWRkcmVzcycpO1xyXG4gIGNvbnN0IGJ1dHRvbkNhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnV0dG9uLWNhcnQnKTtcclxuICBjb25zdCBtb2RhbENhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY2FydCcpO1xyXG4gIGNvbnN0IG1vZGFsSW5mbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1pbmZvJyk7XHJcbiAgY29uc3QgaW5mb0Zvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW5mb0Zvcm0nKTtcclxuXHJcbiAgY29uc3QgbW9kYWxCb2R5ID0gbW9kYWxDYXJ0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1ib2R5Jyk7XHJcbiAgY29uc3QgbW9kYWxTdW0gPSBtb2RhbENhcnQucXVlcnlTZWxlY3RvcignLm1vZGFsLXByaWNldGFnJyk7XHJcbiAgY29uc3Qgb3JkZXJCdG4gPSBtb2RhbENhcnQucXVlcnlTZWxlY3RvcignLmJ1dHRvbi1vcmRlcicpO1xyXG4gIGNvbnN0IGNsZWFyQ2FydEJ0biA9IG1vZGFsQ2FydC5xdWVyeVNlbGVjdG9yKCcuYnV0dG9uLWNsZWFyLWNhcnQnKTtcclxuICBjb25zdCBjbGVhckluZm9CdG4gPSBtb2RhbEluZm8ucXVlcnlTZWxlY3RvcignLmJ1dHRvbi1jbGVhci1pbmZvJyk7XHJcbiAgY29uc3QgaW5mb05hbWUgPSBpbmZvRm9ybS5xdWVyeVNlbGVjdG9yKCcjaW5mby1sb2dpbicpO1xyXG4gIGNvbnN0IGluZm9QaG9uZSA9IGluZm9Gb3JtLnF1ZXJ5U2VsZWN0b3IoJyNpbmZvLXBob25lJyk7XHJcbiAgY29uc3QgaW5mb0FkZHJlc3MgPSBpbmZvRm9ybS5xdWVyeVNlbGVjdG9yKCcjaW5mby1hZGRyZXNzJyk7XHJcbiAgY29uc3QgaW5mb1RpbWUgPSBpbmZvRm9ybS5xdWVyeVNlbGVjdG9yKCcjaW5mby10aW1lJyk7XHJcblxyXG4gIGNvbnN0IG1heFF1YW50aXR5ID0gMTA7XHJcbiAgbGV0IGNhcnRBcnIgPSBbXTtcclxuICBsZXQgY3VzdG9tZXIgPSB7fTtcclxuXHJcbiAgY29uc3Qgb3Blbk1vZGFsID0gKG1vZGFsKSA9PiBtb2RhbC5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcblxyXG4gIGNvbnN0IGNsb3NlTW9kYWwgPSAoZSwgbW9kYWwpID0+IHtcclxuICAgIGlmIChlLnRhcmdldCA9PT0gbW9kYWwgfHwgZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjbG9zZScpKSB7XHJcbiAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBhZGRUb0NhcnQgPSAoaWQpID0+IHtcclxuICAgIGNvbnN0IHByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKChpdGVtKSA9PiBpdGVtLmlkID09PSBpZCk7XHJcbiAgICBjb25zdCBwcm9kdWN0SW5DYXJ0ID0gY2FydEFyci5maW5kKChpdGVtKSA9PiBpdGVtLmlkID09PSBwcm9kdWN0LmlkKTtcclxuXHJcbiAgICBwcm9kdWN0SW5DYXJ0ID8gcHJvZHVjdEluQ2FydC5jb3VudCsrIDogY2FydEFyci5wdXNoKHByb2R1Y3QpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNhdmVDYXJ0ID0gKCkgPT4ge1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhcnQnLCBKU09OLnN0cmluZ2lmeShjYXJ0QXJyKSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc2F2ZUluZm8gPSAoKSA9PiB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY3VzdG9tZXInLCBKU09OLnN0cmluZ2lmeShjdXN0b21lcikpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGNsZWFyQ2FydCA9ICgpID0+IHtcclxuICAgIGNhcnRBcnIgPSBbXTtcclxuICAgIG1vZGFsQm9keS5pbm5lckhUTUwgPSAnJztcclxuICAgIG1vZGFsU3VtLnRleHRDb250ZW50ID0gYDAg4oK9YDtcclxuICAgIG9yZGVyQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgIG1vZGFsQ2FydC5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnY2FydCcpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGNhbGN1bGF0ZVN1bSA9ICgpID0+IHtcclxuICAgIGxldCBzdW0gPSBjYXJ0QXJyLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiBpdGVtLnByaWNlICogaXRlbS5jb3VudCArIHN1bSwgMCk7XHJcbiAgICBtb2RhbFN1bS50ZXh0Q29udGVudCA9IGAke3N1bX0g4oK9YDtcclxuICB9O1xyXG5cclxuICBjb25zdCByZW5kZXJNb2RhbENhcnQgPSAoKSA9PiB7XHJcbiAgICBtb2RhbEJvZHkuaW5uZXJIVE1MID0gJyc7XHJcblxyXG4gICAgY2FydEFyci5mb3JFYWNoKCh7IGlkLCBuYW1lLCBwcmljZSwgY291bnQgfSkgPT4ge1xyXG4gICAgICBjb25zdCBmb29kUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgIGZvb2RSb3cuY2xhc3NMaXN0LmFkZCgnZm9vZC1yb3cnKTtcclxuXHJcbiAgICAgIGZvb2RSb3cuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZm9vZC1uYW1lXCI+JHtuYW1lfTwvc3Bhbj5cclxuICAgICAgICA8c3Ryb25nIGNsYXNzPVwiZm9vZC1wcmljZVwiPiR7cHJpY2V9IOKCvTwvc3Ryb25nPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb29kLWNvdW50ZXJcIj5cclxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJjb3VudGVyLWJ1dHRvbiBidG4tbWludXNcIiBkYXRhLWlkPSR7aWR9Pi08L2J1dHRvbj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY291bnRlclwiPiR7Y291bnR9PC9zcGFuPlxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNvdW50ZXItYnV0dG9uIGJ0bi1wbHVzXCIgZGF0YS1pZD0ke2lkfT4rPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIGA7XHJcblxyXG4gICAgICBtb2RhbEJvZHkuYXBwZW5kKGZvb2RSb3cpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgb3JkZXJCdG4uY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xyXG4gICAgY2FsY3VsYXRlU3VtKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVuZGVyTW9kYWxJbmZvID0gKCkgPT4ge1xyXG4gICAgaW5mb05hbWUudmFsdWUgPSBjdXN0b21lci5uYW1lIHx8ICcnO1xyXG4gICAgaW5mb1Bob25lLnZhbHVlID0gY3VzdG9tZXIucGhvbmUgfHwgJyc7XHJcbiAgICBpbmZvQWRkcmVzcy52YWx1ZSA9IGN1c3RvbWVyLmFkZHJlc3MgfHwgJyc7XHJcbiAgICBpbmZvVGltZS52YWx1ZSA9IGN1c3RvbWVyLnRpbWUgfHwgJyc7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZ2V0VXNlckluZm8gPSAoKSA9PiB7XHJcbiAgICBjdXN0b21lciA9IHtcclxuICAgICAgbmFtZTogaW5mb05hbWUudmFsdWUsXHJcbiAgICAgIHBob25lOiBpbmZvUGhvbmUudmFsdWUsXHJcbiAgICAgIGFkZHJlc3M6IGluZm9BZGRyZXNzLnZhbHVlLFxyXG4gICAgICB0aW1lOiBpbmZvVGltZS52YWx1ZSxcclxuICAgIH07XHJcblxyXG4gICAgc2F2ZUluZm8oKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBzaG93TWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XHJcbiAgICBtb2RhbEluZm8uY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG5cclxuICAgIGNvbnN0IG1vZGFsTWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgbW9kYWxNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ21vZGFsJywgJ21vZGFsLW1lc3NhZ2UnLCAnb3BlbicpO1xyXG5cclxuICAgIG1vZGFsTWVzc2FnZS5pbm5lckhUTUwgPSBgXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj5cclxuICAgICAgICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiPiR7bWVzc2FnZX08L2gyPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PmA7XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmQobW9kYWxNZXNzYWdlKTtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbG9jaycpO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBjbGVhckNhcnQoKTtcclxuICAgICAgbW9kYWxNZXNzYWdlLnJlbW92ZSgpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2xvY2snKTtcclxuICAgIH0sIDIwMDApO1xyXG4gIH07XHJcblxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FydCcpKSB7XHJcbiAgICBjYXJ0QXJyID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FydCcpKTtcclxuICAgIHJlbmRlck1vZGFsQ2FydCgpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjdXN0b21lcicpKSB7XHJcbiAgICBjdXN0b21lciA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2N1c3RvbWVyJykpO1xyXG4gICAgcmVuZGVyTW9kYWxJbmZvKCk7XHJcbiAgfVxyXG5cclxuICBpZiAoY2FyZHNDb250YWluZXIpIHtcclxuICAgIGNhcmRzQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy5idXR0b24tYWRkLWNhcnQnKSkge1xyXG4gICAgICAgIGNvbnN0IGJ0biA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5idXR0b24tYWRkLWNhcnQnKTtcclxuXHJcbiAgICAgICAgYWRkVG9DYXJ0KGJ0bi5kYXRhc2V0LmlkKTtcclxuICAgICAgICBzYXZlQ2FydCgpO1xyXG4gICAgICAgIHJlbmRlck1vZGFsQ2FydCgpO1xyXG4gICAgICAgIG9wZW5Nb2RhbChtb2RhbENhcnQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlucHV0QWRkcmVzcy5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICBjdXN0b21lci5hZGRyZXNzID0gaW5wdXRBZGRyZXNzLnZhbHVlO1xyXG4gICAgc2F2ZUluZm8oKTtcclxuICAgIHJlbmRlck1vZGFsSW5mbygpO1xyXG4gIH0pO1xyXG5cclxuICBidXR0b25DYXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgb3Blbk1vZGFsKG1vZGFsQ2FydCk7XHJcbiAgfSk7XHJcblxyXG4gIG1vZGFsQ2FydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBjbG9zZU1vZGFsKGUsIG1vZGFsQ2FydCk7XHJcbiAgfSk7XHJcblxyXG4gIG1vZGFsSW5mby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBjbG9zZU1vZGFsKGUsIG1vZGFsSW5mbyk7XHJcbiAgfSk7XHJcblxyXG4gIG1vZGFsQm9keS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb3VudGVyLWJ1dHRvbicpKSB7XHJcbiAgICAgIGNvbnN0IGJ0biA9IGUudGFyZ2V0O1xyXG4gICAgICBjb25zdCBwcm9kdWN0ID0gY2FydEFyci5maW5kKChpdGVtKSA9PiBpdGVtLmlkID09PSBidG4uZGF0YXNldC5pZCk7XHJcblxyXG4gICAgICBpZiAoYnRuLmNsYXNzTGlzdC5jb250YWlucygnYnRuLW1pbnVzJykgJiYgcHJvZHVjdC5jb3VudCA+IDApIHtcclxuICAgICAgICBidG4ubmV4dEVsZW1lbnRTaWJsaW5nLnRleHRDb250ZW50LS07XHJcbiAgICAgICAgcHJvZHVjdC5jb3VudC0tO1xyXG4gICAgICB9IGVsc2UgaWYgKGJ0bi5jbGFzc0xpc3QuY29udGFpbnMoJ2J0bi1wbHVzJykgJiYgcHJvZHVjdC5jb3VudCA8IG1heFF1YW50aXR5KSB7XHJcbiAgICAgICAgYnRuLnByZXZpb3VzRWxlbWVudFNpYmxpbmcudGV4dENvbnRlbnQrKztcclxuICAgICAgICBwcm9kdWN0LmNvdW50Kys7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNhbGN1bGF0ZVN1bSgpO1xyXG4gICAgICBzYXZlQ2FydCgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBvcmRlckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBtb2RhbENhcnQuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4gICAgb3Blbk1vZGFsKG1vZGFsSW5mbyk7XHJcbiAgfSk7XHJcblxyXG4gIGNsZWFyQ2FydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsZWFyQ2FydCk7XHJcblxyXG4gIGNsZWFySW5mb0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpbmZvRm9ybS5yZXNldCgpO1xyXG4gIH0pO1xyXG5cclxuICBpbmZvRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZ2V0VXNlckluZm8oKTtcclxuXHJcbiAgICBmZXRjaCgnaHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3RzJywge1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBjdXN0b21lcjogY3VzdG9tZXIsIG9yZGVyOiBjYXJ0QXJyIH0pLFxyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgJ0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04JyxcclxuICAgICAgfSxcclxuICAgIH0pXHJcbiAgICAgIC50aGVuKChyZXMpID0+IHtcclxuICAgICAgICBpZiAocmVzLm9rKSBzaG93TWVzc2FnZSgn0KHQv9Cw0YHQuNCx0L4g0LfQsCDQt9Cw0LrQsNC3ISA8YnI+0JzRiyDRgdC60L7RgNC+INGBINCy0LDQvNC4INGB0LLRj9C20LXQvNGB0Y8uJyk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgc2hvd01lc3NhZ2UoJ9CY0LfQstC40L3QuNGC0LUsINC90LXQstC+0LfQvNC+0LbQvdC+INC+0YTQvtGA0LzQuNGC0Ywg0LfQsNC60LDQtycpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcbiIsImV4cG9ydCBjb25zdCBzd2lwZXIgPSBuZXcgU3dpcGVyKCcuc3dpcGVyJywge1xyXG4gIGxvb3A6IHRydWUsXHJcblxyXG4gIGF1dG9wbGF5OiB7XHJcbiAgICBkZWxheTogMjUwMCxcclxuICAgIGRpc2FibGVPbkludGVyYWN0aW9uOiBmYWxzZSxcclxuICB9LFxyXG5cclxuICBwYWdpbmF0aW9uOiB7XHJcbiAgICBlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXHJcbiAgICBjbGlja2FibGU6IHRydWUsXHJcbiAgfSxcclxuXHJcbiAgbmF2aWdhdGlvbjoge1xyXG4gICAgbmV4dEVsOiAnLnN3aXBlci1idXR0b24tbmV4dCcsXHJcbiAgICBwcmV2RWw6ICcuc3dpcGVyLWJ1dHRvbi1wcmV2JyxcclxuICB9LFxyXG59KTtcclxuIiwiZXhwb3J0IGNvbnN0IHBhcnRuZXJzID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNhcmRzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcmRzLXJlc3RhdXJhbnRzJyk7XHJcblxyXG4gIGNvbnN0IHJlbmRlckNhcmQgPSAocmVzdGF1cmFudCkgPT4ge1xyXG4gICAgY29uc3QgeyBuYW1lLCB0aW1lX29mX2RlbGl2ZXJ5LCBzdGFycywgcHJpY2UsIGtpdGNoZW4sIGltYWdlIH0gPSByZXN0YXVyYW50O1xyXG5cclxuICAgIGNvbnN0IGNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ2NhcmQnLCAnY2FyZC1yZXN0YXVyYW50Jyk7XHJcbiAgICBjYXJkLmhyZWYgPSAncmVzdGF1cmFudC5odG1sJztcclxuXHJcbiAgICBjYXJkLmlubmVySFRNTCA9IGBcclxuICAgICAgPGltZyBzcmM9JHtpbWFnZX0gYWx0PVwiaW1hZ2VcIiBjbGFzcz1cImNhcmQtaW1hZ2VcIiAvPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLXRleHRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRpbmdcIj5cclxuICAgICAgICAgICAgPGgzIGNsYXNzPVwiY2FyZC10aXRsZVwiPiR7bmFtZX08L2gzPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhcmQtdGFnIHRhZ1wiPiR7dGltZV9vZl9kZWxpdmVyeX0g0LzQuNC9PC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1pbmZvXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyYXRpbmdcIj4ke3N0YXJzfTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJpY2VcIj7QntGCICR7cHJpY2V9IOKCvTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2F0ZWdvcnlcIj4ke2tpdGNoZW59PC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgYDtcclxuXHJcbiAgICBjYXJkc0NvbnRhaW5lci5hcHBlbmQoY2FyZCk7XHJcblxyXG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpKSB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Jlc3RhdXJhbnQnLCBKU09OLnN0cmluZ2lmeShyZXN0YXVyYW50KSk7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJ3Jlc3RhdXJhbnQuaHRtbCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLWF1dGgnKS5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGZldGNoKCdodHRwczovL2RlbGl2ZXJ5Zm9vZC1iMjY5Ny1kZWZhdWx0LXJ0ZGIuZmlyZWJhc2Vpby5jb20vZGIvcGFydG5lcnMuanNvbicpXHJcbiAgICAudGhlbigocmVzKSA9PiB7XHJcbiAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICByZXR1cm4gcmVzLmpzb24oKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYXJkc0NvbnRhaW5lci5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgICA8aDMgY2xhc3M9XCJjYXJkLXRpdGxlXCI+0JjQt9Cy0LjQvdC40YLQtSwg0L3QtdCy0L7Qt9C80L7QttC90L4g0L7RgtC+0LHRgNCw0LfQuNGC0Ywg0LTQsNC90L3Ri9C1Ljxicj5cclxuICAgICAgICAgINCe0YjQuNCx0LrQsCAke3Jlcy5zdGF0dXN9IC0gJHtyZXMuc3RhdHVzVGV4dH08L2gzPlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBlcnJvcjogJHtyZXMuc3RhdHVzfSAke3Jlcy5zdGF0dXNUZXh0fWApO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oKGRhdGEpID0+IGRhdGEuZm9yRWFjaCgocmVzdGF1cmFudCkgPT4gcmVuZGVyQ2FyZChyZXN0YXVyYW50KSkpXHJcbiAgICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpKTtcclxufTtcclxuIiwiZXhwb3J0IGNvbnN0IHNlYXJjaCA9ICgpID0+IHtcclxuICBjb25zdCBtYXJrSW5zdGFuY2UgPSBuZXcgTWFyayhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZHMtcmVzdGF1cmFudHMnKSk7XHJcblxyXG4gIGNvbnN0IGtleXdvcmRJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbnB1dC1zZWFyY2gnKTtcclxuXHJcbiAgY29uc3QgcGVyZm9ybU1hcmsgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBrZXl3b3JkID0ga2V5d29yZElucHV0LnZhbHVlO1xyXG5cclxuICAgIG1hcmtJbnN0YW5jZS51bm1hcmsoe1xyXG4gICAgICBkb25lOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbWFya0luc3RhbmNlLm1hcmsoa2V5d29yZCk7XHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBrZXl3b3JkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xyXG4gICAgcGVyZm9ybU1hcmsoKTtcclxuXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYXJrJykuc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogJ3Ntb290aCcsIGJsb2NrOiAnY2VudGVyJyB9KTtcclxuICB9KTtcclxufTtcclxuIiwiaW1wb3J0IHsgYXV0aCB9IGZyb20gJy4vbW9kdWxlcy9hdXRoJztcclxuaW1wb3J0IHsgY2FydCB9IGZyb20gJy4vbW9kdWxlcy9jYXJ0JztcclxuaW1wb3J0IHsgc3dpcGVyIH0gZnJvbSAnLi9tb2R1bGVzL3N3aXBlcic7XHJcbmltcG9ydCB7IHBhcnRuZXJzIH0gZnJvbSAnLi9tb2R1bGVzL3BhcnRuZXJzJztcclxuaW1wb3J0IHsgc2VhcmNoIH0gZnJvbSAnLi9tb2R1bGVzL3NlYXJjaCc7XHJcblxyXG5hdXRoKCk7XHJcbmNhcnQoKTtcclxucGFydG5lcnMoKTtcclxuc2VhcmNoKCk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///328\n")}},__webpack_exports__={};__webpack_modules__[328]()})();