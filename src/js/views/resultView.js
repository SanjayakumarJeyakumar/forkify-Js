import View from './view.js';
import previewView from './previewView.js';
import icon from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found on your query, please Try again :)';
  _message = '';

  _generateMarkup() {
    return this._data.map(rec => previewView.render(rec, false)).join('');
  }
}

export default new ResultsView();
