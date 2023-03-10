import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();

  let nameCountries = e.target.value.trim();

  if (!nameCountries) {
    Notiflix.Notify.info('Please enter the name of the country!');
    return;
  }

  fetchCountries(nameCountries)
    .then(countries => {
      if (countries.length > 10) {
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';

        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (countries.length >= 2 && countries.length <= 10) {
        const countryEl = countries
          .map(
            el =>
              `<li class='country-item'>
            <img class='country-image' src='${el.flags.svg}' alt='${el.name.official}' width='80px' height='50px'/>
            <p class='country-name'>${el.name.official}</p>
            </li>`
          )
          .join('');

        countryList.innerHTML = countryEl;
        return;
      }

      if (countries.length === 1) {
        const countryInfo = countries
          .map(
            el =>
              `<div class='country-title'>
              <img class='country-image' src='${el.flags.svg}' 
              alt='${el.name.official}' width='100px'/>
            <h1 class='country-name_title'>${el.name.official}</h1> 
            </div>
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

        countryList.innerHTML = countryInfo;
        return;
      }

      if (!countries.ok) {
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';
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
