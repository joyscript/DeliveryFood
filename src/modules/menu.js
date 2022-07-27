export const menu = () => {
  const restaurant = 'tanuki';

  const renderItems = (data) => {
    data.forEach((item) => {
      console.log(item);
    });
  };

  fetch(`./db/${restaurant}.json`)
    .then((response) => response.json())
    .then((data) => renderItems(data))
    .catch((err) => console.log(err.message));
};
