export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      if (elements[elementName]) {
        const firstChild = elements[elementName].firstElementChild;
        elements[elementName].innerHTML = "";
        if (firstChild) {
          elements[elementName].appendChild(firstChild);
        }

        elements[elementName].append(
          ...Object.values(indexes[elementName]).map((name) => {
            const el = document.createElement("option");
            el.textContent = name;
            el.value = name;
            return el;
          })
        );
      }
    });
  };

  const applyFiltering = (query, state, action) => {
    // код с обработкой очистки поля
    if (action && action.name === "clear") {
      const field = action.dataset.field;

      const elementKey = Object.keys(elements).find(
        (key) => elements[key] && elements[key].name === field
      );

      if (elementKey) {
        const element = elements[elementKey];

        // Очищаем поле
        if (element.tagName === "INPUT") {
          element.value = "";
        } else if (element.tagName === "SELECT") {
          element.selectedIndex = 0;
        }

        state[element.name] = "";

        const newQuery = { ...query };
        delete newQuery[`filter[${element.name}]`];
        return newQuery;
      }
    }

    // #4.5 — отфильтровать данные, используя компаратор
    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (elements[key]) {
        if (
          ["INPUT", "SELECT"].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          // ищем поля ввода в фильтре с непустыми данными
          filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
        }
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query; // если в фильтре что-то добавилось, применим к запросу
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
