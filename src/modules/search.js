export const search = () => {
  const markInstance = new Mark(document.querySelector('.cards-restaurants'));

  const keywordInput = document.querySelector('.input-search');

  const performMark = () => {
    const keyword = keywordInput.value;

    markInstance.unmark({
      done: function () {
        markInstance.mark(keyword);
      },
    });
  };

  keywordInput.addEventListener('change', () => {
    performMark();

    document.querySelector('mark').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
};
