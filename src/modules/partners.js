import { openModalAuth } from './auth';

export const partners = () => {
  const cardsContainer = document.querySelector('.cards-restaurants');

  const renderCard = (restaurant) => {
    const { name, time_of_delivery, stars, price, kitchen, image, products } = restaurant;

    const card = document.createElement('a');
    card.classList.add('card', 'card-restaurant');
    card.href = 'restaurant.html';

    card.innerHTML = `
      <img src=${image} alt="image" class="card-image" />
        <div class="card-text">
          <div class="card-heading">
            <h3 class="card-title">${name}</h3>
            <span class="card-tag tag">${time_of_delivery} мин</span>
          </div>
          <div class="card-info">
            <div class="rating">${stars}</div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
          </div>
        </div>
      `;

    cardsContainer.append(card);

    card.addEventListener('click', (e) => {
      e.preventDefault();

      if (localStorage.getItem('user')) {
        localStorage.setItem('restaurant', JSON.stringify(restaurant));
        window.location = 'restaurant.html';
      } else {
        openModalAuth();
      }
    });
  };

  fetch('https://deliveryfood-b2697-default-rtdb.firebaseio.com/db/partners.json')
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        cardsContainer.innerHTML = `
          <h3 class="card-title">Извините, невозможно отобразить данные.<br>
          Ошибка ${res.status} - ${res.statusText}</h3>
        `;
        throw new Error(`error: ${res.status} ${res.statusText}`);
      }
    })
    .then((data) => data.forEach((restaurant) => renderCard(restaurant)))
    .catch((err) => console.log(err.message));
};
