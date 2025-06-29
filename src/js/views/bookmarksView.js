import View from './view.js';
import previewView from './previewView.js';
import icon from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data.map(bmk => previewView.render(bmk, false)).join('');
  }
}

export default new BookmarksView();
