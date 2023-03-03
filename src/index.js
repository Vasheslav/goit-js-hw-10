import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();

  let nameCountries = e.target.value.trim();

  fetchCountries(nameCountries)
    .then(countries => {
      console.log(countries);

      if (countries.length > 10) {
        refs.countryInfo.innerHTML = '';
        refs.countryList.innerHTML = '';

        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (countries.length >= 2 && countries.length <= 10) {
        refs.countryInfo.innerHTML = '';
        if (refs.countryList) {
          refs.countryList.innerHTML = '';
        }

        const countryList = countries
          .map(
            el =>
              `<li class='country-item'>
            <img class='country-image' src='${el.flags.svg}' alt='${el.name.official}' width='80px' height='50px'/>
            <p class='country-name'>${el.name.official}</p>
            </li>`
          )
          .join('');

        refs.countryList.insertAdjacentHTML('beforeend', countryList);
        return;
      }

      if (countries.length === 1) {
        refs.countryList.innerHTML = '';

        const countryInfo = countries
          .map(
            el =>
              `<img class='country-image' src='${el.flags.svg}' 
              alt='${el.name.official}' width='40px'/>
            <h1>${el.name.official}</h1> 
            <li class='country-info_list'>
            <p class='country-info'>Capital:
            <span class="info-values">${el.capital}</span></p>
            </li>
            <li class='country-info_list'>
            <p class='country-info'>Population: 
            <span class="info-values">${el.population}</span></p>
            </li>
            <li class='country-info_list'>
            <p class='country-info'>Languages:
            <span class="info-values">${Object.values(el.languages).join(
              ', '
            )}</span></p>
            </li>`
          )
          .join('');

        refs.countryList.insertAdjacentHTML('beforeend', countryInfo);
        return;
      }

      if (!countries.ok) {
        refs.countryInfo.innerHTML = '';
        refs.countryList.innerHTML = '';
        if (nameCountries === '') {
          return;
        }
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    return response.json();
  });
}
