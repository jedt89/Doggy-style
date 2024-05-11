let dogBreeds = {};
let randomImages = [];
let currentImages = [];
let toggleFilter = true;
let mainContainer = document.querySelector('.main-container');
const imagesContainer = document.querySelector('#images-container');
const sideMenu = document.querySelector('#side-menu');
const navToggle = document.querySelector('#nav-toggle');
const breedTitle = document.querySelector('#breed-title');

const hexColors = [
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
  '#800000',
  '#008000',
  '#000080',
  '#FFA500',
  '#FFC0CB',
  '#800080',
  '#008080',
  '#FFD700',
  '#FF6347',
  '#7FFFD4',
  '#FF69B4',
  '#800000',
  '#FF4500',
  '#4169E1'
];

const getDogBreeds = async () =>
  fetchData('https://dog.ceo/api/breeds/list/all');
const getRandomImages = async () =>
  fetchData('https://dog.ceo/api/breeds/image/random/50');
const getImagesByBreed = async (breed) =>
  fetchData(`https://dog.ceo/api/breed/${breed || 'hound'}/images`);

const fetchData = async (url) => {
  try {
    showLoader();
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  } finally {
    hideLoader();
  }
};

const renderImages = (images) => {
  imagesContainer.innerHTML = '';
  images.forEach((image) => {
    const card = `
      <div class="card">
        <div>
          <img src="${image}" alt="imagen">
        </div>
        <a href="${image}" target="_blank">
          <button class="open-img">Abrir imagen</button>
        </a>  
      </div>
    `;
    imagesContainer.insertAdjacentHTML('beforeend', card);
  });
};

const renderDogBreeds = () => {
  const breedList = Object.keys(dogBreeds.message);
  breedList.forEach((breed) => {
    const color = hexColors[Math.floor(Math.random() * hexColors.length)];
    const filterCard = `
      <div class="card-filter" onclick="reloadImages('${breed}')">
          <i class="item-icon fa-solid fa-dog" style="color: ${color};"></i>
        <p class="card-text">
            ${breed}
        </p>
      </div>
    `;
    sideMenu.insertAdjacentHTML('beforeend', filterCard);
  });
};

const reloadImages = async (breed) => {
  breedTitle.textContent = `${breed} !!`;
  try {
    showLoader();
    randomImages = await getImagesByBreed(breed);
    renderImages(randomImages.message.slice(0, 35));
  } catch (error) {
    console.error('Error reloading images:', error);
  } finally {
    hideLoader();
  }
};

const handleFilter = () => {
  if (window.matchMedia('(max-width: 768px)').matches) {
    toggleFilter = !toggleFilter;
    console.log('toggleFilter', toggleFilter);

    if (toggleFilter) {
      sideMenu.classList.remove('display-none');
      sideMenu.classList.add('side-menu');
    } else {
      sideMenu.classList.remove('side-menu');
      sideMenu.classList.add('display-none');
    }
  }
};

const showLoader = () => {
  const loader = document.querySelector('#loader');
  loader.classList.remove('display-none');
  loader.classList.add('loader');
};

const hideLoader = () => {
  const loader = document.querySelector('#loader');
  setTimeout(() => {
    loader.classList.remove('loader');
    loader.classList.add('opacity-none');
  }, 3000);
  loader.classList.remove('opacity-none');
  loader.classList.add('display-none');
};

const handleMediaQueryChange = (event) => {
  console.log('handleMediaQueryChange');
  sideMenu.classList.remove('display-none');
  sideMenu.classList.add('side-menu');
};

const init = async () => {
  try {
    showLoader();
    [dogBreeds, randomImages, currentImages] = await Promise.all([
      getDogBreeds(),
      getRandomImages(),
      getImagesByBreed('beagle')
    ]);
    renderImages(currentImages.message.slice(0, 35));
    renderDogBreeds();
    breedTitle.textContent = 'Beagle !!';
  } catch (error) {
    console.error('Initialization error:', error);
  } finally {
    hideLoader();
  }
};

init();

document.addEventListener('DOMContentLoaded', () => hideLoader());
navToggle.addEventListener('click', () => handleFilter());
window.matchMedia('(min-width: 769px)').addListener(handleMediaQueryChange);
handleMediaQueryChange(window.matchMedia('(max-width: 768px)'));
