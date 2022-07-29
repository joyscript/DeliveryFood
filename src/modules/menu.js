export let products = [];

export const menu = () => {
  const cardsContainer = document.querySelector('.cards-menu');
  const restaurant = JSON.parse(localStorage.getItem('restaurant'));

  const updateHeading = (restaurant) => {
    const { name, stars, price, kitchen } = restaurant;

    document.querySelector('.restaurant-title').textContent = name;
    document.querySelector('.card-info .rating').textContent = stars;
    document.querySelector('.card-info .price').textContent = `От ${price} ₽`;
    document.querySelector('.card-info .category').textContent = kitchen;
  };

  const renderCard = (product) => {
    const { id, name, description, price, image } = product;

    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src=${image} alt="image" class="card-image" />
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}</div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart" data-id=${id}>
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">${price} ₽</strong>
        </div>
      </div>
      `;

    cardsContainer.append(card);
  };

  if (!localStorage.getItem('user')) window.location = 'index.html';

  if (restaurant) {
    updateHeading(restaurant);

    fetch(`https://deliveryfood-b2697-default-rtdb.firebaseio.com/db/${restaurant.products}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          cardsContainer.innerHTML = `
            <h3 class="card-title">Извините, невозможно отобразить продукты.<br>
            Ошибка ${res.status} - ${res.statusText}</h3>
          `;
          throw new Error(`error: ${res.status} ${res.statusText}`);
        }
      })
      .then((data) => {
        data.forEach((product) => {
          renderCard(product);

          const { id, name, price } = product;
          products.push({ id, name, price, count: 1 });
        });
      })
      .catch((err) => console.log(err.message));
  } else {
    window.location = 'index.html';
  }
};
