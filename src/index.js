import Notiflix from 'notiflix';
import axios from 'axios';
import FetchApi from './fetchapi';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const fetchApi = new FetchApi();
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '46254604-623035f39894a833efa0483b4';
axios.defaults.headers.common['x-api-key'] = API_KEY;

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadBut = document.querySelector('.load-button');
let totalphoto = 0;
let loadHits = 0;
let firstSearch = true;

function ButVisibility(isVisible) {
  loadBut.classList.toggle('hide', !isVisible);
}

ButVisibility(false);
form.addEventListener('submit', async function (event) {
  event.preventDefault();
  
  const searchTerm = event.target.elements.searchQuery.value.trim();

  fetchApi.search = searchTerm;
  fetchApi.resetPage();
  totalphoto = 0;
  loadHits = 0;
  firstSearch = true;
  clearGallery();
  ButVisibility(false);
  loadcards();
});

loadBut.addEventListener('click', loadcards);

async function loadcards() {
  const resp = await fetchApi.fetchList();
  try {
    totalphoto = resp.totalHits;
    if (resp.hits.length === 0) {
      ButVisibility(false);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      gallery.innerHTML = '';
    } else {
      if (firstSearch) {
        Notiflix.Notify.success(`Hooray! We found ${totalphoto} images.`);
        firstSearch = false;
      }
      markup(resp.hits);
    
      loadHits += resp.hits.length;

      const { height: сardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: сardHeight * 1,
        behavior: 'smooth',
      });
      const lightbox = new SimpleLightbox('.photo-card a');
      lightbox.refresh();

      if (loadHits >= totalphoto) {
        ButVisibility(false);
        const Message = `<p class="message">We're sorry, but you've reached the end of search results.</p>`;
        gallery.innerHTML += Message;
      } else {
        ButVisibility(true);
      }
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function markup(images) {
  const cards = images
    .map(
      image => `
        <div class="photo-card">
        <a href="${image.largeImageURL}" alt = "">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
            <div class="info">
                <p class="info-item">
                    <b>Likes ${image.likes}</b>
                </p>
                <p class="info-item">
                    <b>Views ${image.views}</b>
                </p>
                <p class="info-item">
                    <b>Comments ${image.comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads ${image.downloads}</b>
                </p>
            </div>
        </div>
    `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', cards);
}
function clearGallery() {
  gallery.innerHTML = '';
}
