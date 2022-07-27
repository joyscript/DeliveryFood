export const partners = () => {
  const renderItems = (data) => {
    data.forEach((item) => console.log(item));
  };

  fetch('https://deliveryfood-b2697-default-rtdb.firebaseio.com/db/partners.json')
    .then((response) => response.json())
    .then((data) => renderItems(data))
    .catch((err) => console.log(err.message));
};
