import axios from 'axios';
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '46254604-623035f39894a833efa0483b4';
    axios.defaults.headers.common['x-api-key'] = API_KEY;

export default class FetchApi {
  constructor() {
    this.SearchTerm = '';
      this.page = 1;
      
  }

  async fetchList() {

        const url = `${BASE_URL}?key=${API_KEY}&q=${this.SearchTerm}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        this.page += 1;
        return response.json();
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
  }
  get serch() {
    return this.SearchTerm;
  }

  set search(newSearch) {
    this.SearchTerm = newSearch;
  }

    resetPage() {
      this.page = 1;
       
  }
}
