import './styles.css';
import template from './template.hbs';
import notifications from './pnotify.js';
import ApiService from './apiService.js';
import LoadMoreBtn from './loadMoreBtn.js';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
};

const newApiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.form.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

function onSearch(event) {
  event.preventDefault();
  clearList();
  newApiService.query = event.currentTarget.elements.query.value;
  //   console.log(inputName);
  newApiService.resetPage();
  loadMoreBtn.show();
  fetchImages();
}

function createImgMarkup(items) {
  if (items.length === 0) {
    notifications.onNotFound();
  }
  if (items.length < newApiService.perPage) {
    loadMoreBtn.hide();
  }

  const galleryMarkup = items.map(item => template(item)).join('');

  return galleryMarkup;
}

function populateList(listMarkup) {
  refs.gallery.insertAdjacentHTML('beforeend', listMarkup);
}

function clearList() {
  refs.gallery.innerHTML = '';
}

function fetchImages() {
  newApiService.fetchImg().then(imgs => {
    loadMoreBtn.enable();
    const createdListMarkup = createImgMarkup(imgs);
    populateList(createdListMarkup);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  });
}
